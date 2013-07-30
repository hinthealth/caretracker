exports.requireUser = function (req, res, next) {
  console.log("Running require user");
  if (req.isAuthenticated() && req.user){
    console.log("passed...");
    return next();
  }
  res.redirect('/login');
};
exports.requireAdmin = function(req, res, next) {
  if(req.isAuthenticated() && req.user && req.user.admin) return next();
  res.send(403);
};