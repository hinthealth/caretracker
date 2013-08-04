var Invitation = require('mongoose').model('Invitation');

exports.new = function(req, res){
  res.render('invite', invite: new Invitation());
}
exports.create = function(req, res, next) {
  var attributes = req.body;
  var invite = new Invitation({
    name: attributes.name,
    email: attributes.email,
    careplanId: req.params.careplanId
  });
  invite.save(function(error){
    if(error) return next(error);
    res.render('invited', invite: invite);
  });
  req.body
};