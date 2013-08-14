var mongoose = require('mongoose')
  , HealthRecord  = mongoose.model('HealthRecord')
  , Medication    = mongoose.model('Medication')
  , CarePlan      = mongoose.model('CarePlan');

exports.show = function(req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).
    find({_id: req.params.care_plan_id}).
    findOne(function(error, carePlan){
    if(error) return next(error);
    process.nextTick(function(){
      // Kick off update in background, then return whatever we had
      HealthRecord.updatePlan(carePlan);
    });
    carePlan.healthRecord(function(error, healthRecord){
      if(error) return next(error);
      Medication.find({carePlanId: carePlan.id}).exec(function(error, medications){
        if(error) return next(error);
        res.json({carePlan: carePlan, healthRecord: healthRecord, medications: medications});
      });
    });
  });
};

