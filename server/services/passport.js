'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); // Section 4, Lecture 36

// put identifying information into cookie (with token)
passport.serializeUser((user, done) => {
  done(null, user.id); //mongo id, not profile.id!!!
});

// pull it back out for future
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      // we already have a record with the given profile ID
      if (existingUser) {
        return done(null, existingUser);
      }
      // we don't have a record
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
); // new instance of GoogleStrategy
