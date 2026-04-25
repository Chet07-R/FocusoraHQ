const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const apiRoutes = require('./routes');
const { env } = require('./config/env');
const { configurePassport } = require('./config/passport');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { assignRequestContext } = require('./middlewares/requestContext');
const { authRateLimit, apiRateLimitExceptAuth } = require('./middlewares/rateLimit');

configurePassport();

const app = express();

app.set('trust proxy', 1);

morgan.token('request-id', (req) => req.requestId || '-');

const logFormat = env.nodeEnv === 'production'
  ? '{"time":":date[iso]","request_id":":request-id","method":":method","url":":url","status"::status,"response_ms"::response-time,"remote_addr":":remote-addr"}'
  : ':method :url :status :response-time ms - reqId=:request-id';

const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const privateNetworkOriginPattern = /^https?:\/\/(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i;
const configuredOrigins = new Set(
  String(env.clientUrl || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const allowPrivateDevOrigin = env.nodeEnv !== 'production' && privateNetworkOriginPattern.test(origin);

      if (configuredOrigins.has(origin) || localhostOriginPattern.test(origin) || allowPrivateDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: false,
  })
);
app.use(assignRequestContext);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(morgan(logFormat));
app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.status(200).send('FocusoraHQ backend running');
});

app.use('/api/auth', authRateLimit);
app.use('/api', apiRateLimitExceptAuth, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
