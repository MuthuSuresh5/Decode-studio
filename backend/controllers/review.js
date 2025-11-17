const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');

exports.createReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        // Check if user has at least one delivered order
        const deliveredOrders = await Order.find({
            user: req.user.id,
            Orderstatus: 'Delivered'
        });

        if (deliveredOrders.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'You can only create reviews after at least one of your orders has been delivered'
            });
        }

        const review = await Review.create({
            user: req.user.id,
            rating,
            comment
        });
        res.status(201).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}