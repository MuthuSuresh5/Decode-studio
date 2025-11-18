const express = require('express');
const { RegisterUser, LoginUser, logoutUser } = require('../controllers/user');
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.get('/logout', logoutUser);

module.exports = router;