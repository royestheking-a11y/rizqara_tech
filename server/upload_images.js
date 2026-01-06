
require('dotenv').config({ path: 'server/.env' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const images = [
    { name: 'end_to_end', path: '/Users/mdsunny/.gemini/antigravity/brain/256ee636-afd3-41e6-ae52-21b217131bfe/end_to_end_partner_1767679243051.png' },
    { name: 'performance', path: '/Users/mdsunny/.gemini/antigravity/brain/256ee636-afd3-41e6-ae52-21b217131bfe/performance_security_1767679264215.png' },
    { name: 'transparency', path: '/Users/mdsunny/.gemini/antigravity/brain/256ee636-afd3-41e6-ae52-21b217131bfe/transparent_team_1767679284394.png' },
    { name: 'partnership', path: '/Users/mdsunny/.gemini/antigravity/brain/256ee636-afd3-41e6-ae52-21b217131bfe/long_term_partnership_1767679301619.png' }
];

async function upload() {
    for (const img of images) {
        try {
            const res = await cloudinary.uploader.upload(img.path, {
                folder: 'rizqara/why_choose_us',
                public_id: img.name
            });
            console.log(`${img.name}: ${res.secure_url}`);
        } catch (error) {
            console.error(`Failed to upload ${img.name}:`, error);
        }
    }
}

upload();
