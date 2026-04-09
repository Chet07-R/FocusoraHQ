import api from '../api';
import { io } from 'socket.io-client';

const baseUrl = String(api.defaults.baseURL || '').replace(/\/$/, '');
const SOCKET_URL = baseUrl.startsWith('http')
  ? (baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl)
  : undefined;
export const socket = io(SOCKET_URL);

const normalizeRoom = (room) => {
  if (!room) return room;

  const id = room.id || room._id;
  const creatorId = room.creatorId || String(room.createdBy || '');

  return {
    ...room,
    id,
    _id: room._id || id,
    creatorId,
    creatorName: room.creatorName || room.hostName || room.createdByName || 'Host',
    isPublic: typeof room.isPublic === 'boolean' ? room.isPublic : !room.isPrivate,
    maxParticipants: room.maxParticipants || 50,
  };
};

// --- USER PROFILES ---
export const createUserProfile = async (userId, profileData) => {
  const res = await api.put('/users/profile', profileData);
  return res.data;
};
export const getUserProfile = async (userId) => {
  try { const res = await api.get('/users/profile'); return res.data; } catch { return null; }
};
export const updateUserProfile = async (userId, updates) => {
  await api.put('/users/profile', updates);
};
export const subscribeToUserProfile = (userId, callback) => {
  api.get('/users/profile').then(res => callback(res.data)).catch(() => {});
  return () => {}; 
};

// --- STUDY SESSIONS ---
export const createStudySession = async (userId, sessionData) => {
  const res = await api.post('/sessions', sessionData);
  return res.data._id;
};
export const endStudySession = async (sessionId, userId, durationMinutes) => {
  await api.put(`/sessions/${sessionId}/end`, { duration: durationMinutes });
};
export const getUserStudySessions = (userId, callback, limitCount = 20) => {
  api.get(`/sessions?limit=${limitCount}`).then(res => callback(res.data)).catch(() => {});
  return () => {};
};

// --- STUDY ROOMS ---
export const createStudyRoom = async (roomData) => {
  const res = await api.post('/rooms', roomData);
  return res.data._id || res.data.id;
};
export const getActiveStudyRooms = (callback) => {
  api.get('/rooms').then(res => callback((res.data || []).map(normalizeRoom))).catch(() => {});
  const interval = setInterval(() => {
    api.get('/rooms').then(res => callback((res.data || []).map(normalizeRoom))).catch(() => {});
  }, 5000);
  return () => clearInterval(interval);
};

export const joinStudyRoom = async (roomId, userData) => {
  socket.emit('join-room', { roomId, user: userData });
};
export const leaveStudyRoom = async (roomId, userId) => {
  socket.emit('leave-room', { roomId, user: { userId } });
};
export const updateRoomPresence = async (roomId, userId) => {
  socket.emit('presence-heartbeat', { roomId, userId, at: Date.now() });
};
export const setRoomPresenceStatus = async (roomId, userId, status) => {
  socket.emit('presence-status', { roomId, userId, status, at: Date.now() });
};
export const deleteStudyRoom = async (roomId) => {
  await api.delete(`/rooms/${roomId}`);
};

export const subscribeToStudyRoom = (roomId, callback) => {
  api.get(`/rooms/${roomId}`).then(res => callback(normalizeRoom(res.data))).catch(() => {});
  const interval = setInterval(() => {
    api.get(`/rooms/${roomId}`).then(res => callback(normalizeRoom(res.data))).catch(() => {});
  }, 5000);
  return () => clearInterval(interval);
};
export const subscribeToRoomParticipants = (roomId, callback) => {
  const participantsMap = new Map();

  const emitParticipants = () => callback(Array.from(participantsMap.values()));

  const seed = (room) => {
    (room?.participants || []).forEach((p) => {
      const key = String(p.userId || p._id || p.uid || '');
      if (key) {
        participantsMap.set(key, { ...p, userId: key });
      }
    });
    emitParticipants();
  };

  api.get(`/rooms/${roomId}`).then((res) => seed(normalizeRoom(res.data))).catch(() => {});

  const onJoin = ({ roomId: joinedRoomId, user }) => {
    if (String(joinedRoomId) !== String(roomId) || !user) return;
    const key = String(user.userId || user._id || user.uid || '');
    if (!key) return;
    participantsMap.set(key, { ...user, userId: key });
    emitParticipants();
  };

  const onLeave = ({ roomId: leftRoomId, user }) => {
    if (String(leftRoomId) !== String(roomId) || !user) return;
    const key = String(user.userId || user._id || user.uid || '');
    if (!key) return;
    participantsMap.delete(key);
    emitParticipants();
  };

  socket.on('user-joined', onJoin);
  socket.on('user-left', onLeave);

  return () => {
    socket.off('user-joined', onJoin);
    socket.off('user-left', onLeave);
  };
};

export const updateRoomTimer = async (roomId, timerData) => {
  socket.emit('timer-update', { roomId, timerData });
};

