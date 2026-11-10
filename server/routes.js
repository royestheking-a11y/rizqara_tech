const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { requireAdmin, rateLimit, mountAuth } = require('./security');
const { Service, Project, Review, Blog, Job, Video, Carousel, BuildOption, Message, Promotion, CareerApplication, CaseStudy, Notice, GalleryItem } = require('./models/Schemas');
const router = express.Router();
const models = Object.freeze({ services: Service, projects: Project, reviews: Review, blogs: Blog, jobs: Job, videos: Video, carousel: Carousel, buildOptions: BuildOption, messages: Message, promotion: Promotion, careerApplications: CareerApplication, caseStudies: CaseStudy, notice: Notice, galleryItems: GalleryItem });
const privateCollections = new Set(['messages', 'careerApplications']);
const cvDirectory = path.resolve(process.env.PRIVATE_UPLOAD_DIR || path.join(__dirname, 'private-uploads'));
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10, fieldSize: 20000 } });
mountAuth(router);
const ready = (req, res, next) => mongoose.connection.readyState === 1 ? next() : res.status(503).json({ error: 'Database is unavailable. Please try again later.' });
function modelFor(req, res, next) {
    if (!Object.hasOwn(models, req.params.collection)) return res.status(404).json({ error: 'Collection not found' });
    req.model = models[req.params.collection]; next();
}
function safeBody(model, body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw Object.assign(new Error('Invalid body'), { status: 400 });
    const result = {};
    for (const [key, value] of Object.entries(body)) {
        if (['id', '_id', '__v', 'createdAt', 'updatedAt', 'slug', 'previousSlugs', 'cvKey'].includes(key)) continue;
        if (key.startsWith('$') || key.includes('.') || !model.schema.path(key)) throw Object.assign(new Error('Invalid field'), { status: 400 });
        if (typeof value === 'string' && (value.length > 100000 || value.startsWith('data:') || value.startsWith('blob:'))) throw Object.assign(new Error('Invalid value'), { status: 400 });
        if (['image', 'thumbnail', 'link', 'url'].includes(key) && value && !validURL(value)) throw Object.assign(new Error('Invalid URL'), { status: 400 });
        if (key === 'gallery' && (!Array.isArray(value) || value.length > 30 || value.some(x => !validURL(x)))) throw Object.assign(new Error('Invalid gallery'), { status: 400 });
        result[key] = value;
    }
    return result;
}
function validURL(value) {
    if (typeof value !== 'string') return false;
    if (value.startsWith('/') && !value.startsWith('//')) return true;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
const slugify = title => title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';
function publicRecord(doc, collection) {
    const item = doc.toObject ? doc.toObject() : { ...doc };
    if (collection === 'careerApplications') { delete item.cvKey; item.cvUrl = `/api/applications/${encodeURIComponent(item.id)}/cv`; }
    return item;
}
function publicFields(body, keys) {
    const result = {};
    for (const key of keys) {
        if (typeof body?.[key] !== 'string' || !body[key].trim() || body[key].length > (['message', 'experience', 'reason', 'text'].includes(key) ? 10000 : 300)) throw Object.assign(new Error('Invalid form'), { status: 400 });
        result[key] = body[key].trim();
    }
    if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw Object.assign(new Error('Invalid email'), { status: 400 });
    return result;
}
router.post('/upload', requireAdmin, rateLimit('upload', 10), upload.single('file'), async (req, res) => {
    const file = req.file;
    const valid = file && (file.buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) || file.buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
    if (!valid) return res.status(400).json({ error: 'Upload a JPEG or PNG image, at most 5 MB' });
    if (!process.env.CLOUDINARY_API_SECRET) return res.status(503).json({ error: 'Image storage is not configured' });
    const mime = file.buffer[0] === 0xff ? 'image/jpeg' : 'image/png';
    const result = await cloudinary.uploader.upload(`data:${mime};base64,${file.buffer.toString('base64')}`, { folder: 'rizqaratech/uploads', resource_type: 'image' });
    res.json({ url: result.secure_url });
});
router.get('/proxy-image', (req, res) => res.status(410).json({ error: 'Image proxy removed. Use the original image URL.' }));
router.post('/translate', requireAdmin, rateLimit('translate', 20), async (req, res) => {
    const { text, to = 'bn' } = req.body || {};
    if (typeof text !== 'string' || !text.trim() || text.length > 5000 || !['bn', 'en'].includes(to)) return res.status(400).json({ error: 'Invalid translation request' });
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) return res.status(503).json({ error: 'Translation is not configured. Enter the translation manually.' });
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(process.env.GOOGLE_TRANSLATE_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: text, target: to, format: 'text' }), signal: AbortSignal.timeout(10000) });
    if (!response.ok) return res.status(502).json({ error: 'Translation service is unavailable' });
    const data = await response.json(); res.json({ translatedText: data.data.translations[0].translatedText });
});
router.post('/messages', rateLimit('message', 5, 15 * 60000), ready, async (req, res) => {
    const data = publicFields(req.body, ['name', 'email', 'subject', 'message', 'type']);
    if (!['Contact', 'Build', 'Chatbot', 'Newsletter', 'Order'].includes(data.type)) return res.status(400).json({ error: 'Invalid message type' });
    await Message.create({ ...data, id: crypto.randomUUID(), date: new Date().toISOString(), read: false, status: 'Pending' });
    res.status(201).json({ accepted: true });
});
router.post('/careerApplications', rateLimit('application', 3, 60 * 60000), ready, upload.single('cv'), async (req, res) => {
    const data = publicFields(req.body, ['name', 'email', 'experience', 'reason', 'jobId']);
    const file = req.file;
    if (!file || file.buffer.subarray(0, 5).toString() !== '%PDF-') return res.status(400).json({ error: 'Attach a PDF CV, at most 5 MB' });
    if (!await Job.exists({ id: data.jobId })) return res.status(400).json({ error: 'This vacancy is no longer available' });
    await fs.mkdir(cvDirectory, { recursive: true, mode: 0o700 });
    const id = crypto.randomUUID(), cvKey = `${id}.pdf`;
    await fs.writeFile(path.join(cvDirectory, cvKey), file.buffer, { mode: 0o600, flag: 'wx' });
    try { await CareerApplication.create({ ...data, id, cvKey, cvName: path.basename(file.originalname).replace(/[\r\n"]/g, ''), cvUrl: `/api/applications/${id}/cv`, date: new Date().toISOString(), status: 'New' }); }
    catch (error) { await fs.unlink(path.join(cvDirectory, cvKey)).catch(() => {}); throw error; }
    res.status(201).json({ accepted: true });
});
router.get('/applications/:id/cv', requireAdmin, ready, async (req, res) => {
    const item = await CareerApplication.findOne({ id: req.params.id }).select('+cvKey');
    if (!item) return res.status(404).json({ error: 'Application not found' });
    res.set({ 'Cache-Control': 'no-store', 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="resume.pdf"' });
    if (item.cvKey && /^[a-f0-9-]+\.pdf$/.test(item.cvKey)) return res.sendFile(path.join(cvDirectory, item.cvKey));
    if (item.cvUrl?.startsWith('data:application/pdf;base64,')) return res.send(Buffer.from(item.cvUrl.split(',')[1], 'base64'));
    return res.status(404).json({ error: 'CV unavailable. Migrate legacy CV storage.' });
});
router.post('/videos/:id/comments', rateLimit('comment', 5, 15 * 60000), ready, async (req, res) => {
    const data = publicFields({ user: req.body?.user, text: req.body?.text }, ['user', 'text']);
    const comment = { ...data, id: crypto.randomUUID(), date: new Date().toISOString() };
    const item = await Video.findOneAndUpdate({ id: req.params.id }, { $push: { comments: { $each: [comment], $position: 0, $slice: 500 } }, $inc: { __v: 1 } }, { returnDocument: 'after', runValidators: true });
    if (!item) return res.status(404).json({ error: 'Video not found' });
    res.status(201).json(comment);
});
// --- RSS FEED ROUTE ---
router.get('/rss', ready, async (req, res) => {
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

router.use('/:collection', modelFor, (req, res, next) => {
    if (req.method !== 'GET' || privateCollections.has(req.params.collection)) return requireAdmin(req, res, next);
    next();
}, ready);
router.get('/:collection', async (req, res) => {
    const collection = req.params.collection;
    const limit = Number(req.query.limit ?? 100);
    const offset = Number(req.query.offset ?? 0);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0 || offset > 1000000) return res.status(400).json({ error: 'Invalid pagination parameters' });
    const items = await req.model.find().select('-cvKey').sort({ createdAt: ['services', 'buildOptions'].includes(collection) ? 1 : -1, _id: 1 }).skip(offset).limit(limit + 1);
    res.set({ 'X-Has-More': String(items.length > limit), 'Access-Control-Expose-Headers': 'X-Has-More' });
    if (privateCollections.has(collection)) res.set('Cache-Control', 'no-store');
    res.json(items.slice(0, limit).map(item => publicRecord(item, collection)));
});
router.get('/:collection/:id', async (req, res) => {
    const item = await req.model.findOne({ id: req.params.id }).select('-cvKey');
    if (!item) return res.status(404).json({ error: 'Record not found' });
    res.json(publicRecord(item, req.params.collection));
});
router.post('/:collection', async (req, res) => {
    const data = safeBody(req.model, req.body);
    const id = crypto.randomUUID();
    if (data.title) data.slug = `${slugify(data.title)}-${id.slice(0, 8)}`;
    const item = await req.model.create({ ...data, id });
    res.status(201).json(publicRecord(item, req.params.collection));
});
router.put('/:collection', (req, res) => res.status(405).set('Allow', 'GET, POST').json({ error: 'Bulk replacement is disabled. Update individual records.' }));
router.put('/:collection/:id', async (req, res) => {
    const version = req.body?.__v;
    if (!Number.isInteger(version) || version < 0) return res.status(400).json({ error: 'A record version is required' });
    const data = safeBody(req.model, req.body);
    if (privateCollections.has(req.params.collection) && Object.keys(data).some(key => !['read', 'status'].includes(key))) return res.status(400).json({ error: 'Only status and read state can be updated' });
    const existing = await req.model.findOne({ id: req.params.id });
    if (!existing) return res.status(404).json({ error: 'Record not found' });
    if (!existing.slug && existing.title) data.slug = `${slugify(existing.title)}-${existing.id.slice(0, 8)}`;
    if (existing.title && data.title && existing.title !== data.title) data.previousSlugs = [...new Set([...(existing.previousSlugs || []), slugify(existing.title), existing.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')])].slice(-30);
    const updated = await req.model.findOneAndUpdate({ id: req.params.id, __v: version }, { $set: data, $inc: { __v: 1 } }, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(409).json({ error: 'This record changed. Reload before editing again.' });
    res.json(publicRecord(updated, req.params.collection));
});
router.delete('/:collection/:id', async (req, res) => {
    const version = Number(req.get('If-Match'));
    if (!req.get('If-Match') || !Number.isInteger(version) || version < 0) return res.status(400).json({ error: 'A record version is required' });
    const item = await req.model.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Record not found' });
    const deleted = await req.model.findOneAndDelete({ id: req.params.id, __v: version });
    if (!deleted) return res.status(409).json({ error: 'This record changed. Reload before deleting.' });
    // Media is retained deliberately: shared references must be checked before cleanup.
    res.json({ deleted: true });
});
module.exports = router;
