const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async(req,res,next)=>{
    
    try {
        let token = req.cookies.token;
        
        // Check Authorization header if no cookie token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'please login to access this resource'
        });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
    
}

exports.authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: `role: ${req.user.role} is not allowed to access this resource`
            });
        }   
        next();
}
}