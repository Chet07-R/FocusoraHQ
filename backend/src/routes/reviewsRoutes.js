const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { optionalAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { createReviewValidator } = require('../validators/reviewsValidators');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/', asyncHandler(reviewsController.listReviews));
router.post('/', optionalAuth, createReviewValidator, validate, asyncHandler(reviewsController.createReview));

module.exports = router;
