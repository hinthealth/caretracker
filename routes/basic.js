exports.index = function(req, res) {
  res.render('main', { user: req.user });
};
