const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const sessionsController = require('../controllers/sessionsController');

const router = express.Router();

router.get('/', authGuard, asyncHandler(sessionsController.listSessions));
router.post('/', authGuard, asyncHandler(sessionsController.createSession));
router.put('/:id/end', authGuard, asyncHandler(sessionsController.endSession));

module.exports = router;
