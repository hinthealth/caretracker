var mongoose      = require('mongoose')
  , CareProvider  = mongoose.model('CareProvider')
  , HealthRecord  = mongoose.model('HealthRecord')
  , Schedule      = mongoose.model('Schedule')
  , Schema        = mongoose.Schema
  , ObjectId      = Schema.Types.ObjectId
  , Util          = require('./../lib/util');


/**
 * CarePlans represent the shared set of tasks/events associated
 * with a patients care.
 */
var CarePlanSchema = new Schema({
  name: String, // Required, but overwritten by patient account name
  photo: {}, // Overwritten by patient account name
  directAddress: {
    type: String,
    required: true,
    default: Util.generateDirectAddress
  },
  ownerId: {type: ObjectId, required: true},
  careProviders: [CareProvider.schema]
});


CarePlanSchema.static('ownedBy', function(user){
  return this.where({ownerId: user.id});
});


CarePlanSchema.static('for', function(user){
  return this.findOne({id: user.carePlanId });
});


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
      .where('start').gte(startBoundary)
      .where('end').lte(endBoundary)
      .exec(function(err, foundSchedules) {
    if (err) { throw err; }
    // No schedules found, return immediately.
    if (!foundSchedules.length) { return callback([]); }
    var tasks = [];
    foundSchedules.forEach(function(schedule, i) {
      schedule.findTasks(startBoundary, endBoundary, function(foundTasks) {
        tasks = tasks.concat(foundTasks);
        // Invoke the callback at the last iteration of the loop.
        if (i == foundSchedules.length - 1) {
          callback(tasks);
        }
      });
    });
  });
};

CarePlanSchema.methods.healthRecord = function(done){
  HealthRecord.findOne({direct_address: this.directAddress}).sort('-created').exec(done);
};

mongoose.model('CarePlan', CarePlanSchema);
