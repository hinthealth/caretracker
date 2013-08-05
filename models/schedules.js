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
  var start = startBoundary;
  var startTimesToTasks = {};

  // Map start times to generated tasks.
  while (start < endBoundary) {
    startTimesToTasks[start] = new Task({
      carePlanId: this.carePlanId,
      start: start
    });
    start += this.frequency;
  }

  // Clobber map with persistent tasks.
  Task.find()
      .where('carePlanId', this.carePlanId)
      .where('start').gte(startBoundary).lte(endBoundary)
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
