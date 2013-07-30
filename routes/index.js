// Defines our authenticated, one page app
exports.index = function(req, res) {
  res.render('index', { user: req.user });
};