// --- ROOM CHAT ---
export const sendRoomChatMessage = async (roomId, userId, displayName, message) => {
  const fullMsg = { id: Date.now().toString(), userId, displayName, message, timestamp: new Date() };
  socket.emit('send-message', { roomId, message: fullMsg });
};
export const subscribeToRoomChat = (roomId, callback) => {
  const messages = [];
  const handler = (msg) => { messages.push(msg); callback([...messages]); };
  socket.on('receive-message', handler);
  return () => socket.off('receive-message', handler);
};

// --- ROOM NOTES & TODOS ---
export const updateRoomNotes = async (roomId, notes, updatedById = null, updatedByName = null) => {
  socket.emit('share-notes', { roomId, notes });
};
export const addRoomTodo = async (roomId, todoText, createdById, createdByName, createdByPhotoURL = null) => {
  const todo = {
    id: Date.now().toString(),
    text: todoText,
    completed: false,
    createdById,
    createdByName,
    createdByPhotoURL,
    createdAt: new Date().toISOString(),
  };
  socket.emit('todo-added', { roomId, todo });
};
export const toggleRoomTodo = async (roomId, todoId, completed) => {
  socket.emit('todo-toggled', { roomId, todoId, completed });
};
export const deleteRoomTodo = async (roomId, todoId) => {
  socket.emit('todo-deleted', { roomId, todoId });
};
export const subscribeToRoomTodos = (roomId, callback) => {
  const todos = [];
  const addHandler = (todo) => {
    todos.push(todo);
    callback([...todos]);
  };
  const toggleHandler = ({ todoId, completed }) => {
    const idx = todos.findIndex((todo) => String(todo.id) === String(todoId));
    if (idx >= 0) {
      todos[idx] = { ...todos[idx], completed: Boolean(completed) };
      callback([...todos]);
    }
  };
  const deleteHandler = ({ todoId }) => {
    const idx = todos.findIndex((todo) => String(todo.id) === String(todoId));
    if (idx >= 0) {
      todos.splice(idx, 1);
      callback([...todos]);
    }
  };

  socket.on('todo-received', addHandler);
  socket.on('todo-toggled-received', toggleHandler);
  socket.on('todo-deleted-received', deleteHandler);

  return () => {
    socket.off('todo-received', addHandler);
    socket.off('todo-toggled-received', toggleHandler);
    socket.off('todo-deleted-received', deleteHandler);
  };
};

// --- ROOM MEDIAS ---
export const updateRoomPlaylist = async (roomId, spotifyUrl, updatedById = null, updatedByName = null) => {
  socket.emit('update-playlist', { roomId, spotifyUrl });
};
export const updateRoomBackground = async (roomId, backgroundUrl, updatedById = null, updatedByName = null) => {
  socket.emit('update-background', { roomId, backgroundUrl });
};
export const signalRoomPlayback = async (roomId, action, updatedById = null, updatedByName = null) => {
  socket.emit('sync-playback', { roomId, action, updatedById, updatedByName });
};

// --- ROOM FILES ---
export const addRoomFileMetadata = async (roomId, file) => {};
export const subscribeToRoomFiles = (roomId, callback) => { return () => {}; };
export const deleteRoomFile = async (roomId, fileId) => {};
export const backfillRoomTodosCreators = async () => 0;

// --- LEADERBOARD ---
export const getLeaderboard = (callback, limitCount = 50) => {
  api.get(`/users/leaderboard?sortBy=points&limit=${limitCount}`).then(res => callback(res.data)).catch(() => {});
  return () => {};
};
export const getLeaderboardByStudyTime = (callback, limitCount = 50) => {
  api.get(`/users/leaderboard?sortBy=time&limit=${limitCount}`).then(res => callback(res.data)).catch(() => {});
  return () => {};
};

// --- PERSONAL NOTES ---
export const saveNote = async (userId, noteData) => {
  const res = await api.post('/notes', noteData); return res.data._id;
};
export const updateNote = async (userId, noteId, updates) => {
  await api.put(`/notes/${noteId}`, updates);
};
export const deleteNote = async (userId, noteId) => {
  await api.delete(`/notes/${noteId}`);
};
export const subscribeToNotes = (userId, callback) => {
  api.get('/notes').then(res => callback(res.data)).catch(() => {});
  return () => {};
};

// --- PERSONAL TODOS ---
export const saveTodo = async (userId, todoData) => {
  const res = await api.post('/todos', todoData); return res.data._id;
};
export const updateTodo = async (userId, todoId, updates) => {
  await api.put(`/todos/${todoId}`, updates);
};
export const deleteTodo = async (userId, todoId) => {
  await api.delete(`/todos/${todoId}`);
};
export const subscribeToTodos = (userId, callback) => {
  api.get('/todos').then(res => callback(res.data)).catch(() => {});
  return () => {};
};

// --- MISC ---
export const deleteUserData = async (userId) => {
  await api.delete('/users/profile');
};
