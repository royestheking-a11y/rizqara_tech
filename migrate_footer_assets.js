const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PAYMENT_DIR = path.join(__dirname, 'public/Payment method');
const CLUTCH_FILE = path.join(__dirname, 'public/clutch.png');

async function migrate() {
    const mapping = {};

    console.log('--- Migrating Payment Methods ---');
    if (fs.existsSync(PAYMENT_DIR)) {
        const files = fs.readdirSync(PAYMENT_DIR);
        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
                const localPath = path.join(PAYMENT_DIR, file);
                const publicPath = `/Payment method/${file}`;

                try {
                    console.log(`Uploading ${file}...`);
                    const result = await cloudinary.uploader.upload(localPath, {
                        folder: 'rizqaratech/payment_methods',
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
    }

    console.log('\n--- Migrating Clutch Logo ---');
    if (fs.existsSync(CLUTCH_FILE)) {
        try {
            console.log('Uploading clutch.png...');
            const result = await cloudinary.uploader.upload(CLUTCH_FILE, {
                folder: 'rizqaratech/clutch',
                use_filename: true,
                unique_filename: false
            });
            mapping['/clutch.png'] = result.secure_url;
            console.log(`✅ clutch.png -> ${result.secure_url}`);
        } catch (error) {
            console.error('❌ Failed clutch.png:', error.message);
        }
    }

    console.log('\n--- MIGRATION COMPLETE ---');
    console.log('Copy the following JSON to map replacements:');
    console.log(JSON.stringify(mapping, null, 2));
}

migrate();
