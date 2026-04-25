const fs = require('fs/promises');
const { validationResult } = require('express-validator');
const { fail } = require('../utils/apiResponse');

const validate = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return fail(res, 400, 'VALIDATION_ERROR', 'Invalid request payload', errors.array());
  }

  return next();
};

module.exports = { validate };
