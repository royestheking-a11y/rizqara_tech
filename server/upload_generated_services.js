
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const ServiceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.model('Service', ServiceSchema);

// Map generated files to service keywords (simple matching)
// Files like: service_1_web_dev_1_v2_1767724755915.png
const artifactsDir = '/Users/mdsunny/.gemini/antigravity/brain/256ee636-afd3-41e6-ae52-21b217131bfe';

async function processImages() {
    try {
        const services = await Service.find({});
        console.log(`Found ${services.length} services in DB.`);

        const files = fs.readdirSync(artifactsDir).filter(f => f.startsWith('service_') && f.endsWith('.png'));
        console.log(`Found ${files.length} generated images.`);

        for (const service of services) {
            // Identify keywords based on service title
            let keywords = [];
            if (service.title.toLowerCase().includes('web development')) keywords = ['web_dev'];
            else if (service.title.toLowerCase().includes('web application') || service.title.toLowerCase().includes('web app')) keywords = ['web_app'];
            else if (service.title.toLowerCase().includes('ui/ux') || service.title.toLowerCase().includes('design')) keywords = ['ui_ux'];
            else if (service.title.toLowerCase().includes('custom software') || service.title.toLowerCase().includes('software')) keywords = ['custom_soft'];
            else if (service.title.toLowerCase().includes('app development') || service.title.toLowerCase().includes('mobile')) keywords = ['app_dev'];
            else if (service.title.toLowerCase().includes('seo')) keywords = ['seo'];
            else if (service.title.toLowerCase().includes('marketing')) keywords = ['marketing'];

            if (keywords.length === 0) continue;

            const serviceFiles = files.filter(f => keywords.some(k => f.includes(k)));

            if (serviceFiles.length > 0) {
                console.log(`Processing ${service.title} with ${serviceFiles.length} images...`);
                const key = keywords[0]; // e.g., 'web_dev'

                // Get image 1 and image 2 if possible
                // simple logic: sort by name
                serviceFiles.sort();

                // We want to upload and push to gallery
                const galleryUrls = [];

                for (const file of serviceFiles) {
                    const filePath = path.join(artifactsDir, file);
                    console.log(`Uploading ${file}...`);
                    try {
                        const result = await cloudinary.uploader.upload(filePath, {
                            folder: 'rizqaratech/services',
                            public_id: path.parse(file).name
                        });
                        galleryUrls.push(result.secure_url);
                        console.log(`Uploaded: ${result.secure_url}`);
                    } catch (e) {
                        console.error(`Failed to upload ${file}:`, e.message);
                    }
                }

                // Update Service
                // We take max 2 images for now as per req
                const finalGallery = galleryUrls.slice(0, 2);
                if (finalGallery.length > 0) {
                    await Service.updateOne({ _id: service._id }, { $set: { gallery: finalGallery } });
                    console.log(`Updated ${service.title} with gallery images.`);
                }
            }
        }

        console.log('Done!');
        process.exit(0);

    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
}

processImages();
