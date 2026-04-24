const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    photoURL: { type: String, default: null },
    provider: { type: String, enum: ['local', 'google', 'guest'], default: 'local' },
    googleId: { type: String, default: null },
    points: { type: Number, default: 0 },
    totalStudyMinutes: { type: Number, default: 0 },
    sessionsCount: { type: Number, default: 0 },
    focusStreak: { type: Number, default: 0 },
    bestFocusStreak: { type: Number, default: 0 },
    lastFocusDate: { type: Date, default: null },
    bio: { type: String, default: '', trim: true },
    pomodoroWork: { type: Number, default: 25, min: 1, max: 60 },
    pomodoroBreak: { type: Number, default: 5, min: 1, max: 60 },
    theme: { type: String, default: 'forest', trim: true },
    showOnLeaderboard: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ points: -1 });
userSchema.index({ totalStudyMinutes: -1 });

module.exports = mongoose.model('User', userSchema);
