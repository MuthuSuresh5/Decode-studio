const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

// Clear all users (for testing only)
router.delete('/clear-users', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.json({ 
            success: true, 
            message: `Deleted ${result.deletedCount} users`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// List all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'name email role createdAt');
        res.json({ 
            success: true, 
            users,
            count: users.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Simple test registration
router.post('/simple-register', async (req, res) => {
    try {
        console.log('Simple register request:', req.body);
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing fields'
            });
        }
        
        const user = new User({ name, email, password });
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Simple register error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;