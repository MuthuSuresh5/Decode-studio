const Service = require('../models/serviceModel');


exports.getServices = async(req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services'
        });
    }
};


exports.createService = async(req, res) => {
    try {
        const { name, description, features, price, status } = req.body;
        
        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Name and description are required'
            });
        }
        
        // Validate features array
        if (!features || !Array.isArray(features) || features.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one feature is required'
            });
        }
        
        // Validate price array
        if (!price || !Array.isArray(price) || price.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Price range is required'
            });
        }
        
        // Validate price structure
        for (let priceRange of price) {
            if (!priceRange.from || !priceRange.to || priceRange.from >= priceRange.to) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid price range. From must be less than To'
                });
            }
        }
        
        const serviceData = {
            name: name.trim(),
            description: description.trim(),
            features: features.map(f => f.trim()).filter(f => f.length > 0),
            price,
            status: status || 'active',
            user: req.user.id
        };
        
        const service = await Service.create(serviceData);
        
        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            service
        });
        
    } catch (error) {
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
            message: 'Failed to create service. Please try again.'
        });
    }
}


exports.getSingleService = async(req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        
        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service'
        });
    }
}


exports.updateService = async(req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        
        const { name, description, features, price, status } = req.body;
        
        // Validate if updating features
        if (features && (!Array.isArray(features) || features.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Features must be a non-empty array'
            });
        }
        
        // Validate if updating price
        if (price && (!Array.isArray(price) || price.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a non-empty array'
            });
        }
        
        // Validate price structure if provided
        if (price) {
            for (let priceRange of price) {
                if (!priceRange.from || !priceRange.to || priceRange.from >= priceRange.to) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid price range. From must be less than To'
                    });
                }
            }
        }
        
        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (features) updateData.features = features.map(f => f.trim()).filter(f => f.length > 0);
        if (price) updateData.price = price;
        if (status) updateData.status = status;
        
        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            service: updatedService
        });
        
    } catch (error) {
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
            message: 'Failed to update service. Please try again.'
        });
    }
};

exports.deleteService = async(req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        
        await Service.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to delete service'
        });
    }
};