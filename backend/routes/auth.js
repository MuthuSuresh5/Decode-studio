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

module.exports = router;