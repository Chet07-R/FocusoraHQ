const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { fail } = require('../utils/apiResponse');

const authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return fail(res, 401, 'UNAUTHORIZED', 'Missing bearer token');
  }

  const token = authHeader.slice(7);

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

module.exports = { authGuard };
