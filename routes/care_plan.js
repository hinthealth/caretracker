var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , CarePlan = mongoose.model('CarePlan')
  , CareProvider = mongoose.model('CareProvider');

exports.addCarePrivider = function(req, res, next){
  var key = req.params.id;
  var self = this;
  CarePlan.findOne({careProviders: {$elemMatch: {inviteKey: key}}}, function(error, carePlan){
    if(error) return next(error);
    var careProvider = carePlan.careProviders.filter(function(elem){
      return elem.inviteKey == key;
    })[0];
    careProvider.userId = req.user.id;
    careProvider.inviteKey = null;
    careProvider.email = req.user.email;
    careProvider.name = req.user.name.full;
    carePlan.save(function(error, result){
      if(error) return next(error);
      res.redirect('/care_plans/' + carePlan.id);
    });
  });
};
exports.addPatient = function(req, res, next){
  var key = req.params.id;
  var self = this;
  CarePlan.findOne({"patient.inviteKey": key}, function(error, carePlan){
    if(error) return next(error);
    if(!carePlan) return next(Error("This link has already been used"));
    // TODO: Check if the user already has a careplan
    carePlan.setPatient(req.user);
    carePlan.save(function(error, result){
      if(error) return next(error);
      res.redirect('/care_plans/' + carePlan.id);
    });
  });
};
