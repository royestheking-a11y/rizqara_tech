const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const SERVICE_IMAGES_DIR = path.join(__dirname, 'public/images/services');
const UNSPLASH_URLS = [
    // Projects
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
    // Blogs
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80',
    // Videos (Thumbnails)
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80',
    // Carousel
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop'
];

async function migrate() {
    const mapping = {};

    console.log('--- Migrating Local Service Images ---');
    if (fs.existsSync(SERVICE_IMAGES_DIR)) {
        const files = fs.readdirSync(SERVICE_IMAGES_DIR);
        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
                const localPath = path.join(SERVICE_IMAGES_DIR, file);
                const publicPath = `/images/services/${file}`;

                try {
                    console.log(`Uploading ${file}...`);
                    const result = await cloudinary.uploader.upload(localPath, {
                        folder: 'rizqaratech/services',
                        use_filename: true,
                        unique_filename: false
                    });
                    mapping[publicPath] = result.secure_url;
                    console.log(`✅ ${file} -> ${result.secure_url}`);
                } catch (error) {
                    console.error(`❌ Failed ${file}:`, error.message);
                }
            }
        }
    } else {
        console.warn('Service images directory not found!');
    }

    console.log('\n--- Migrating Unsplash Defaults ---');
    for (const url of UNSPLASH_URLS) {
        try {
            console.log(`Uploading ${url.substring(0, 30)}...`);
            // Cloudinary can upload from remote URL
            const result = await cloudinary.uploader.upload(url, {
                folder: 'rizqaratech/defaults'
            });
            // We need to map the exact string used in DataContext to the new URL
            mapping[url] = result.secure_url;
            console.log(`✅ Uploaded -> ${result.secure_url}`);
        } catch (error) {
            console.error(`❌ Failed URL:`, error.message);
        }
    }

    console.log('\n--- MIGRATION COMPLETE ---');
    console.log('Copy the following JSON to map replacements:');
    console.log(JSON.stringify(mapping, null, 2));
}

migrate();
