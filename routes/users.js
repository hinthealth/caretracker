var passport = require('passport')
  , pass = require("../config/pass");

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

exports.new = function(req, res) {
  res.render('signup', { user: req.user, message: req.session.messages });
};

exports.create = function (req, res) {
  var body = req.body;
  pass.createUser(
    body.username,
    body.email,
    body.password,
    body.password2,
    false,
    function (err, user) {
      if (err) return res.render('signup', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message});
      req.login(user, function (err) {
        if (err) return next(err);
        // successful login
        res.redirect('/');
      });
    });
};