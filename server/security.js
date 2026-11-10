const crypto = require('node:crypto');
const sessions = new Map();
const windows = new Map();
const cookieName = 'rizqara_session';
const sessionTTL = 8 * 60 * 60 * 1000;
function allowedOrigins(req) {
    return new Set([`${req.protocol}://${req.get('host')}`, ...(process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(x => x.trim())]);
}
function checkOrigin(req, res, next) {
    const origin = req.get('origin');
    if (origin && !allowedOrigins(req).has(origin)) return res.status(403).json({ error: 'Origin not allowed' });
    if (req.get('sec-fetch-site') === 'cross-site') return res.status(403).json({ error: 'Cross-site requests are not allowed' });
    next();
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
function requireAdmin(req, res, next) {
    const token = getToken(req);
    const session = sessions.get(token);
    if (!session || session.expires <= Date.now()) { sessions.delete(token); return res.status(401).json({ error: 'Please sign in as administrator' }); }
    res.set('Cache-Control', 'no-store');
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
    router.post('/auth/login', checkOrigin, rateLimit('login', 5, 15 * 60000), (req, res) => {
        const { email, password } = req.body || {};
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) return res.status(503).json({ error: 'Administrator account is not configured' });
        if (typeof email !== 'string' || typeof password !== 'string' || password.length > 256 || email !== process.env.ADMIN_EMAIL || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)) return res.status(401).json({ error: 'Incorrect credentials' });
        for (const [key, session] of sessions) if (session.expires <= Date.now()) sessions.delete(key);
        sessions.delete(getToken(req));
        if (sessions.size >= 100) sessions.delete(sessions.keys().next().value);
        const token = crypto.randomBytes(32).toString('hex');
        sessions.set(token, { expires: Date.now() + sessionTTL });
        res.cookie(cookieName, token, cookieOptions()).set('Cache-Control', 'no-store').json({ authenticated: true });
    });
    router.get('/auth/session', requireAdmin, (req, res) => res.json({ authenticated: true }));
    router.post('/auth/logout', checkOrigin, (req, res) => {
        sessions.delete(getToken(req)); res.clearCookie(cookieName, cookieOptions()).json({ authenticated: false });
    });
}
module.exports = { requireAdmin, rateLimit, checkOrigin, mountAuth, allowedOrigins };
