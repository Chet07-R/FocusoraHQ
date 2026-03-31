const User = require('../models/User');
const StudySession = require('../models/StudySession');
const { ok, fail } = require('../utils/apiResponse');

const createSession = async (req, res) => {
  const session = await StudySession.create({
    userId: req.user._id,
    roomId: req.body.roomId || null,
    subject: req.body.subject || '',
    startTime: new Date(),
    active: true,
  });

  return ok(res, session, 201);
};

const endSession = async (req, res) => {
  const session = await StudySession.findOne({ _id: req.params.id, userId: req.user._id });

  if (!session) {
    return fail(res, 404, 'SESSION_NOT_FOUND', 'Session not found');
  }

  const duration = Math.max(Number(req.body.duration || 0), 0);
  const points = Math.floor(duration / 5);

  session.duration = duration;
  session.endTime = new Date();
  session.active = false;
  await session.save();

  await User.findByIdAndUpdate(req.user._id, {
    $inc: {
      totalStudyMinutes: duration,
      sessionsCount: 1,
      points,
    },
  });

  return ok(res, session);
};

const listSessions = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);

  const sessions = await StudySession.find({ userId: req.user._id })
    .sort({ startTime: -1 })
    .limit(limit);

  return ok(res, sessions);
};

module.exports = { createSession, endSession, listSessions };
