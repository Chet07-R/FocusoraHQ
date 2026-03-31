const Todo = require('../models/Todo');
const { ok, fail } = require('../utils/apiResponse');

const createTodo = async (req, res) => {
  const todo = await Todo.create({
    userId: req.user._id,
    text: req.body.text || req.body.title || 'Untitled task',
    completed: Boolean(req.body.completed),
  });

  return ok(res, todo, 201);
};

const listTodos = async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return ok(res, todos);
};

const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      ...(typeof req.body.text === 'string' ? { text: req.body.text } : {}),
      ...(typeof req.body.completed === 'boolean' ? { completed: req.body.completed } : {}),
    },
    { new: true }
  );

  if (!todo) {
    return fail(res, 404, 'TODO_NOT_FOUND', 'Todo not found');
  }

  return ok(res, todo);
};

const deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!todo) {
    return fail(res, 404, 'TODO_NOT_FOUND', 'Todo not found');
  }

  return ok(res, { success: true });
};

module.exports = { createTodo, listTodos, updateTodo, deleteTodo };
