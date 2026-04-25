const rateLimit = require('express-rate-limit');

const createRateLimitHandler = (message) => {
  return (req, res) => {
    const retryAfterSeconds = Math.max(1, Math.ceil((req.rateLimit?.resetTime - Date.now()) / 1000) || 1);

    return res.status(429).json({
      code: 'RATE_LIMITED',
      message,
      retryAfterSeconds,
      ...(res.locals.requestId ? { requestId: res.locals.requestId } : {}),
    });
  };
};

const sharedRateLimitOptions = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
};

const authRateLimit = rateLimit({
  ...sharedRateLimitOptions,
  windowMs: 15 * 60 * 1000,
  max: 30,
  handler: createRateLimitHandler('Too many authentication requests. Please try again shortly.'),
});

const apiRateLimit = rateLimit({
  ...sharedRateLimitOptions,
  windowMs: 15 * 60 * 1000,
  max: 400,
  handler: createRateLimitHandler('Too many API requests. Please slow down and retry.'),
});

const apiRateLimitExceptAuth = (req, res, next) => {
  if (req.path.startsWith('/auth')) {
    return next();
  }

  return apiRateLimit(req, res, next);
};

module.exports = {
  authRateLimit,
  apiRateLimitExceptAuth,
};