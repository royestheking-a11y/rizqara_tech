const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const models = require('../models/Schemas');
const mapping = { services: 'Service', projects: 'Project', reviews: 'Review', blogs: 'Blog', jobs: 'Job', videos: 'Video', carousel: 'Carousel', buildOptions: 'BuildOption', promotion: 'Promotion', caseStudies: 'CaseStudy', notice: 'Notice', galleryItems: 'GalleryItem' };
(async () => {
    const uri = process.env.MONGODB_URI || '';
    if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27018\/rizqara_local(?:\?|$)/.test(uri)) throw new Error('Seeding is restricted to the isolated local rizqara_local database on port 27018');
    await mongoose.connect(uri);
    for (const [collection, name] of Object.entries(mapping)) {
        const response = await fetch(`https://rizqaratech-backend.onrender.com/api/${collection}`, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`Cannot read public ${collection}: ${response.status}`);
        const records = await response.json();
        if (!Array.isArray(records)) throw new Error(`Invalid public ${collection}`);
        for (const record of records) {
            const { _id, __v, ...data } = record;
            await models[name].updateOne({ id: String(data.id) }, { $setOnInsert: data }, { upsert: true, runValidators: true, timestamps: false });
        }
        console.log(`${collection}: copied ${records.length} public records (existing records preserved)`);
    }
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
