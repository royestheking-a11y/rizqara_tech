
require('dotenv').config({ path: 'server/.env' });
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const assets = [
    // Why Choose Us
    { name: 'end_to_end_v2', folder: 'rizqara/why_choose_us', path: 'public/End to end .png' },
    { name: 'performance_v2', folder: 'rizqara/why_choose_us', path: 'public/build for performance.png' },
    { name: 'transparency_v2', folder: 'rizqara/why_choose_us', path: 'public/Team.png' },
    { name: 'partnership_v2', folder: 'rizqara/why_choose_us', path: 'public/longterm partner.png' },
    
    // About Us
    { name: 'about_us_hero', folder: 'rizqara/about_us', path: 'public/about us.png' },
    
    // Team Members
    { name: 'pritom_v2', folder: 'rizqara/team', path: 'public/pritom.jpg' },
    { name: 'sanju_v2', folder: 'rizqara/team', path: 'public/sanju.jpg' },
    { name: 'sami_v2', folder: 'rizqara/team', path: 'public/sami.jpg' },
    { name: 'rojina_v2', folder: 'rizqara/team', path: 'public/rojina.jpg' },
    { name: 'irin_v2', folder: 'rizqara/team', path: 'public/irin.jpg' },
    { name: 'arzu_v2', folder: 'rizqara/team', path: 'public/arzu.jpg' }
];

async function uploadAll() {
    console.log('--- Cloudinary Migration Started ---');
    const results = {};
    for (const asset of assets) {
        try {
            const absolutePath = path.resolve(asset.path);
            const res = await cloudinary.uploader.upload(absolutePath, {
                folder: asset.folder,
                public_id: asset.name,
                overwrite: true
            });
            console.log(`SUCCESS [${asset.name}]: ${res.secure_url}`);
            results[asset.name] = res.secure_url;
        } catch (error) {
            console.error(`FAILED [${asset.name}]:`, error.message);
        }
    }
    console.log('--- Migration Completed ---');
    console.log(JSON.stringify(results, null, 2));
}

uploadAll();
