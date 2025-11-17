const Service = require('../models/serviceModel');


exports.getServices = async(req,res) =>{
    try {
        const services = await Service.find();
        res.status(200).json({
            success: true,
            services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


exports.createService = async(req,res) =>{
    try {
        req.body.user = req.user.id;
        const service = await Service.create(req.body);
        res.status(201).json({
            success: true,
            service
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


exports.getSingleService = async(req,res) =>{
    try {
        const service = await Service.findById(req.params.id);
        if(!service){
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
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


exports.updateService = async(req,res) =>{
    try {
        const service = await Service.findById(req.params.id);
        if(!service){
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const updatedService = await Service.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            updatedService
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteService = async(req,res) =>{
    try {
        const service = await Service.findById(req.params.id);
        if(!service){
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
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};