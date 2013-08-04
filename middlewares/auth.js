var analytics = require('./analytics');
exports.requireUser = function (req, res, next) {
  if (req.isAuthenticated() && req.user){
    analytics.identify(req.user);
    console.log("Authenticated & Identified!");
    return next();
  }
  console.log("Rejected, need a user...");
  res.format({
    html: function(){
      req.flash('info', 'Please log in.');
      req.session.returnTo = req.url;
      res.redirect('/login');
    },
    json: function(){
      res.json({error: "Please log in"}, 401);
    }
  })


};
exports.requireAdmin = function(req, res, next) {
  if(req.isAuthenticated() && req.user && req.user.admin) return next();
  res.send(403);
};