const { fail } = require('../utils/apiResponse');

const notFoundHandler = (req, res) => {
  return fail(res, 404, 'NOT_FOUND', 'Route not found');
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'Something went wrong';
  return fail(res, status, code, message);
};

module.exports = { notFoundHandler, errorHandler };
