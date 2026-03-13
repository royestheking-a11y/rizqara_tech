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
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api', require('./routes'));

// Serve Static Frontend (Vite Build)
const distPath = path.join(__dirname, '../dist');
console.log('Frontend dist path:', distPath);
app.use(express.static(distPath));

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

// Health Check Endpoint for Render Keep-Alive
// Added aliases because /health might be rate-limited by platform
const healthCheck = (req, res) => res.status(200).send('OK');
app.get('/health', healthCheck);
app.get('/ping', healthCheck);
app.get('/api/health', healthCheck);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
