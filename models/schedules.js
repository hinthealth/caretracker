var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , Task = mongoose.model('Task')
  , ObjectId  = Schema.Types.ObjectId;

var ScheduleSchema = new Schema({
  care_plan: ObjectId,
  end: Number,
  frequency: Number,  // Frequency in seconds.
  start: Number
});


/**
 * Returns a set of tasks generated from a schedule, given a time range.
 * @param {number} startBoundary Start time.
 * @param {number} endBoundary End time.
 */
ScheduleSchema.methods.getTasks = function(startBoundary, endBoundary) {
  var start = startBoundary;
  var startTimesToTasks = {};

  // Map start times to generated tasks.
  while (start < endBoundary) {
    startTimesToTasks[start] = new Task({
      care_plan: this.care_plan,
      start: start
    });
    start += this.frequency;
  }

  // Clobber map with persistent tasks.
  var callback = function(err, foundTasks) {
    if (err) {
      throw err;
    }
    foundTasks.forEach(function(task) {
      startTimesToTasks[task.start] = task;
    });
  };
  Task.find()
      .where('care_plan', this.care_plan)
      .where('start').gte(startBoundary).lte(endBoundary)
      .exec(callback);

  // Convert the task mapping to an array sorted by start time.
  // TODO(healthio-dev): Sort this.
  var tasks = [];
  for (startTime in startTimesToTasks) {
    tasks.push(startTimesToTasks[startTime]);
  }
  return tasks;
};

mongoose.model('Schedule', ScheduleSchema);
