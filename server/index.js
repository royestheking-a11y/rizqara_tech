const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { checkOrigin } = require('./security');
const { renderPage } = require('./render');
mongoose.set('bufferCommands', false);
function createApp() {
    const app = express();
    if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin' }); next();
    });
    app.use(cors({ origin(origin, callback) {
        const permitted = new Set((process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(x => x.trim()));
        callback(null, !origin || permitted.has(origin));
    }, credentials: true }));
    app.use(express.json({ limit: '256kb' }));
    app.use(express.urlencoded({ extended: false, limit: '256kb' }));
    app.use('/api', (req, res, next) => ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? next() : checkOrigin(req, res, next));
    app.get(['/health', '/ping', '/api/health'], (req, res) => res.json({ alive: true }));
    app.get('/api/ready', (req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ ready: mongoose.connection.readyState === 1 }));
    app.use('/api', require('./routes'));
    app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));
    const distPath = path.join(__dirname, '../dist');
    app.get('/sitemap.xml', async (req, res, next) => {
        if (mongoose.connection.readyState !== 1) return res.status(503).set('Retry-After', '60').send('Sitemap temporarily unavailable');
        try { res.type('application/xml').set('Cache-Control','public, max-age=3600').send(await require('./sitemap').sitemap()); } catch (error) { next(error); }
    });
    app.use(express.static(distPath, { index: false }));
    app.use(async (req, res, next) => {
        if (req.method !== 'GET' || path.extname(req.path)) return res.status(404).send('Not found');
        try {
            const page = await renderPage(path.join(distPath, 'index.html'), req.path, mongoose.connection.readyState === 1);
            res.status(page.status).type('html').send(page.html);
        } catch (error) { next(error); }
    });
    app.use((err, req, res, next) => {
        if (res.headersSent) return next(err);
        console.error('Request failed:', err.name);
        const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : err.name === 'ValidationError' || err.name === 'MulterError' ? 400 : err.code === 11000 ? 409 : 500);
        res.status(status).json({ error: status === 413 ? 'File or request is too large' : status === 400 ? 'Invalid request data' : status === 409 ? 'This record already exists' : 'Unable to complete the request' });
    });
    return app;
}
async function start() {
    const requiredInProd = ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'ALLOWED_ORIGINS'];
    const missing = requiredInProd.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.warn(`[CONFIG WARNING] Missing environment variable(s) on startup: ${missing.join(', ')}`);
        console.warn('Please configure these in your Render Environment dashboard for full production functionality.');
    }
    if (!process.env.ADMIN_EMAIL) process.env.ADMIN_EMAIL = 'admin@rizqaratech.com';
    if (!process.env.ALLOWED_ORIGINS) process.env.ALLOWED_ORIGINS = 'https://rizqara.tech,http://localhost:3000';
    if (!process.env.ADMIN_PASSWORD_HASH) {
        process.env.ADMIN_PASSWORD_HASH = 'cba3a9df5af736fac6064cbd302da2e5:ffddfea05b05909a6e89a37dbef7d91408c316c20193bd657d15628ca9add6d6ec80e365f0495cf866aa33c98173ca35e84d542a5a4705ac25a7c2026f6f1082';
    }
    if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 });
        try {
            const { syncDatabase } = require('./syncDatabase');
            await syncDatabase();
        } catch (syncErr) {
            console.error('Database sync error on startup:', syncErr.message);
        }
    } else console.warn('MONGODB_URI is missing. Database endpoints will return 503 until configured.');
    require('./notifications').startNotifications();
    createApp().listen(Number(process.env.PORT) || 5001, () => console.log(`Server running on port ${Number(process.env.PORT) || 5001}`));
}
if (require.main === module) start().catch(err => { console.error(err.message); process.exitCode = 1; });
module.exports = { createApp };
