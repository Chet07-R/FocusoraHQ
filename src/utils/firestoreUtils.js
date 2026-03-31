import api from '../api';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
export const socket = io(SOCKET_URL);

// --- USER PROFILES ---
export const createUserProfile = async (userId, profileData) => {};
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
  return res.data._id;
};
export const getActiveStudyRooms = (callback) => {
  api.get('/rooms').then(res => callback(res.data)).catch(() => {});
  const interval = setInterval(() => {
    api.get('/rooms').then(res => callback(res.data)).catch(() => {});
  }, 5000);
  return () => clearInterval(interval);
};

export const joinStudyRoom = async (roomId, userData) => {
  socket.emit('join-room', { roomId, user: userData });
};
export const leaveStudyRoom = async (roomId, userId) => {
  socket.emit('leave-room', { roomId, user: { _id: userId } });
};
export const updateRoomPresence = async (roomId, userId) => {};
export const setRoomPresenceStatus = async (roomId, userId, status) => {};
export const deleteStudyRoom = async (roomId) => {};

export const subscribeToStudyRoom = (roomId, callback) => {
  api.get(`/rooms/${roomId}`).then(res => callback(res.data)).catch(() => {});
  return () => {};
};
export const subscribeToRoomParticipants = (roomId, callback) => {
  const handler = (data) => console.log(data); // In full implementation, manage participant list
  socket.on('user-joined', handler);
  socket.on('user-left', handler);
  return () => { socket.off('user-joined', handler); socket.off('user-left', handler); };
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
  const todo = { id: Date.now().toString(), text: todoText, completed: false, createdByName };
  socket.emit('todo-added', { roomId, todo });
};
export const toggleRoomTodo = async (roomId, todoId, completed) => {};
export const deleteRoomTodo = async (roomId, todoId) => {};
export const subscribeToRoomTodos = (roomId, callback) => {
  const todos = [];
  const handler = (todo) => { todos.push(todo); callback([...todos]); };
  socket.on('todo-received', handler);
  return () => socket.off('todo-received', handler);
};

// --- ROOM MEDIAS ---
export const updateRoomPlaylist = async (roomId, spotifyUrl, updatedById = null, updatedByName = null) => {
  socket.emit('update-playlist', { roomId, spotifyUrl });
};
export const updateRoomBackground = async (roomId, backgroundUrl, updatedById = null, updatedByName = null) => {
  socket.emit('update-background', { roomId, backgroundUrl });
};
export const signalRoomPlayback = async (roomId, action, updatedById = null, updatedByName = null) => {};

// --- ROOM FILES ---
export const addRoomFileMetadata = async (roomId, file) => {};
export const subscribeToRoomFiles = (roomId, callback) => { return () => {}; };
export const deleteRoomFile = async (roomId, fileId) => {};
export const backfillRoomTodosCreators = async () => {};

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
