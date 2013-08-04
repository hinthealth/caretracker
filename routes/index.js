exports.index = function(req, res) {
  if (req.user) {
    // We have a user, render the main app.
    res.render('main', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
};

exports.partials = function(req, res) {
  var modelName = req.params.model;
  var viewName = req.params.view;
  res.render('partials/' + modelName + '/' + viewName);
};

exports.care_team = require('./care_team');
exports.sessions = require('./sessions');
exports.users = require('./users');
