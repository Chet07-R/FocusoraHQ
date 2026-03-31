const { body } = require('express-validator');

const registerValidator = [
  body('displayName').trim().isLength({ min: 2, max: 60 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6, max: 100 }),
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6, max: 100 }),
];

module.exports = { registerValidator, loginValidator };
