var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');


// serialize & deserialize User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
    
  });
});

// local strategy
passport.use('local-login',
  new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({username:username}, function(err, user) {
        if(err) return res.json(err);  
        if(user.username == 'woojin'){
          passport.d = 1;
        }
        else {
          passport.d = user.Value; 
        }
       
      });
      User.findOne({username:username} ,passport.c = username)
        .select({password:1})
        .exec(function(err, user) {         
          if (err) return done(err);
          
          if (user && user.authenticate(password)){
            return done(null, user);
            
          }
          else {
            req.flash('username', username);
            req.flash('errors', {login:'The username or password is incorrect.'});
            return done(null, false);
          }
        });
    }
  )
);

module.exports = passport;
