// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // From GCP
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // From GCP
      callbackURL: process.env.NODE_ENV === 'production' 
        ? 'https://apps-lightningleadsaz.onrender.com/callback' 
        : 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      // Your authentication logic here
      return done(null, profile);
    }
  )
);
