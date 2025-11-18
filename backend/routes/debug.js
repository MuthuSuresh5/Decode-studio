const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

// ONLY FOR DEVELOPMENT - Remove in production
router.delete('/clear-users', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ success: true, message: 'All users cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;