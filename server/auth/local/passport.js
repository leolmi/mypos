var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Map, config) {
  passport.use(new LocalStrategy({
      usernameField: 'name',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(name, password, done) {
      Map.findOne({
        name: name
      }, function(err, map) {
        if (err) return done(err);

        if (!map) {
          return done(null, false, { message: 'This map is not registered.' });
        }
        if (!map.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, map);
      });
    }
  ));
};
