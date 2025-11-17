const express = require('express');
const { RegisterUser, LoginUser, logoutUser } = require('../controllers/user');
const router = express.Router();


router.route('/register').post(RegisterUser); 
router.route('/login').post(LoginUser);
router.route('/logout').get(logoutUser)

module.exports = router;