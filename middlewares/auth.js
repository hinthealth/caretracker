
var analytics = require('analytics-node');
function identify(user){
    analytics.identify({
        userId    : user.id,
        traits    : {
            name             : user.name.full,
            email            : user.email
        }
    });
}
exports.requireUser = function (req, res, next) {
  if (req.isAuthenticated() && req.user){
    identify(req.user);
    console.log("Authenticated & Identified!");
    return next();
  }
  console.log("Rejected, need a user...");
  res.redirect('/login');
};
exports.requireAdmin = function(req, res, next) {
  if(req.isAuthenticated() && req.user && req.user.admin) return next();
  res.send(403);
};