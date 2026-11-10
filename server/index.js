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
    if (process.env.NODE_ENV === 'production') {
        for (const key of ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'ALLOWED_ORIGINS']) if (!process.env[key]) throw new Error(`${key} is required in production`);
    }
    if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 });
    else console.warn('MONGODB_URI is missing. Database endpoints will return 503 until configured.');
    require('./notifications').startNotifications();
    createApp().listen(Number(process.env.PORT) || 5001, () => console.log(`Server running on port ${Number(process.env.PORT) || 5001}`));
}
if (require.main === module) start().catch(err => { console.error(err.message); process.exitCode = 1; });
module.exports = { createApp };
