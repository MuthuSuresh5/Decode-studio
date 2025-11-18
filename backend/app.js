const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Import routes
const serviceRoutes = require('./routes/service');
const UserRoutes = require('./routes/auth');
const OrderRoutes = require('./routes/order');
const ReviewRoutes = require('./routes/review');
const ContactRoutes = require('./routes/contact');
const AdminRoutes = require('./routes/users');

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working', timestamp: new Date() });
});

// Fix database indexes
app.post('/api/fix-indexes', async (req, res) => {
    try {
        const User = require('./models/UserModel');
        
        // Drop the problematic apiKey index
        await User.collection.dropIndex('apiKey_1');
        
        res.json({ success: true, message: 'Problematic index dropped' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Debug registration
app.post('/api/debug-register', async (req, res) => {
    console.log('=== DEBUG REGISTRATION ===');
    console.log('Body:', req.body);
    
    try {
        const User = require('./models/UserModel');
        const { name, email, password } = req.body;
        
        console.log('Input validation...');
        if (!name || !email || !password) {
            return res.json({ step: 'validation', error: 'Missing fields', data: { name: !!name, email: !!email, password: !!password } });
        }
        
        console.log('Checking existing user...');
        const existing = await User.findOne({ email: email.toLowerCase() });
        console.log('Existing user:', existing);
        
        if (existing) {
            return res.json({ step: 'duplicate_check', error: 'User exists', existingUser: existing._id });
        }
        
        console.log('Creating user...');
        const user = await User.create({ name, email: email.toLowerCase(), password });
        
        res.json({ step: 'success', userId: user._id, message: 'User created' });
    } catch (error) {
        console.log('Debug error:', error);
        res.json({ step: 'error', error: error.message, code: error.code, name: error.name });
    }
});

// Test user creation
app.post('/api/test-user', async (req, res) => {
    try {
        const User = require('./models/UserModel');
        const testEmail = `test${Date.now()}@example.com`;
        console.log('Creating test user with email:', testEmail);
        
        const user = await User.create({
            name: 'Test User',
            email: testEmail,
            password: 'password123'
        });
        
        console.log('Test user created:', user._id);
        res.json({ success: true, userId: user._id, email: user.email, message: 'User created' });
    } catch (error) {
        console.log('Test user creation error:', error);
        res.status(400).json({ success: false, error: error.message, code: error.code });
    }
});

// Force create user (bypass all checks)
app.post('/api/force-user', async (req, res) => {
    try {
        const User = require('./models/UserModel');
        const { name, email, password } = req.body;
        
        console.log('Force creating user:', { name, email });
        
        // Drop the unique index temporarily and recreate user
        const user = new User({ name, email, password });
        await user.save();
        
        console.log('Force user created:', user._id);
        res.json({ success: true, userId: user._id, message: 'User force created' });
    } catch (error) {
        console.log('Force user creation error:', error);
        res.status(400).json({ success: false, error: error.message, code: error.code });
    }
});

// Routes
app.use('/api/auth', UserRoutes);
app.use('/api/v1', serviceRoutes);
app.use('/api/v1', OrderRoutes);
app.use('/api/v1', ReviewRoutes);
app.use('/api/v1', ContactRoutes);
app.use('/api/admin', AdminRoutes);

module.exports = app;