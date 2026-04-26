const User = require('../models/User');
const Note = require('../models/Note');
const Todo = require('../models/Todo');
const StudySession = require('../models/StudySession');
const StudyRoom = require('../models/StudyRoom');
const ActivityEvent = require('../models/ActivityEvent');
const { ok, fail } = require('../utils/apiResponse');
const { applyFocusProgress } = require('../utils/userProgress');

const ALLOWED_THEMES = new Set(['forest', 'ocean', 'rain', 'cafe', 'library']);

const clampMinutes = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(60, Math.max(1, Math.floor(parsed)));
};

const toUserPayload = (user) => ({
  _id: user._id,
  uid: String(user._id),
  displayName: user.displayName,
  email: user.email,
  photoURL: user.photoURL,
  points: user.points,
  totalStudyMinutes: user.totalStudyMinutes,
  sessionsCount: user.sessionsCount,
  focusStreak: user.focusStreak || 0,
  bestFocusStreak: user.bestFocusStreak || 0,
  lastFocusDate: user.lastFocusDate || null,
  bio: user.bio || '',
  pomodoroWork: user.pomodoroWork || 25,
  pomodoroBreak: user.pomodoroBreak || 5,
  theme: user.theme || 'forest',
  showOnLeaderboard: typeof user.showOnLeaderboard === 'boolean' ? user.showOnLeaderboard : true,
  allowMessages: typeof user.allowMessages === 'boolean' ? user.allowMessages : true,
  notifications: typeof user.notifications === 'boolean' ? user.notifications : true,
  provider: user.provider,
  isEmailVerified: user.isEmailVerified,
});

const profile = async (req, res) => {
  return ok(res, toUserPayload(req.user));
};

const updateProfile = async (req, res) => {
  const updates = {};

  if (typeof req.body.displayName === 'string') {
    updates.displayName = req.body.displayName.trim();
  }

  if (typeof req.body.photoURL === 'string') {
    updates.photoURL = req.body.photoURL;
  }

  if (typeof req.body.bio === 'string') {
    updates.bio = req.body.bio.trim().slice(0, 300);
  }

  if (req.body.pomodoroWork !== undefined) {
    updates.pomodoroWork = clampMinutes(req.body.pomodoroWork, 25);
  }

  if (req.body.pomodoroBreak !== undefined) {
    updates.pomodoroBreak = clampMinutes(req.body.pomodoroBreak, 5);
  }

  if (typeof req.body.theme === 'string') {
    const normalizedTheme = req.body.theme.trim().toLowerCase();
    updates.theme = ALLOWED_THEMES.has(normalizedTheme) ? normalizedTheme : 'forest';
  }

  if (typeof req.body.showOnLeaderboard === 'boolean') {
    updates.showOnLeaderboard = req.body.showOnLeaderboard;
  }

  if (typeof req.body.allowMessages === 'boolean') {
    updates.allowMessages = req.body.allowMessages;
  }

  if (typeof req.body.notifications === 'boolean') {
    updates.notifications = req.body.notifications;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  return ok(res, toUserPayload(user));
};

const grantPoints = async (req, res) => {
  const rawPoints = req.body?.points;
  const rawStudyMinutes = req.body?.studyMinutes;
  const rawSessionsCount = req.body?.sessionsCount;
  const rawSubject = req.body?.subject;
  const rawRoomId = req.body?.roomId;

  const points = Number.isFinite(Number(rawPoints)) ? Math.floor(Number(rawPoints)) : NaN;
  const studyMinutes = Number.isFinite(Number(rawStudyMinutes)) ? Math.floor(Number(rawStudyMinutes)) : NaN;
  const sessionsCount = Number.isFinite(Number(rawSessionsCount)) ? Math.floor(Number(rawSessionsCount)) : NaN;

  const safePoints = Number.isNaN(points) ? 0 : points;
  const safeStudyMinutes = Number.isNaN(studyMinutes) ? 0 : studyMinutes;
  const safeSessionsCount = Number.isNaN(sessionsCount) ? 0 : sessionsCount;

  if (safePoints < 0 || safeStudyMinutes < 0 || safeSessionsCount < 0) {
    return fail(res, 400, 'INVALID_POINTS_PAYLOAD', 'Points payload must contain only non-negative numbers');
  }

  if (safePoints === 0 && safeStudyMinutes === 0 && safeSessionsCount === 0) {
    return fail(res, 400, 'INVALID_POINTS_PAYLOAD', 'At least one increment must be greater than zero');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return fail(res, 404, 'USER_NOT_FOUND', 'User not found');
  }

  const eventAt = new Date();

  applyFocusProgress(user, {
    points: safePoints,
    studyMinutes: safeStudyMinutes,
    sessionsCount: safeSessionsCount,
    eventAt,
  });

  if (safeStudyMinutes > 0 || safeSessionsCount > 0) {
    const subject = typeof rawSubject === 'string' ? rawSubject.trim() : '';
    const roomId = typeof rawRoomId === 'string' ? rawRoomId.trim() : null;
    const startTime = new Date(eventAt.getTime() - Math.max(0, safeStudyMinutes) * 60 * 1000);

    await StudySession.create({
      userId: req.user._id,
      roomId: roomId || null,
      subject: subject || 'Focus Session',
      startTime,
      endTime: eventAt,
      duration: Math.max(0, safeStudyMinutes),
      active: false,
    });
  }

  await user.save();

  return ok(res, toUserPayload(user));
};

const deleteProfile = async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    Note.deleteMany({ userId }),
    Todo.deleteMany({ userId }),
    StudySession.deleteMany({ userId }),
    ActivityEvent.deleteMany({ userId }),
    StudyRoom.updateMany(
      { 'participants.userId': userId },
      {
        $pull: { participants: { userId } },
      }
    ),
    User.findByIdAndDelete(userId),
  ]);

  return ok(res, { success: true });
};

const leaderboard = async (req, res) => {
  const sortBy = req.query.sortBy === 'time' ? 'time' : 'points';
  const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);

  const sort = sortBy === 'time' ? { totalStudyMinutes: -1 } : { points: -1 };

  const users = await User.find(
    {},
    { displayName: 1, photoURL: 1, points: 1, totalStudyMinutes: 1, sessionsCount: 1, focusStreak: 1, bestFocusStreak: 1 }
  )
    .sort(sort)
    .limit(limit);

  const result = users.map((user, index) => ({
    _id: user._id,
    rank: index + 1,
    displayName: user.displayName,
    photoURL: user.photoURL,
    points: user.points,
    totalStudyMinutes: user.totalStudyMinutes,
    sessionsCount: user.sessionsCount,
    focusStreak: user.focusStreak || 0,
    bestFocusStreak: user.bestFocusStreak || 0,
  }));

  return ok(res, result);
};

module.exports = { profile, updateProfile, grantPoints, deleteProfile, leaderboard };
