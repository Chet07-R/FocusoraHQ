const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/profile', authGuard, asyncHandler(usersController.profile));
router.put('/profile', authGuard, asyncHandler(usersController.updateProfile));
router.post('/points', authGuard, asyncHandler(usersController.grantPoints));
router.delete('/profile', authGuard, asyncHandler(usersController.deleteProfile));
router.get('/leaderboard', asyncHandler(usersController.leaderboard));

module.exports = router;
