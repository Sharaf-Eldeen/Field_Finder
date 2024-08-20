const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.js");

const clientID = process.env.googleClientID;
const clientSecret = process.env.googleClientSecret;

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "/google/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user;

        if (profile.emails && profile.emails.length > 0) {
          const email = profile.emails[0].value;

          user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
              existingUser.googleId = profile.id;
              await existingUser.save();
              return done(null, existingUser);
            } else {
              user = new User({
                username: profile.displayName,
                email: email,
                googleId: profile.id,
              });

              await user.save();
              return done(null, user);
            }
          }
        } else {
          return done(
            new Error("No email associated with this Google account"),
            null
          );
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
