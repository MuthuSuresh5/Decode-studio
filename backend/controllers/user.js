const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


exports.RegisterUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
        // Create new user
        const user = await User.create({ 
            name: name.trim(), 
            email: normalizedEmail, 
            password: String(password)
        });
        
        // Generate JWT token
        const token = user.getJwtToken();

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
        
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({
                success: false,
                message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
}

exports.LoginUser = async(req, res) => {
    try {
        let { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter email and password'
            });
        }

        // Normalize email
        email = email.trim().toLowerCase();
        
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = user.getJwtToken();

        // Cookie options
        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        // Remove password from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
                message: 'Login successful',
                token,
                user: userResponse
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
}


exports.logoutUser = async(req, res) => {
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.status(200)
            .cookie('token', null, options)
            .json({
                success: true,
                message: 'Logged out successfully'
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};     