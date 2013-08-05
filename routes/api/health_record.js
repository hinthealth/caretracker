var mongoose = require('mongoose')
  , HealthRecord  = mongoose.model('HealthRecord')
  , CarePlan      = mongoose.model('CarePlan');

exports.show = function(req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).findOne(function(error, carePlan){
    if(error) return next(error);
    process.nextTick(function(){
      // Kick off update in background, then return whatever we had
      HealthRecord.updateDirectAddress(carePlan.directAddress);
    });
    carePlan.healthRecord(function(error, healthRecord){
      if(error) return next(error);
      console.log("got record:", healthRecord);
      res.json({carePlan: carePlan, healthRecord: healthRecord});
    });
  });
};

