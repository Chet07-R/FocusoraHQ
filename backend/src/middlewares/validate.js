const { validationResult } = require('express-validator');
const { fail } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid request payload', errors.array());
  }

  return next();
};

module.exports = { validate };
