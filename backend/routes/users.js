const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

// Get all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get all orders (admin only)
router.get('/orders', async (req, res) => {
    try {
        const Order = require('../models/orderModel');
        const orders = await Order.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Get all contacts (admin only)
router.get('/contacts', async (req, res) => {
    try {
        const Contact = require('../models/contactModel');
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});

// Delete user (admin only)
router.delete('/user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// Create user (admin only)
router.post('/user', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
});

// Make user admin (temporary route for setup)
router.put('/make-admin/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: 'admin' },
            { new: true }
        ).select('-password');
        res.status(200).json({
            success: true,
            message: 'User role updated to admin',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user role'
        });
    }
});

// Update user (admin only)
router.put('/user/:id', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select('-password');
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// Delete contact (admin only)
router.delete('/contact/:id', async (req, res) => {
    try {
        const Contact = require('../models/contactModel');
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact'
        });
    }
});

module.exports = router;