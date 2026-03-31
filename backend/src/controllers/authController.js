const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken } = require('../utils/createToken');
const { ok, fail } = require('../utils/apiResponse');
const { env } = require('../config/env');

const toAuthPayload = (user) => {
  return {
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
  };
};

const register = async (req, res) => {
  const { displayName, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return fail(res, 409, 'EMAIL_TAKEN', 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    displayName,
    email: email.toLowerCase(),
    passwordHash,
    provider: 'local',
    isEmailVerified: true,
  });

  const token = createToken(user._id);
  return ok(res, { ...toAuthPayload(user), token }, 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = createToken(user._id);
  return ok(res, { ...toAuthPayload(user), token });
};

const me = async (req, res) => {
  return ok(res, toAuthPayload(req.user));
};

const googleSuccess = async (req, res) => {
  const user = req.user;
  const token = createToken(user._id);

  const redirectUrl = `${env.clientUrl}/signin?token=${encodeURIComponent(token)}`;
  return res.redirect(redirectUrl);
};

const googleFailure = async (req, res) => {
  return fail(res, 401, 'GOOGLE_AUTH_FAILED', 'Google authentication failed');
};

module.exports = { register, login, me, googleSuccess, googleFailure };
