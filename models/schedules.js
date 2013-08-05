var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , Task = mongoose.model('Task')
  , ObjectId  = Schema.Types.ObjectId;

var ScheduleSchema = new Schema({
  carePlanId: ObjectId,
  end: Number,
  frequency: Number,  // Frequency in seconds.
  start: Number
});


/**
 * Returns a set of tasks generated from a schedule, given a time range.
 * @param {number} startBoundary Start time.
 * @param {number} endBoundary End time.
 * @param {function(<Array.Task>)} callback Callback for found tasks.
 */
ScheduleSchema.methods.findTasks =
    function(startBoundary, endBoundary, callback) {
  if (startBoundary > endBoundary) {
    throw 'startBoundary must be less than endBoundary.';
  }
  // TODO(healthio-dev): Raise an error here due to bad data.
  if (!this.frequency) {
    return [];
  }

  // Map start times to generated tasks.
  var startTimesToTasks = {};
  var start = startBoundary;
  while (start < endBoundary) {
    startTimesToTasks[start] = new Task({
      carePlanId: this.carePlanId,
      start: start
    });
    start += this.frequency;
  }

  // Clobber map with persistent tasks.
  Task.where('carePlanId').equals(this.carePlanId)
      .where('start').gte(startBoundary)
      .where('end').lte(endBoundary)
      .exec(function(err, foundTasks) {
    if (err) { throw err; }
    foundTasks.forEach(function(task) {
      startTimesToTasks[task.start] = task;
    });

    // Convert the task mapping to an array sorted by start time.
    // TODO(healthio-dev): Sort this.
    var tasks = [];
    for (startTime in startTimesToTasks) {
      tasks.push(startTimesToTasks[startTime]);
    }
    callback(tasks);
  });
};

mongoose.model('Schedule', ScheduleSchema);
