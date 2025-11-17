const express = require('express');
const { createReview, getReviews, deleteReview } = require('../controllers/review');
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/authenticate');
const router = express.Router();


router.route('/review').post(isAuthenticatedUser, createReview);
router.route('/reviews').get(getReviews);
router.route('/reviews/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview);

module.exports = router;