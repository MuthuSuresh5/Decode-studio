const Order = require('../models/orderModel')


exports.newOrder = async(req,res,next) => {
    try {
        const{phoneNumber, service, description, deadline, budget} = req.body;

        // Validate required fields
        if (!phoneNumber || !service || !description || !deadline || !budget) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const order = await Order.create({
            phoneNumber,
            service,
            description,
            deadline,
            budget,
            user: req.user.id
        });
        
        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Order creation error:', error);
        
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
            message: 'Failed to create order',
            error: error.message
        });
    }
};


exports.getSingleOrder = async(req,res,next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if(!order){
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.myOrders = async(req,res,next) => {
    try {
        const orders = await Order.find({user: req.user.id});
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.getAllOrders = async(req,res,next) => {
    try {
        const orders = await Order.find();
         let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += parseFloat(order.budget);
        });
        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


exports.updateOrder = async(req,res,next) => {
    try {
        let order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }); 
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.deleteOrder = async(req,res,next) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        await Order.deleteOne({_id: req.params.id});
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};