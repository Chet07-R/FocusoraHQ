const crypto = require('crypto');

const REQUEST_ID_HEADER = 'x-request-id';

const assignRequestContext = (req, res, next) => {
  const incomingRequestId = String(req.get(REQUEST_ID_HEADER) || '').trim();
  const requestId = incomingRequestId || crypto.randomUUID();

  req.requestId = requestId;
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  return next();
};

module.exports = { assignRequestContext };