var mongoose = require('mongoose')
  , CarePlan = mongoose.model('CarePlan')
  , User = mongoose.model('User');

// GET care_plans/
exports.index = function (req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).findOne(function(error, carePlan){
    if(error) return res.json(false);
    res.json({carePlan: carePlan, careTeam: carePlan.careTeam});
  });
};

exports.create = function (req, res) {
  var newCareTeam = {
    name: req.body.name,
    relation: req.body.relation,
    email: req.body.email
  }
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).update({$push: {careTeam: newCareTeam}}, function(error, carePlan){
    if(error) return res.json(false);
    // Create a care team member, send email, etc.
    res.json({carePlan: carePlan, careTeam: carePlan.careTeam});
  });
};