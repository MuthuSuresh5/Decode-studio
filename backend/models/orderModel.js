const mongoose = require('mongoose');
const User = require('./UserModel')

const orderSchema = new mongoose.Schema({
    phoneNumber:{
        type: String,
        required: true
    },
    service:{
        type:String,
        required: true
    },

    description:{
        type: String,
        required:true
    },

    deadline:{
        type: String,
        required: true,
        enum:{
            values:[
                "Within 1 week",
                "Within 2 weeks",
                "Within 1 month",
                "Within 2 months",
                "flexible"
            ]
        }
    },
    budget:{
        type:String,
        required:true,
    },

    user:{
        type : mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
     Orderstatus:{
        type:String,
        required:true,
        default:'Processing',
        enum:{
            values:[
                'Processing',
                'In Progress',
                'Completed',
                'Delivered',
                'Cancelled'
            ]
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

let orderModel = mongoose.model('Order', orderSchema);

module.exports= orderModel;