const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


exports.RegisterUser = async(req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (password.length < 6) {
            console.log('Password too short:', password.length);
            return res.status(400).json({
                success: false,
                message: 'Password too short'
            });
        }

        console.log('Creating user with:', { name: name.trim(), email: email.trim().toLowerCase() });
        
        // Create user directly (let MongoDB handle duplicates)
        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password
        });
        
        console.log('User created successfully:', user._id);
        const token = user.getJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
}

exports.LoginUser = async(req,res) => {
    try {
        let {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'please enter email and password'
            });
        }

        // Normalize email for login
        email = email.trim().toLowerCase();
        
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }
        }).select('+password');

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