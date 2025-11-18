const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt =  require('jsonwebtoken');


const userModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your user name"]
    },
    email:{
        type:String,
        required:[true, "please enter your email"],
        unique:true,
        validate:[validator.isEmail,'please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'please enter your password'],
        select:false
    },
    role:{
        type:String,
        default:'user'
    },
    budget:{
        type:Number,
        default:null
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

userModel.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    
    if (!this.password || typeof this.password !== 'string') {
        return next(new Error('Password must be a string'));
    }
    
    // Validate password length before hashing
    if (this.password.length < 6) {
        return next(new Error('Password must be at least 6 characters'));
    }
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userModel.methods.getJwtToken=function(){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    }); 
}


module.exports = mongoose.model('User', userModel);