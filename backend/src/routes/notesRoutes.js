const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const notesController = require('../controllers/notesController');

const router = express.Router();

router.get('/', authGuard, asyncHandler(notesController.listNotes));
router.post('/', authGuard, asyncHandler(notesController.createNote));
router.put('/:id', authGuard, asyncHandler(notesController.updateNote));
router.delete('/:id', authGuard, asyncHandler(notesController.deleteNote));

module.exports = router;
