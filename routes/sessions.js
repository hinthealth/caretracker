var passport  = require('passport');
var analytics = require('./../middlewares/analytics');


exports.create = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      analytics.track({
        userId     : req.user.id,
        event      : 'Signed In',
        properties : {
          sendEmail: false
        },
        context: {
          userAgent: req.headers['user-agent'],
          ip: req.ip
        }
      });

      if(req.session.returnTo){
        res.redirect(req.session.returnTo);
        req.session.returnTo = null;
      } else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
};

exports.new = function(req, res) {
  res.render('login', {
    user: req.user,
    messages: {error: req.flash('error'), info: req.flash('info')}
  });
};

exports.destroy = function(req, res) {
  req.logout();
  res.redirect('/');
};
