const passport = require('passport');
const LocalStrategy = require('passport-local');
const validPassword = require('../lib/crypto').validPassword;

passport.use('local', new LocalStrategy({ usernameField: 'phone' }, (username, password, cb) => {
  const db = require('../../app');
  //console.log('local strategy');

  db.getUserPhone(username)
    .then((user) => {
      if (!user) return cb(null, false, { message: '!Phone' });

      const isValid = validPassword(password, user.passw, user.salt);

      if (isValid) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: '!Password' });
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

module.exports.passport = passport;