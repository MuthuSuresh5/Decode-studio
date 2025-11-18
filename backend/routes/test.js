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

module.exports = router;