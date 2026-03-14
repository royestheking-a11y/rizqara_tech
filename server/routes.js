const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Service, Project, Review, Blog, Job, Video, Carousel, BuildOption, Message, Promotion, CareerApplication, CaseStudy } = require('./models/Schemas');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config for generic upload (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to map collection names to Models
const models = {
    services: Service,
    projects: Project,
    reviews: Review,
    blogs: Blog,
    jobs: Job,
    videos: Video,
    carousel: Carousel,
    buildOptions: BuildOption,
    messages: Message,
    promotion: Promotion,
    careerApplications: CareerApplication,
    caseStudies: CaseStudy
};

const translate = require('translation-google');

// --- In-Memory Cache Implementation ---
const cache = {
    data: {},
    ttl: 5 * 60 * 1000, // 5 minute TTL
    set: function(key, val) {
        this.data[key] = {
            value: val,
            expiry: Date.now() + this.ttl
        };
    },
    get: function(key) {
        const item = this.data[key];
        if (!item) return null;
        if (Date.now() > item.expiry) {
            delete this.data[key];
            return null;
        }
        return item.value;
    },
    clear: function(key) {
        if (key) delete this.data[key];
        else this.data = {};
    }
};

// --- UPLOAD ROUTE (Must be before generic :collection routes) ---
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Convert buffer to data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    try {
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'rizqaratech/uploads'
        });
        res.json({ url: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- IMAGE PROXY ROUTE (Bypass ISP Blocks) ---
router.get('/proxy-image', (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('URL required');

    try {
        const { URL } = require('url');
        const parsedUrl = new URL(imageUrl);
        const protocol = parsedUrl.protocol === 'https:' ? require('https') : require('http');

        const proxyReq = protocol.get(imageUrl, (proxyRes) => {
            if (proxyRes.statusCode !== 200) {
                proxyRes.resume(); // Consume response data to free up memory
                return res.status(502).send(`Upstream Error: ${proxyRes.statusCode}`);
            }

            const contentType = proxyRes.headers['content-type'];
            if (contentType) res.setHeader('Content-Type', contentType);

            res.setHeader('Cache-Control', 'public, max-age=86400');
            res.setHeader('Access-Control-Allow-Origin', '*');

            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            console.error('Proxy Error:', err.message);
            if (!res.headersSent) res.status(500).send(`Proxy Request Failed: ${err.message}`);
        });

    } catch (err) {
        console.error('Proxy URL Error:', err.message);
        if (!res.headersSent) res.status(400).send(`Invalid URL: ${err.message}`);
    }
});

// --- RSS FEED ROUTE ---
router.get('/rss', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }).limit(20);
        const projects = await Project.find().sort({ createdAt: -1 }).limit(10);

        const siteUrl = 'https://rizqara.tech';
        const logoUrl = 'https://rizqara.tech/logo.png';
        
        let rssItems = '';

        // Helper to escape XML special characters
        const esc = (str) => (str || '').replace(/[&<>"']/g, (m) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
        }[m]));

        // Add Blogs to RSS
        blogs.forEach(blog => {
            const blogLink = `${siteUrl}/blog/${blog.id}`;
            const pubDate = new Date(blog.date).toUTCString();
            rssItems += `
        <item>
            <title>${esc(blog.title)}</title>
            <link>${blogLink}</link>
            <guid isPermaLink="true">${blogLink}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${blog.excerpt}]]></description>
            <category>${esc(blog.category || 'Blog')}</category>
            <enclosure url="${blog.image}" length="512000" type="image/jpeg" />
            <media:content url="${blog.image}" medium="image" width="1200" height="630">
                <media:title type="html"><![CDATA[${blog.title}]]></media:title>
            </media:content>
        </item>`;
        });

        // Add Projects to RSS
        projects.forEach(project => {
            const projectLink = `${siteUrl}/projects/${project.id}`;
            const pubDate = new Date(project.updatedAt || project.createdAt || Date.now()).toUTCString();
            rssItems += `
        <item>
            <title>Project: ${esc(project.title)}</title>
            <link>${projectLink}</link>
            <guid isPermaLink="true">${projectLink}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${project.description}]]></description>
            <category>${esc(project.category || 'Project')}</category>
            <enclosure url="${project.image}" length="512000" type="image/jpeg" />
            <media:content url="${project.image}" medium="image" width="1200" height="630">
                <media:title type="html"><![CDATA[${project.title}]]></media:title>
            </media:content>
        </item>`;
        });

        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:media="http://search.yahoo.com/mrss/">
