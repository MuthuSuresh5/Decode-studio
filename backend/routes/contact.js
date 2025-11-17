const express = require('express');
const Contact = require('../models/contactModel');
const router = express.Router();

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

module.exports = router;