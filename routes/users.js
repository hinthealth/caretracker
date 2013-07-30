var User = require('./../models').users;

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

exports.new = function(req, res) {
  res.render('signup', { user: req.user, message: req.session.messages });
};

exports.create = function (req, res, next) {
  User.create(
    { username: req.body.username
    , email: req.body.email
    , password: req.body.password
    , password_confirmation: req.body.password_confirmation
  }, function(error, user){
    if(err) return res.render('signup', {user: user, message: error.message});
    req.login(user, function(err){
      if(err) return next(err);
      // TODO: Redirect to initial route
      res.redirect('/');
    });
  });
};