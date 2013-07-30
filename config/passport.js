var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./../models')
  , User = db.users
// TODO: This library is arbitrary and sucks. Replace with something !obnoxious
  , zxcvbn = require("zxcvbn");

// Minimum password score based on scale from zxcvbn:
// [0,1,2,3,4] if crack time (in seconds) is less than
// [10**2, 10**4, 10**6, 10**8, Infinity].
// (useful for implementing a strength bar.)

const MIN_PASSWORD_SCORE = 0;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Helper function to create a new user
// TODO: Kill this
exports.createUser = function(username, emailaddress, password1, password2, adm, done) {
    // convert adm string to bool

    if (password1 !== password2) return done(new Error("Passwords must match"));
    console.log(typeof zxcvbn);
    var result = zxcvbn(password1);
    if (result.score < MIN_PASSWORD_SCORE) return done(new Error("Password is too simple"));
    var user = new User({ username: username
        , email: emailaddress
        , password: password1
        , admin: adm });

    user.save(function(err) {
        if(err) {
            done(err);
        } else {
            done(null, user);
        }
    });

};

module.exports = passport;