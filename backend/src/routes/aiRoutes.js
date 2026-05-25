const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', asyncHandler(aiController.chatWithGemini));
router.get('/models', asyncHandler(aiController.listModels));

module.exports = router;
