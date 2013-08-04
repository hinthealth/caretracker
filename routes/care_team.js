var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , CarePlan = mongoose.model('CarePlan')
  , CareProvider = mongoose.model('CareProvider');

exports.join = function(req, res, next){
  var key = req.params.id;
  CarePlan.findOne({careProviders: {$elemMatch: {inviteKey: key}}}, function(error, plan){
    var careProvider = plan.careProviders.filter(function(elem){ return elem.inviteKey == self.careProvider.inviteKey})[0];
    if(error) return next(error);
    careProvider.userId = req.user.id;
    careProvider.inviteKey = null;
    careProvider.email = req.user.email;
    careProvider.name = req.user.name.full;
    carePlan.save(function(error, result){
      if(error) return next(error);
      res.redirect('/care_plans/'+plan.id);
    });
  });
}