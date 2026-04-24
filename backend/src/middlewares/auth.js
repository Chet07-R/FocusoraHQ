const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { fail } = require('../utils/apiResponse');

const resolveBearerToken = (authHeader = '') => {
  if (!String(authHeader).startsWith('Bearer ')) {
    return '';
  }

  return String(authHeader).slice(7);
};

const authGuard = async (req, res, next) => {
  const token = resolveBearerToken(req.headers.authorization || '');

  if (!token) {
    return fail(res, 401, 'UNAUTHORIZED', 'Missing bearer token');
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return fail(res, 401, 'UNAUTHORIZED', 'Invalid token user');
    }

    req.user = user;
    return next();
  } catch (error) {
    return fail(res, 401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
};

const optionalAuth = async (req, res, next) => {
  const token = resolveBearerToken(req.headers.authorization || '');

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Treat invalid/expired token as anonymous for community submissions.
  }

  return next();
};

module.exports = { authGuard, optionalAuth };
