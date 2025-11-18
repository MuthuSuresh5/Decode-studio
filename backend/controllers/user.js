const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


exports.RegisterUser = async(req,res) => {
    try {
        console.log('Registration request body:', req.body);
        const {name, email, password} = req.body;

        console.log('Extracted fields:', { name, email, password: password ? '***' : undefined });

        // Validate required fields
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Validate password length
        if (password.length < 6) {
            console.log('Password too short');
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Temporarily skip duplicate check for debugging
        console.log('Skipping duplicate check for debugging...');
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     console.log('User already exists');
        //     return res.status(400).json({
        //         success: false,
        //         message: 'User already exists with this email'
        //     });
        // }

        console.log('Creating new user...');
        const user = await User.create({
            name,
            email,
            password
        }); 

        console.log('User created successfully, generating token...');
        const token = user.getJwtToken();

        console.log('Registration successful');
        res.status(201).json({
            success: true,
            token,
            user
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            console.log('Validation error:', message);
            return res.status(400).json({
                success: false,
                message
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            console.log('Duplicate key error');
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
}

exports.LoginUser = async(req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'please enter email and password'
            });
        }

        const passwordString = String(password);

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'invalid email or password'
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(401).json({
                success: false,
                message: 'invalid email or password'
            });
        }

        const token = user.getJwtToken();

        const options = {
            httpOnly: true,
             expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
        }

        res.status(200)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.logoutUser = async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
};     