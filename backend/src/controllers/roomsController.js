const StudyRoom = require('../models/StudyRoom');
const { ok, fail } = require('../utils/apiResponse');
const { getSocketServer } = require('../sockets');

const emitRoomTodoEvent = (eventName, roomId, payload) => {
  const io = getSocketServer();
  if (!io) return;
  io.to(String(roomId)).emit(eventName, payload);
};

const normalizeTodo = (todo) => ({
  id: String(todo.id),
  text: String(todo.text || '').trim(),
  completed: Boolean(todo.completed),
  createdById: String(todo.createdById || ''),
  createdByName: String(todo.createdByName || ''),
  createdByPhotoURL: todo.createdByPhotoURL || null,
  createdAt: todo.createdAt || new Date().toISOString(),
  updatedAt: todo.updatedAt || new Date().toISOString(),
});

const emitRoomUpdated = (roomId, payload = {}) => {
  const io = getSocketServer();
  if (!io) return;
  io.to(String(roomId)).emit('room-data-updated', { roomId: String(roomId), ...payload });
};

const createRoom = async (req, res) => {
  const room = await StudyRoom.create({
    name: req.body.name || 'Untitled Room',
    description: req.body.description || '',
    createdBy: req.user._id,
    active: true,
    timer: {
      duration: Math.max(1, Math.floor(Number(req.body.timer?.duration || req.body.timerDuration || 25 * 60) || 25 * 60)),
      remaining: Math.max(1, Math.floor(Number(req.body.timer?.remaining || req.body.timerDuration || 25 * 60) || 25 * 60)),
      isRunning: false,
      startedAt: null,
      lastUpdatedAt: new Date(),
    },
    participants: [
      {
        userId: req.user._id,
        displayName: req.user.displayName,
        photoURL: req.user.photoURL,
      },
    ],
    participantCount: 1,
  });

  return ok(res, room, 201);
};

const listRooms = async (req, res) => {
  const rooms = await StudyRoom.find({ active: true }).sort({ updatedAt: -1 }).limit(100);
  return ok(res, rooms);
};

const getRoom = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  return ok(res, room);
};

const deleteRoom = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  if (String(room.createdBy) !== String(req.user._id)) {
    return fail(res, 403, 'FORBIDDEN', 'Only the room creator can delete this room');
  }

  room.active = false;
  room.participants = [];
  room.participantCount = 0;
  await room.save();

  return ok(res, { success: true, roomId: room._id });
};

const updateRoomNotes = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const notes = typeof req.body.notes === 'string' ? req.body.notes : '';
  room.sharedNotes = notes;
  room.notesUpdatedById = String(req.user._id);
  room.notesUpdatedByName = req.user.displayName || 'User';
  room.notesUpdatedAt = new Date();
  await room.save();

  emitRoomUpdated(room._id, {
    sharedNotes: room.sharedNotes,
    notesUpdatedById: room.notesUpdatedById,
    notesUpdatedByName: room.notesUpdatedByName,
    notesUpdatedAt: room.notesUpdatedAt,
  });

  return ok(res, room);
};

const updateRoomPlaylist = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const spotifyUrl = typeof req.body.spotifyUrl === 'string' ? req.body.spotifyUrl.trim() : '';
  room.spotifyUrl = spotifyUrl;
  room.playlistUpdatedById = String(req.user._id);
  room.playlistUpdatedByName = req.user.displayName || 'User';
  room.playlistUpdatedAt = new Date();
  await room.save();

  emitRoomUpdated(room._id, {
    spotifyUrl: room.spotifyUrl,
    playlistUpdatedById: room.playlistUpdatedById,
    playlistUpdatedByName: room.playlistUpdatedByName,
    playlistUpdatedAt: room.playlistUpdatedAt,
  });

  return ok(res, room);
};

const updateRoomBackground = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const backgroundUrl = typeof req.body.backgroundUrl === 'string' ? req.body.backgroundUrl.trim() : '';
  room.backgroundUrl = backgroundUrl;
  room.backgroundUpdatedById = String(req.user._id);
  room.backgroundUpdatedByName = req.user.displayName || 'User';
  room.backgroundUpdatedAt = new Date();
  await room.save();

  emitRoomUpdated(room._id, {
    backgroundUrl: room.backgroundUrl,
    backgroundUpdatedById: room.backgroundUpdatedById,
    backgroundUpdatedByName: room.backgroundUpdatedByName,
    backgroundUpdatedAt: room.backgroundUpdatedAt,
  });

  return ok(res, room);
};

const listRoomTodos = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  return ok(res, (room.todos || []).map(normalizeTodo));
};

const addRoomTodo = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const text = String(req.body.text || req.body.title || '').trim();
  if (!text) {
    return fail(res, 400, 'INVALID_TODO_PAYLOAD', 'Task text is required');
  }

  const todo = normalizeTodo({
    id: String(Date.now()),
    text,
    completed: false,
    createdById: String(req.user._id),
    createdByName: req.user.displayName || 'User',
    createdByPhotoURL: req.user.photoURL || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  room.todos = [...(room.todos || []), todo];
  await room.save();

  emitRoomTodoEvent('todo-received', room._id, todo);

  return ok(res, todo, 201);
};

const toggleRoomTodo = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const todoId = String(req.params.todoId || '').trim();
  const completed = Boolean(req.body.completed);
  const todo = (room.todos || []).find((item) => String(item.id) === todoId);

  if (!todo) {
    return fail(res, 404, 'TODO_NOT_FOUND', 'Task not found');
  }

  todo.completed = completed;
  todo.updatedAt = new Date().toISOString();
  await room.save();

  emitRoomTodoEvent('todo-toggled-received', room._id, { todoId, completed });

  return ok(res, normalizeTodo(todo));
};

const deleteRoomTodo = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const todoId = String(req.params.todoId || '').trim();
  const existingLength = (room.todos || []).length;
  room.todos = (room.todos || []).filter((item) => String(item.id) !== todoId);

  if ((room.todos || []).length === existingLength) {
    return fail(res, 404, 'TODO_NOT_FOUND', 'Task not found');
  }

  await room.save();
  emitRoomTodoEvent('todo-deleted-received', room._id, { todoId });

  return ok(res, { success: true, todoId });
};

module.exports = { createRoom, listRooms, getRoom, deleteRoom, updateRoomNotes, updateRoomPlaylist, updateRoomBackground, listRoomTodos, addRoomTodo, toggleRoomTodo, deleteRoomTodo };
