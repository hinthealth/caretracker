exports.requireUser = function (req, res, next) {
  if (req.isAuthenticated() && req.user){
    console.log("Authenticated!");
    return next();
  }
  console.log("Rejected, need a user...");
  res.redirect('/login');
};
exports.requireAdmin = function(req, res, next) {
  if(req.isAuthenticated() && req.user && req.user.admin) return next();
  res.send(403);
};