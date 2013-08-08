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

exports.care_plan = require('./care_plan');
exports.sessions = require('./sessions');
exports.users = require('./users');
