const mongoose = require('mongoose');

const roomParticipantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, default: null },
  },
  { _id: false }
);

const roomTodoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    createdById: { type: String, default: '' },
    createdByName: { type: String, default: '' },
    createdByPhotoURL: { type: String, default: null },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const roomChatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, default: '' },
    displayName: { type: String, default: '' },
    message: { type: String, required: true, trim: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const roomTimerSchema = new mongoose.Schema(
  {
    duration: { type: Number, default: 25 * 60 },
    remaining: { type: Number, default: 25 * 60 },
    isRunning: { type: Boolean, default: false },
    startedAt: { type: Date, default: null },
    lastUpdatedAt: { type: Date, default: null },
  },
  { _id: false }
);

const studyRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    active: { type: Boolean, default: true },
    participants: { type: [roomParticipantSchema], default: [] },
    participantCount: { type: Number, default: 0 },
    timer: { type: roomTimerSchema, default: () => ({}) },
    sharedNotes: { type: String, default: '' },
    notesUpdatedById: { type: String, default: null },
    notesUpdatedByName: { type: String, default: null },
    notesUpdatedAt: { type: Date, default: null },
    spotifyUrl: { type: String, default: '' },
    playlistUpdatedById: { type: String, default: null },
    playlistUpdatedByName: { type: String, default: null },
    playlistUpdatedAt: { type: Date, default: null },
    backgroundUrl: { type: String, default: '' },
    backgroundUpdatedById: { type: String, default: null },
    backgroundUpdatedByName: { type: String, default: null },
    backgroundUpdatedAt: { type: Date, default: null },
    chatMessages: { type: [roomChatMessageSchema], default: [] },
    todos: { type: [roomTodoSchema], default: [] },
  },
  { timestamps: true }
);

studyRoomSchema.index({ active: 1, updatedAt: -1 });

module.exports = mongoose.model('StudyRoom', studyRoomSchema);
