exports.requireUser = function (req, res, next) {
  if (req.isAuthenticated() && req.user){
    return next();
  }
  res.redirect('/login');
};
exports.requireAdmin = function(req, res, next) {
  if(req.isAuthenticated() && req.user && req.user.admin) return next();
  res.send(403);
};