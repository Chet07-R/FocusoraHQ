const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const activityController = require('../controllers/activityController');

const router = express.Router();

router.get('/', authGuard, asyncHandler(activityController.listMyActivity));
router.post('/', authGuard, asyncHandler(activityController.createActivity));

module.exports = router;
