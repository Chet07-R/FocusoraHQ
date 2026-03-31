const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

router.get('/', asyncHandler(roomsController.listRooms));
router.get('/:id', asyncHandler(roomsController.getRoom));
router.post('/', authGuard, asyncHandler(roomsController.createRoom));

module.exports = router;
