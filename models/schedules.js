var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , Task = mongoose.model('Task')
  , ObjectId  = Schema.Types.ObjectId;

var ScheduleSchema = new Schema({
  carePlanId: ObjectId,
  name: {type: String, required: true},
  start: {type: Number, required: true}, // <-- Date is a valid database type?
  end: Number,
  frequency: {type: Number, default: 0}  // Frequency in seconds.
});


/**
 * Returns a set of tasks generated from a schedule, given a time range.
 * @param {number} startBoundary Start time.
 * @param {number} endBoundary End time.
 * @param {function(<Array.Task>)} callback Callback for found tasks.
 */
ScheduleSchema.methods.tasksBetween =
    function(startBoundary, endBoundary, callback) {
  if (startBoundary > endBoundary) {
    return callback(Error('startBoundary must be less than endBoundary.'))
  }

  // Map start times to generated tasks.
  var startTimesToTasks = {};

  if(this.frequency){
    // Use maths to figure out where our timing should start within this period
    var periodsSinceStart = (startBoundary - this.start) / this.frequency
    var start = Math.ceil(periodsSinceStart) * this.frequency + this.start
    while (start < endBoundary) {
      startTimesToTasks[start] = new Task({
        name: this.name,
        carePlanId: this.carePlanId,
        start: start
      });
      start += this.frequency * 1000; // It's all milliseconds
    }
  }else if(this.start >= startBoundary && this.start < endBoundary){
    // A frequency of 0 (or any false value) indicates a 1 time task
    startTimesToTasks[this.start] = new Task({
      name: this.name,
      carePlanId: this.carePlanId,
      start: this.start
    });
  }

  // Clobber map with persistent tasks.
  Task.where('carePlanId').equals(this.carePlanId)
      .where('start').gt(startBoundary).lte(endBoundary)
      .exec(function(err, foundTasks) {
    if (err) { return callback(err); }
    foundTasks.forEach(function(task) {
      startTimesToTasks[task.start] = task;
    });
    // Convert the task mapping to an array sorted by start time.
    // TODO(healthio-dev): Sort this.
    var tasks = [];
    Object.keys(startTimesToTasks).sort(function(a,b){
      return a-b;
    }).forEach(function(startTime){
      tasks.push(startTimesToTasks[startTime]);
    })
    callback(null, tasks);
  });
};

mongoose.model('Schedule', ScheduleSchema);
