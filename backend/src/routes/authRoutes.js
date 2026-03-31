const express = require('express');
const passport = require('passport');
const { asyncHandler } = require('../utils/asyncHandler');
const { validate } = require('../middlewares/validate');
const { authGuard } = require('../middlewares/auth');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const authController = require('../controllers/authController');
const { isGoogleAuthConfigured } = require('../config/passport');
const { fail } = require('../utils/apiResponse');

const router = express.Router();

router.post('/register', registerValidator, validate, asyncHandler(authController.register));
router.post('/login', loginValidator, validate, asyncHandler(authController.login));
router.get('/me', authGuard, asyncHandler(authController.me));

router.get('/google', (req, res, next) => {
  if (!isGoogleAuthConfigured()) {
    return fail(res, 503, 'GOOGLE_AUTH_DISABLED', 'Google OAuth is not configured');
  }

  return next();
}, passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isGoogleAuthConfigured()) {
      return fail(res, 503, 'GOOGLE_AUTH_DISABLED', 'Google OAuth is not configured');
    }

    return next();
  },
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failure' }),
  asyncHandler(authController.googleSuccess)
);

router.get('/google/failure', asyncHandler(authController.googleFailure));

module.exports = router;
