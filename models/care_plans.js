var mongoose      = require('mongoose')
  , CareProvider  = mongoose.model('CareProvider')
  , HealthRecord  = mongoose.model('HealthRecord')
  , Schedule      = mongoose.model('Schedule')
  , Schema        = mongoose.Schema
  , ObjectId      = Schema.Types.ObjectId
  , async         = require('async')
  , Util          = require('./../lib/util');


var PatientSchema = new Schema({
    name: {type: String, required: true},
    userId: ObjectId,
    email: {type: String},
    inviteKey: {type: String, default: Util.generateInviteKey}
}, {_id: false, id: false});

var Patient = mongoose.model('Patient', PatientSchema);
/**
 * CarePlans represent the shared set of tasks/events associated
 * with a patients care.
 */
var CarePlanSchema = new Schema({
  directAddress: {
    type: String,
    required: true,
    default: Util.generateDirectAddress
  },
  ownerId: {type: ObjectId, required: true},
  patient: Patient.schema.tree, // Can't use schema unless in an array...
  careProviders: [CareProvider.schema]
});


// Instance methods cannot be defined on the nested schema tree...
CarePlanSchema.virtual('patient.invitePath').get(function(){
  return '/join-plan/' + this.patient.inviteKey;
});

CarePlanSchema.methods.invitePatientUrl = function(url){
  return (url || '') + this.patient.invitePath;
};


CarePlanSchema.methods.hasAccessIds = function(){
  var withAccess = {};
  withAccess[this.ownerId] = true
  if(this.patient && this.patient.userId){
    withAccess[this.patient.userId] = true;
  }
  this.careProviders.forEach(function(careProvider){
    if(careProvider.userId){
      withAccess[careProvider.userId] = true;
    };
  });
  return Object.keys(withAccess)
}

CarePlanSchema.static('ownedBy', function(user){
  return this.where({ownerId: user.id});
});


CarePlanSchema.static('for', function(user){
  return this.findOne({id: user.carePlanId });
});

// TODO: Convert to patient.userId
CarePlanSchema.static('accessibleTo', function(user){
  return this.where().or([
    {ownerId: user.id},
    {_id: user.carePlanId},
    {careProviders: {$elemMatch: {userId: user.id}}}
  ])
});


/**
 * Returns a set of tasks generated from all of a care plan's schedules.
 * @param {number} startBoundary Start time.
 * @param {number} endBoundary End time.
 */
CarePlanSchema.methods.findTasks =
    function(startBoundary, endBoundary, callback) {
  // TODO(healthio-dev): Sort results.
  Schedule.where('carePlanId').equals(this.id)
      .where('start').or([null, {$lte: endBoundary}])
      .where('end').or([null, {$gte: startBoundary}])
      .exec(function(err, foundSchedules) {
    if (err) { return callback(err); }
    // No schedules found, return immediately.
    if (!foundSchedules.length) { return callback(null, []); }

    async.reduce(foundSchedules, [], function(tasks, schedule, reduceBack){
      schedule.tasksBetween(startBoundary, endBoundary, function(error, foundTasks) {
        if(error){ return callback(error); }
        reduceBack(null, tasks.concat(foundTasks));
      })
    }, function(err, result){
      callback(null, result)
    });
  });
};

CarePlanSchema.methods.healthRecord = function(done){
  HealthRecord.findOne({direct_address: this.directAddress})
    .sort('-created').exec(done);
};

mongoose.model('CarePlan', CarePlanSchema);
