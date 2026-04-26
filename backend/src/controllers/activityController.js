const ActivityEvent = require('../models/ActivityEvent');
const { ok, fail } = require('../utils/apiResponse');

const normalizeString = (value, fallback) => {
  const text = String(value || '').trim();
  return text || fallback;
};

const createActivity = async (req, res) => {
  const type = normalizeString(req.body?.type, 'activity');
  const title = normalizeString(req.body?.title, 'New activity');
  const points = Math.max(0, Math.floor(Number(req.body?.points || 0) || 0));
  const minutes = Math.max(0, Math.floor(Number(req.body?.minutes || 0) || 0));
  const metadata = req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {};

  if (!type) {
    return fail(res, 400, 'INVALID_ACTIVITY_PAYLOAD', 'Activity type is required');
  }

  const activity = await ActivityEvent.create({
    userId: req.user._id,
    type,
    title,
    points,
    minutes,
    metadata,
  });

  return ok(res, activity, 201);
};

const listMyActivity = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);

  const activities = await ActivityEvent.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit);

  return ok(res, activities);
};

module.exports = { createActivity, listMyActivity };
