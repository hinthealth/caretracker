exports.index = function(req, res) {
  res.render('main', {
    user: req.user
  });
};

exports.privacyPolicy = function(req, res) {
  res.render('privacy_policy', {
  });
};

exports.partials = function(req, res) {
  var modelName = req.params.model;
  var viewName = req.params.view;
  res.render('partials/' + modelName + '/' + viewName);
};

exports.care_team = require('./care_team');
exports.sessions = require('./sessions');
exports.users = require('./users');
