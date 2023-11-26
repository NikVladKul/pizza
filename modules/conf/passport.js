const passport = require('passport');
const LocalStrategy = require('passport-local');
const validPassword = require('../lib/crypto').validPassword;

passport.use(new LocalStrategy((username, password, cb) => {
  const db = require('../../app');

  db.getUserName(username)
    .then((user) => {
      if (!user) { return cb(null, false); }
      const isValid = validPassword(password, user.passw, user.salt);

      if (isValid) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});