const crypto = require('node:crypto');
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    _id: String,
    expiresAt: { type: Date, required: true, expires: 0 },
}, { versionKey: false });
const AdminSession = mongoose.model('AdminSession', sessionSchema);
const windows = new Map();
const cookieName = 'rizqara_session';
const sessionTTL = 8 * 60 * 60 * 1000;
function allowedOrigins(req) {
    const host = req.get('host');
    const forwardedHost = req.get('x-forwarded-host');
    const proto = req.get('x-forwarded-proto') || req.protocol;
    return new Set([
        `${req.protocol}://${host}`,
        `${proto}://${host}`,
        forwardedHost ? `https://${forwardedHost}` : '',
        forwardedHost ? `http://${forwardedHost}` : '',
        'https://rizqara.tech',
        'https://www.rizqara.tech',
        'http://localhost:3000',
        'http://localhost:5001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5001',
        ...(process.env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim())
    ].filter(Boolean));
}
function checkOrigin(req, res, next) {
    const origin = req.get('origin');
    if (!origin) return next();
    if (allowedOrigins(req).has(origin)) return next();
    try {
        const originUrl = new URL(origin);
        const host = originUrl.hostname.toLowerCase();
        if (
            host === 'rizqara.tech' ||
            host.endsWith('.rizqara.tech') ||
            host.endsWith('.onrender.com') ||
            host === 'localhost' ||
            host === '127.0.0.1'
        ) {
            return next();
        }
    } catch {}
    if (req.get('sec-fetch-site') === 'cross-site') return res.status(403).json({ error: 'Cross-site requests are not allowed' });
    return res.status(403).json({ error: 'Origin not allowed' });
}
function rateLimit(name, limit, interval = 60000) {
    return (req, res, next) => {
        const now = Date.now();
        for (const [key, value] of windows) if (value.until <= now) windows.delete(key);
        const key = `${name}:${req.ip}`;
        if (!windows.has(key) && windows.size >= 10000) return res.status(503).json({ error: 'Please try again later' });
        const value = windows.get(key) || { count: 0, until: now + interval };
        windows.set(key, value);
        if (++value.count > limit) { res.set('Retry-After', String(Math.ceil((value.until - now) / 1000))); return res.status(429).json({ error: 'Too many requests. Please try again later.' }); }
        next();
    };
}
function getToken(req) {
    return (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
}
function sessionKey(token) {
    return /^[a-f0-9]{64}$/.test(token || '')
        ? crypto.createHash('sha256').update(token).digest('hex')
        : null;
}

async function requireAdmin(req, res, next) {
    res.set('Cache-Control', 'no-store');
    const key = sessionKey(getToken(req));
    if (!key) return res.status(401).json({ error: 'Please sign in as administrator' });
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: 'Session verification is temporarily unavailable. Try again shortly.' });
    }
    const session = await AdminSession.exists({ _id: key, expiresAt: { $gt: new Date() } });
    if (!session) return res.status(401).json({ error: 'Please sign in as administrator' });
    next();
}
function verifyPassword(password, encoded) {
    try {
        const [salt, expected] = encoded.split(':');
        if (!/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(expected)) return false;
        return crypto.timingSafeEqual(crypto.scryptSync(password, salt, 64), Buffer.from(expected, 'hex'));
    } catch { return false; }
}
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api', maxAge: sessionTTL }; }
function mountAuth(router) {
    router.post('/auth/login', checkOrigin, rateLimit('login', 15, 15 * 60000), async (req, res) => {
        res.set('Cache-Control', 'no-store');
        const { email, password } = req.body || {};
        if (typeof email !== 'string' || typeof password !== 'string' || password.length > 256) {
            return res.status(401).json({ error: 'Incorrect credentials' });
        }
        const inputEmail = email.trim().toLowerCase();
        const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const emailMatches = Boolean(configuredEmail) && inputEmail === configuredEmail;
        const passwordMatches = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);

        if (!emailMatches || !passwordMatches) {
            return res.status(401).json({ error: 'Incorrect credentials' });
        }
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Sign-in is temporarily unavailable. Try again shortly.' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const previous = sessionKey(getToken(req));
        if (previous) await AdminSession.deleteOne({ _id: previous });
        await AdminSession.create({ _id: sessionKey(token), expiresAt: new Date(Date.now() + sessionTTL) });
        res.cookie(cookieName, token, cookieOptions()).set('Cache-Control', 'no-store').json({ authenticated: true });
    });
    router.get('/auth/session', requireAdmin, (req, res) => res.json({ authenticated: true }));
    router.post('/auth/logout', checkOrigin, async (req, res) => {
        res.set('Cache-Control', 'no-store');
        const key = sessionKey(getToken(req));
        if (key && mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Sign-out is temporarily unavailable. Try again shortly.' });
        }
        if (key) await AdminSession.deleteOne({ _id: key });
        const { maxAge, ...options } = cookieOptions();
        res.clearCookie(cookieName, options).json({ authenticated: false });
    });
}
module.exports = { requireAdmin, rateLimit, checkOrigin, mountAuth, allowedOrigins };
