const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

router.get('/', asyncHandler(roomsController.listRooms));
router.get('/:id', asyncHandler(roomsController.getRoom));
router.get('/:id/todos', authGuard, asyncHandler(roomsController.listRoomTodos));
router.post('/', authGuard, asyncHandler(roomsController.createRoom));
router.put('/:id/notes', authGuard, asyncHandler(roomsController.updateRoomNotes));
router.put('/:id/playlist', authGuard, asyncHandler(roomsController.updateRoomPlaylist));
router.put('/:id/background', authGuard, asyncHandler(roomsController.updateRoomBackground));
router.post('/:id/todos', authGuard, asyncHandler(roomsController.addRoomTodo));
router.put('/:id/todos/:todoId', authGuard, asyncHandler(roomsController.toggleRoomTodo));
router.delete('/:id/todos/:todoId', authGuard, asyncHandler(roomsController.deleteRoomTodo));
router.delete('/:id', authGuard, asyncHandler(roomsController.deleteRoom));

module.exports = router;
