const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const apiRoutes = require('./routes');
const { env } = require('./config/env');
const { configurePassport } = require('./config/passport');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

configurePassport();

const app = express();

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
app.use(helmet());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.status(200).send('FocusoraHQ backend running');
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
