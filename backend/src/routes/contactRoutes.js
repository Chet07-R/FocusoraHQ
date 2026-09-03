const express = require('express');
const { submitContactMessage } = require('../controllers/contactController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(submitContactMessage));

module.exports = router;
