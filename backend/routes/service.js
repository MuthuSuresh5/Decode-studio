const express = require('express');
const { createService, getServices, getSingleService, updateService, deleteService } = require('../controllers/service');
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/authenticate');
const router = express.Router();


router.route('/service/new').post(isAuthenticatedUser,authorizeRoles('admin'), createService); 
router.route('/services').get(getServices);
router.route('/service/:id').get(getSingleService);
router.route('/service/:id').put(updateService);
router.route('/service/:id').delete(deleteService);


module.exports = router;