const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { authGuard } = require('../middlewares/auth');
const todosController = require('../controllers/todosController');

const router = express.Router();

router.get('/', authGuard, asyncHandler(todosController.listTodos));
router.post('/', authGuard, asyncHandler(todosController.createTodo));
router.put('/:id', authGuard, asyncHandler(todosController.updateTodo));
router.delete('/:id', authGuard, asyncHandler(todosController.deleteTodo));

module.exports = router;
