const User = require('../models/User');
const Note = require('../models/Note');
const Todo = require('../models/Todo');
const StudySession = require('../models/StudySession');
const StudyRoom = require('../models/StudyRoom');
const { ok } = require('../utils/apiResponse');

const profile = async (req, res) => {
  const user = req.user;
  return ok(res, {
    _id: user._id,
    uid: String(user._id),
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    points: user.points,
    totalStudyMinutes: user.totalStudyMinutes,
    sessionsCount: user.sessionsCount,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
  });
};

const updateProfile = async (req, res) => {
  const updates = {};

  if (typeof req.body.displayName === 'string') {
    updates.displayName = req.body.displayName.trim();
  }

  if (typeof req.body.photoURL === 'string') {
    updates.photoURL = req.body.photoURL;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  return ok(res, user);
};

const deleteProfile = async (req, res) => {
  const userId = req.user._id;

  await Promise.all([
    Note.deleteMany({ userId }),
    Todo.deleteMany({ userId }),
    StudySession.deleteMany({ userId }),
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

  const users = await User.find({}, { displayName: 1, photoURL: 1, points: 1, totalStudyMinutes: 1, sessionsCount: 1 })
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
  }));

  return ok(res, result);
};

module.exports = { profile, updateProfile, deleteProfile, leaderboard };
