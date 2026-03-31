const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const createToken = (userId) => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is missing. Add it in backend/.env');
  }

  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

module.exports = { createToken };
