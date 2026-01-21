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

app.get('/', (req, res) => {
    res.send('RizQaratech API is running');
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
