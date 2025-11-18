const User = require('../models/UserModel');
const bcrypt = require('bcrypt');


exports.RegisterUser = async(req, res) => {
    console.log('=== REGISTRATION START ===');
    console.log('Request body:', req.body);
    
    try {
        const { name, email, password } = req.body;
        console.log('Extracted:', { name, email, password: password ? `${password.length} chars` : 'MISSING' });

        if (!name || !email || !password) {
            console.log('VALIDATION FAILED: Missing fields');
            return res.status(400).json({
                success: false,
                message: 'All fields required'
            });
        }

        // Additional validation
        if (password.length < 6) {
            console.log('VALIDATION FAILED: Password too short');
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        console.log('Creating user with validated data...');
        const user = await User.create({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            password: String(password)
        });
        console.log('User created successfully:', user._id);
        
        const token = user.getJwtToken();
        console.log('Token generated successfully');

        res.status(201).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
        
    } catch (error) {
        console.log('=== REGISTRATION ERROR ===');
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        console.log('Error name:', error.name);
        
        res.status(400).json({
            success: false,
            message: error.code === 11000 ? 'Email already exists' : error.message || 'Registration failed'
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