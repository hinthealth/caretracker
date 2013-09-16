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
        console.log("ERROR SIGNING UP:", error);
        var message = error.message;
      }
      return res.render('signup', {user: user, message: message});
    }
    req.login(user, function(error){
      if(error) return next(error);
      // Identify user when they create an account
    //analytics.identify(user);
    //analytics.track({
    //  userId     : req.user.id,
    //  event      : 'Account Created',
    //  properties : {
    //    sendEmail: true
    //  },
    //  context: {
    //    userAgent: req.headers['user-agent'],
    //    ip: req.ip
    //  }
    //});

      // TODO: Redirect to initial route
      if(req.session.returnTo){
        var redirect = req.session.returnTo;
        req.session.returnTo = null;
        res.redirect(redirect);
      } else {
        return res.redirect('/care_plans?welcome');
      }
    });
  });
};
