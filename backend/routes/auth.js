const express = require('express');
const { RegisterUser, LoginUser, logoutUser } = require('../controllers/user');
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', logoutUser);

// Debug endpoint to check existing emails
router.get('/check-emails', async (req, res) => {
    try {
        const User = require('../models/UserModel');
        const users = await User.find({}, 'email name');
        res.json({
            success: true,
            count: users.length,
            emails: users.map(u => ({ email: u.email, name: u.name }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Simple test registration
router.post('/test-reg', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const User = require('../models/UserModel');
        const user = await User.create({ name, email, password });
        
        res.json({ success: true, message: 'User created', id: user._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message, code: error.code });
    }
});

module.exports = router;