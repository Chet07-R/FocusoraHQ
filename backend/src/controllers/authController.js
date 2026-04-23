const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { createToken } = require('../utils/createToken');
const { ok, fail } = require('../utils/apiResponse');
const { env } = require('../config/env');
const { sendVerificationEmail } = require('../utils/mailer');

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const normalizeUrl = (value) => String(value || '').trim().replace(/\/$/, '');

const isLocalhostUrl = (value) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizeUrl(value));

const resolveClientUrl = (req) => {
  const configuredUrl = normalizeUrl(env.clientUrl);
  const requestOrigin = normalizeUrl(req.get('origin'));

  if (requestOrigin) {
    return requestOrigin;
  }

  if (configuredUrl && (env.nodeEnv === 'production' || isLocalhostUrl(configuredUrl))) {
    return configuredUrl;
  }

  return 'http://localhost:5173';
};

const createVerificationToken = async (user) => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationTokenHash = hashToken(rawToken);
  user.emailVerificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await user.save();
  return rawToken;
};

const sendVerificationForUser = async (user, req) => {
  const token = await createVerificationToken(user);
  const verifyUrl = `${resolveClientUrl(req)}/verify-email?token=${encodeURIComponent(token)}`;
  return sendVerificationEmail({ to: user.email, name: user.displayName, verifyUrl });
};

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
    focusStreak: user.focusStreak || 0,
    bestFocusStreak: user.bestFocusStreak || 0,
    lastFocusDate: user.lastFocusDate || null,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
    emailVerified: user.isEmailVerified,
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
    isEmailVerified: false,
  });

  const verificationEmailResult = await sendVerificationForUser(user, req);

  return ok(res, {
    ...toAuthPayload(user),
    verificationEmailSent: Boolean(verificationEmailResult?.sent),
    verificationEmailRequired: true,
  }, 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) {
    return fail(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  if (!user.isEmailVerified) {
    return fail(res, 403, 'EMAIL_NOT_VERIFIED', 'Please verify your email before signing in');
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

  const redirectUrl = `${resolveClientUrl(req)}/signin?token=${encodeURIComponent(token)}`;
  return res.redirect(redirectUrl);
};

const googleFailure = async (req, res) => {
  return fail(res, 401, 'GOOGLE_AUTH_FAILED', 'Google authentication failed');
};

const verifyEmail = async (req, res) => {
  const token = String(req.query.token || req.body.token || '').trim();

  if (!token) {
    return fail(res, 400, 'INVALID_VERIFICATION_TOKEN', 'Verification token is required');
  }

  const tokenHash = hashToken(token);
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationTokenExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return fail(res, 400, 'INVALID_VERIFICATION_TOKEN', 'Verification link is invalid or expired');
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationTokenExpiresAt = null;
  await user.save();

  return res.redirect(`${resolveClientUrl(req)}/signin?verified=1`);
};

const resendVerificationEmail = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!email) {
    return fail(res, 400, 'EMAIL_REQUIRED', 'Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return ok(res, { success: true });
  }

  if (user.isEmailVerified) {
    return ok(res, { success: true, alreadyVerified: true });
  }

  const verificationEmailResult = await sendVerificationForUser(user, req);
  return ok(res, {
    success: true,
    verificationEmailSent: Boolean(verificationEmailResult?.sent),
  });
};

const guestLogin = async (req, res) => {
  const suffix = crypto.randomBytes(4).toString('hex');
  const displayName = `Guest-${suffix.slice(0, 4)}`;
  const email = `guest_${suffix}@focusorahq.local`;

  const user = await User.create({
    displayName,
    email,
    provider: 'guest',
    isEmailVerified: false,
  });

  const token = createToken(user._id);
  return ok(res, { ...toAuthPayload(user), token }, 201);
};

module.exports = {
  register,
  login,
  me,
  googleSuccess,
  googleFailure,
  verifyEmail,
  resendVerificationEmail,
  guestLogin,
};
