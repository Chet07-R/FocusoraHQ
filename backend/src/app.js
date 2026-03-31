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

app.use(
  cors({
    origin: [env.clientUrl, 'http://localhost:5173'],
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
