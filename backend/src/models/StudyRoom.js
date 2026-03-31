const mongoose = require('mongoose');

const roomParticipantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String, required: true },
    photoURL: { type: String, default: null },
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
    spotifyUrl: { type: String, default: '' },
    backgroundUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

studyRoomSchema.index({ active: 1, updatedAt: -1 });

module.exports = mongoose.model('StudyRoom', studyRoomSchema);
