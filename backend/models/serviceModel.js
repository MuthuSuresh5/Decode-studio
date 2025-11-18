const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 50
    },
    description:{
        type: String,
        required: true,
        maxlength: 500
    },
    features:[
        {
            type: String,
            required: true
        }
    ],
    price:[
        {
            from:{
            type: Number,
            required: true
        },
        to:{
            type: Number,
            required: true
        }
    }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    limit:{
        type: Number,
        default: null,
        min: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
    }
})

module.exports = mongoose.model('Service', serviceSchema);
