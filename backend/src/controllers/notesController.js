const Note = require('../models/Note');
const { ok, fail } = require('../utils/apiResponse');

const createNote = async (req, res) => {
  const note = await Note.create({
    userId: req.user._id,
    title: req.body.title || '',
    content: req.body.content || '',
  });

  return ok(res, note, 201);
};

const listNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  return ok(res, notes);
};

const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      ...(typeof req.body.title === 'string' ? { title: req.body.title } : {}),
      ...(typeof req.body.content === 'string' ? { content: req.body.content } : {}),
    },
    { new: true }
  );

  if (!note) {
    return fail(res, 404, 'NOTE_NOT_FOUND', 'Note not found');
  }

  return ok(res, note);
};

const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!note) {
    return fail(res, 404, 'NOTE_NOT_FOUND', 'Note not found');
  }

  return ok(res, { success: true });
};

module.exports = { createNote, listNotes, updateNote, deleteNote };
