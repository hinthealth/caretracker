var mongoose      = require('mongoose')
  , CareProvider  = mongoose.model('CareProvider')
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
  Schedule.find()
      .where('carePlanId', this.carePlanId)
      .where('start').gte(startBoundary).lte(endBoundary)
      .exec(function(err, foundSchedules) {
    // TODO(healthio-dev): Sort.
    var tasks = [];
    foundSchedules = foundSchedules || [];
    foundSchedules.forEach(function(schedule) {
      tasks.concat(schedule.findTasks(startBoundary, endBoundary));
    });
    callback(tasks);
  });
};


mongoose.model('CarePlan', CarePlanSchema);
