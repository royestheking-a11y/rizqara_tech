const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('node:fs/promises');
const models = require('../models/Schemas');
(async () => {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
    await mongoose.connect(process.env.MONGODB_URI);
    const urls = new Set();
    for (const model of Object.values(models)) {
        for await (const record of model.find().select('image thumbnail gallery').lean().cursor()) {
            for (const url of [record.image, record.thumbnail, ...(record.gallery || [])]) if (url) urls.add(url);
        }
    }
    const cvs = await models.CareerApplication.find().select('+cvKey').lean();
    const referenced = new Set(cvs.map(record => record.cvKey).filter(Boolean));
    const directory = path.resolve(process.env.PRIVATE_UPLOAD_DIR || path.join(__dirname, '../private-uploads'));
    const files = await fs.readdir(directory).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error));
    console.log(JSON.stringify({ referencedImages: [...urls], cvFileCount: files.length, unreferencedCVFiles: files.filter(file => !referenced.has(file)) }, null, 2));
    console.error('Read-only inventory. Retain shared media; review references and retention policy before deleting any asset.');
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
