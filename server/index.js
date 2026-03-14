const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Proxy (Required for Render/Heroku to pass correct IPs)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
    .then(() => console.log('MongoDB Connected (Connection Pool: 10)'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Global Error Handler to prevent process crashes
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Routes
app.use('/api', require('./routes'));

// Serve Static Frontend (Vite Build)
const distPath = path.join(__dirname, '../dist');
console.log('Frontend dist path:', distPath);
app.use(express.static(distPath));

// Health Check Endpoint for Render Keep-Alive
// Added aliases because /health might be rate-limited by platform
const healthCheck = (req, res) => res.status(200).send('OK');
app.get('/health', healthCheck);
app.get('/ping', healthCheck);
app.get('/api/health', healthCheck);

// Fallback: Handle client-side routing (SPA)
app.use((req, res) => {
    // If it's an API request that reached here, it's a 404 for the API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    
    // Otherwise serve the frontend index.html for any other route
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.log('Notice: index.html not found at', indexPath);
            res.status(200).send('RizQaratech API is running (Frontend not built yet)');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // --- Render Self-Ping Keep-Alive ---
    // This keeps the service awake by pinging itself every 10 minutes
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
        console.log(`Self-ping initialized for: ${RENDER_EXTERNAL_URL}`);
        setInterval(async () => {
            try {
                // We use the external URL to ensure we go through the network stack
                const response = await fetch(`${RENDER_EXTERNAL_URL}/health`);
                console.log(`Self-ping status: ${response.status} at ${new Date().toISOString()}`);
            } catch (err) {
                console.error('Self-ping failed:', err.message);
            }
        }, 10 * 60 * 1000); // 10 minutes
    } else {
        console.log('Self-ping skipped: RENDER_EXTERNAL_URL not set (Local Dev)');
    }
});
