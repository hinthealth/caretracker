exports.index = function(req, res) {
  res.render('index-ang', { user: req.user });
};
