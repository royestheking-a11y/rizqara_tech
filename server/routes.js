const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Service, Project, Review, Blog, Job, Video, Carousel, BuildOption, Message, Promotion, CareerApplication } = require('./models/Schemas');

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
    careerApplications: CareerApplication
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

// --- GENERIC CRUD ROUTES ---

// GET All
router.get('/:collection', async (req, res) => {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        // Default sort: Newest First (-1) for Blogs, Projects, etc.
        // Exception: Services & BuildOptions need logical order (Oldest First / Insertion Order)
        let sortOrder = { createdAt: -1 };

        if (req.params.collection === 'services' || req.params.collection === 'buildOptions') {
            sortOrder = { createdAt: 1 };
        }

        const items = await model.find().sort(sortOrder);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET One by ID
router.get('/:collection/:id', async (req, res) => {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const item = await model.findOne({ id: req.params.id });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Create
router.post('/:collection', async (req, res) => {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const newItem = new model(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT Update
router.put('/:collection', async (req, res) => { // Expects array update (bulk replace) or specific ID? 
    // The frontend logic (localStorage style) sends the WHOLE array for updates usually.
    // But for a real API, we should update mostly single items or handle bulk.
    // However, existing "updateData" implies replacing the state.

    // For specific Item update by ID (standard REST)
    // We will support both: /:collection/:id (single) and POST /:collection/bulk (replace all - careful!)
    // But let's stick to standard first.

    // Wait, the client might send a replace request. 
    // If the body is an array, we might assume bulk replace (DANGEROUS but matches localStorage behavior).

    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        if (Array.isArray(req.body)) {
            // Bulk Replace Strategy: Delete All and Insert All
            await model.deleteMany({});
            const inserted = await model.insertMany(req.body);
            res.json(inserted);
        } else if (typeof req.body === 'object' && req.body !== null) {
            // Singleton Strategy (for Promotion, etc.): Replace single document
            await model.deleteMany({});
            const created = await model.create(req.body);
            res.json(created);
        } else {
            res.status(400).json({ error: 'Body must be an Array or Object' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:collection/:id', async (req, res) => {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        const updated = await model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
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
        const publicIdParts = parts.slice(versionIndex + 1);
        const publicIdWithExt = publicIdParts.join('/');
        const publicId = publicIdWithExt.split('.')[0];

        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${publicId}`);
    } catch (err) {
        console.error(`Failed to delete image ${url}:`, err.message);
    }
};

router.delete('/:collection/:id', async (req, res) => {
    const model = models[req.params.collection];
    if (!model) return res.status(404).json({ error: 'Collection not found' });

    try {
        // 1. Find the item
        const item = await model.findOne({ id: req.params.id });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // 2. Scan for images and delete them
        // Common fields: image, thumbnail
        if (item.image) await deleteImage(item.image);
        if (item.thumbnail) await deleteImage(item.thumbnail);

        // Gallery (Projects)
        if (item.gallery && Array.isArray(item.gallery)) {
            for (const img of item.gallery) {
                await deleteImage(img);
            }
        }

        // 3. Delete from DB
        await model.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPLOAD ROUTE ---


module.exports = router;
