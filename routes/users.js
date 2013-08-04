var User = require('mongoose').model('User')
  , analytics = require('./../middlewares/analytics');

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

exports.new = function(req, res) {
  res.render('signup', {
    message: req.session.messages,
    user: new User()
  });
};

exports.create = function (req, res, next) {
  var user = new User(
    { name: req.body.name
    , email: req.body.email
    , password: req.body.password
    , passwordConfirmation: req.body.passwordConfirmation
  });
  user.save(function(error){
    if(error){
      if(error.code == 11000){
        var message = "You already have an account";
      }else{
        var message = error.message;
      }
      return res.render('signup', {user: user, message: message});
    }
    req.login(user, function(error){
      if(error) return next(error);
      // Identify user when they create an account
      analytics.identify(user);
      // TODO: Redirect to initial route
      if(req.session.returnTo){
        res.redirect(req.session.returnTo);
        req.session.returnTo = null;
      } else {
        return res.redirect('/');
      }
    });
  });
};
