var passport = require('passport');

exports.create = passport.authenticate('local',
      { successRedirect: '/' , failureRedirect: '/login', failureFlash: 'Invalid username or password.' });

exports.new = function(req, res){
  res.render('login', { user: req.user, messages: req.flash('error') });
};
exports.destroy = function(req, res){
  req.logout();
  res.redirect('/');
};