<channel>
    <title>RizQara Tech | Latest Insights &amp; Projects</title>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <link>${siteUrl}</link>
    <description>Enterprise-grade software, AI, and digital solutions from RizQara Tech.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <ttl>60</ttl>
    <image>
        <url>${logoUrl}</url>
        <title>RizQara Tech | Latest Insights &amp; Projects</title>
        <link>${siteUrl}</link>
    </image>
    ${rssItems}
</channel>
</rss>`;

        res.set('Content-Type', 'text/xml; charset=utf-8');
        res.send(rssFeed.trim());
    } catch (err) {
        console.error('RSS Generation Error:', err);
        res.status(500).send('Error generating RSS feed');
    }
});

// --- TRANSLATE ROUTE ---
router.post('/translate', async (req, res) => {
    const { text, to = 'bn' } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        const result = await translate(text, { to });
        res.json({ translatedText: result.text });
    } catch (err) {
        console.error('Translation error:', err);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// --- GENERIC CRUD ROUTES ---

// GET All
router.get('/:collection', async (req, res) => {
    const { collection } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        // Check Cache
        const cachedData = cache.get(collection);
        if (cachedData) return res.json(cachedData);

        // Default sort: Newest First (-1)
        let sortOrder = { createdAt: -1 };
        if (collection === 'services' || collection === 'buildOptions') {
            sortOrder = { createdAt: 1 };
        }

        const items = await model.find().sort(sortOrder);
        
        // Save to Cache
        cache.set(collection, items);
        
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET One by ID
router.get('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const item = await model.findOne({ id });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Create
router.post('/:collection', async (req, res) => {
    const { collection } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const newItem = new model(req.body);
        const savedItem = await newItem.save();
        
        // Invalidate Cache for this collection
        cache.clear(collection);
        
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT Update (Bulk or Singleton)
router.put('/:collection', async (req, res) => {
    const { collection } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        if (Array.isArray(req.body)) {
            // SAFE Bulk Validate First
            for (const item of req.body) {
                const doc = new model(item);
                try {
                    await doc.validate();
                } catch (validationError) {
                    console.error('Validation Error (Bulk Aborted):', validationError.message);
                    return res.status(400).json({ error: validationError.message });
                }
            }

            // If we get here, all items are valid. proceed to replace.
            await model.deleteMany({});
            const inserted = await model.insertMany(req.body);
            
            // Invalidate Cache
            cache.clear(collection);
            
            res.json(inserted);

        } else if (typeof req.body === 'object' && req.body !== null) {
            // SAFE Singleton Validate
            const doc = new model(req.body);
            try {
                await doc.validate();
            } catch (validationError) {
                console.error('Validation Error (Singleton Aborted):', validationError.message);
                return res.status(400).json({ error: validationError.message });
            }

            // Replace single document
            await model.deleteMany({});
            const created = await model.create(req.body);
            
            // Invalidate Cache
            cache.clear(collection);
            
            res.json(created);
        } else {
            res.status(400).json({ error: 'Body must be an Array or Object' });
        }
    } catch (err) {
        console.error('SERVER ERROR (Bulk Update):', err.message);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const updated = await model.findOneAndUpdate({ id }, req.body, { new: true });
        
        // Invalidate Cache
        cache.clear(collection);
        
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper to delete image from Cloudinary
const deleteImage = async (url) => {
    if (!url || !url.includes('cloudinary.com')) return;
    try {
        // Extract public_id: 
        // URL: https://res.cloudinary.com/cloudname/image/upload/v1234/folder/id.jpg
        // Public ID: folder/id (without extension)
        const parts = url.split('/');
        const versionIndex = parts.findIndex(part => part.startsWith('v'));
        if (versionIndex === -1) return;
        
        const publicIdParts = parts.slice(versionIndex + 1);
        const publicIdWithExt = publicIdParts.join('/');
        const publicId = publicIdWithExt.split('.')[0];

        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${publicId}`);
    } catch (err) {
        console.error(`Failed to delete image ${url}:`, err.message);
    }
};

// DELETE
router.delete('/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    const model = models[collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const item = await model.findOne({ id });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // Clean up Cloudinary images before deletion
        if (item.image) await deleteImage(item.image);
        if (item.thumbnail) await deleteImage(item.thumbnail);
        if (item.gallery && Array.isArray(item.gallery)) {
            for (const img of item.gallery) {
                await deleteImage(img);
            }
        }

        await model.findOneAndDelete({ id });
        
        // Invalidate Cache
        cache.clear(collection);
        
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPLOAD ROUTE ---


module.exports = router;
