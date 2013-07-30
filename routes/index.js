// Defines our authenticated, one page app
exports.index = function(req, res) {
  if(req.user){
    // We have a user, render the main app
    res.render('main', { user: req.user });
  }else{
    // Need a user, render the login form
    res.render('index', { user: req.user });
  }
};
exports.users = require('./users');
exports.sessions = require('./sessions');