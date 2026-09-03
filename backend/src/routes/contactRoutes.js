const express = require('express');
const { submitContactMessage, subscribeNewsletter } = require('../controllers/contactController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(submitContactMessage));
router.post('/newsletter', asyncHandler(subscribeNewsletter));

module.exports = router;
