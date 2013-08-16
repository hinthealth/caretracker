var mongoose      = require('mongoose')
  , CareProvider  = mongoose.model('CareProvider')
  , HealthRecord  = mongoose.model('HealthRecord')
  , Medication    = mongoose.model('Medication')
  , Schedule      = mongoose.model('Schedule')
  , Schema        = mongoose.Schema
  , ObjectId      = Schema.Types.ObjectId
  , async         = require('async')
  , AppConfig     = require('../config/app')
  , Util          = require('./../lib/util');


var PatientSchema = new Schema({
    name: {type: String, required: true},
    userId: {type: ObjectId, unique: true, sparse: true},
    email: {type: String},
    inviteKey: {type: String, default: Util.generateInviteKey}
}, {_id: false, id: false});

var Patient = mongoose.model('Patient', PatientSchema);
/**
 * CarePlans represent the shared set of tasks/events associated
 * with a patients care.
 */
var CarePlanSchema = new Schema({
  directKey: {
    type: String,
    required: true,
    default: Util.generateDirectKey
  },
  directAddress: String, // For historical reasons.
  ownerId: {type: ObjectId, required: true},
  patient: Patient.schema.tree, // Can't use schema unless in an array...
  careProviders: [CareProvider.schema]
});

// Send virtuals to angular
CarePlanSchema.set('toJSON', { virtuals: true });

// Instance methods cannot be defined on the nested schema tree...
CarePlanSchema.virtual('getDirectAddress').get(function(){
  return this.get('directKey') + '@' + AppConfig.directHostname;
});

CarePlanSchema.virtual('patient.name.first')
.get(function () {
  if (this.get('patient.name')){
    return this.get('patient.name').split(' ')[0];
  }
});

// Instance methods cannot be defined on the nested schema tree...
CarePlanSchema.virtual('patient.invitePath').get(function(){
  return '/join-plan/' + this.patient.inviteKey;
});


CarePlanSchema.static('ownedBy', function(user){
  return this.where({ownerId: user.id});
});


CarePlanSchema.static('for', function(user){
  return this.findOne({"patient.userId": user.id });
});

// TODO: Convert to patient.userId
CarePlanSchema.static('accessibleTo', function(user){
  return this.where().or([
    {ownerId: user.id},
    {"patient.userId": user.id },
    {careProviders: {$elemMatch: {userId: user.id}}}
  ]);
  // TODO: Query returns dupes, but setting .distinct breaks the world.
  // Need to investigate
  //.distinct('_id');
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
      callback(null, result.sort(function(a,b){ return a.start - b.start; }));
    });
  });
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

CarePlanSchema.methods.healthRecord = function(done){
  HealthRecord.findOne({direct_address: this.directAddress})
    .sort('-created').exec(done);
};

CarePlanSchema.methods.import = function(healthRecord, callback){
  // Use async if we need to import more than just medications;
  var self = this;
  var medicationsData = healthRecord.get('data.medications');
  if(medicationsData){
    Medication.importToPlan(this, medicationsData,
      function(error, medications){
        callback(error, {medications: medications});
    });

  }else{
    callback(null, {medications: []});
  }
};

CarePlanSchema.methods.invitePatientUrl = function(url){
  return (url || '') + this.patient.invitePath;
};

CarePlanSchema.methods.setPatient = function(user){
  this.patient.name       = user.name.full;
  this.patient.email      = user.email;
  this.patient.userId     = user.id;
  this.patient.inviteKey  = null;
};

var CarePlan = mongoose.model('CarePlan', CarePlanSchema);

// INLINE MIGRATIONS FTW!
CarePlan.find( { directAddress: {$exists : true }, directKey : { $exists : false } } )
        .exec(function(error, results){
          results.forEach(function(plan){
            plan.directKey = plan.directAddress.replace(/@.*$/,'');
            plan.directAddress = null;
            plan.save(function(error){
              if(error) return console.log("Failed to save", plan, error);
              console.log("Direct Key updated for",plan.id);
            });
          });
});
