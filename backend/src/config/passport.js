const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { env } = require('./env');
const User = require('../models/User');

const isGoogleAuthConfigured = () => {
  return Boolean(env.googleClientId && env.googleClientSecret);
};

const configurePassport = () => {
  if (!isGoogleAuthConfigured()) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const photoURL = profile.photos?.[0]?.value || null;

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

          if (!user) {
            user = await User.create({
              displayName: profile.displayName || 'Google User',
              email,
              photoURL,
              provider: 'google',
              googleId: profile.id,
              isEmailVerified: true,
            });
          } else {
            user.provider = 'google';
            user.googleId = profile.id;
            if (photoURL) {
              user.photoURL = photoURL;
            }
            if (profile.displayName && !user.displayName) {
              user.displayName = profile.displayName;
            }
            user.isEmailVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

module.exports = { configurePassport, isGoogleAuthConfigured };
