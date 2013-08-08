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
ScheduleSchema.methods.tasksBetween = function(startBoundary, endBoundary, callback) {
  // Don't schedule events outside of schedule boundary, regardless of range.
  if (startBoundary > endBoundary) {
    return callback(Error('startBoundary must be less than endBoundary.'))
  }


  var startTimesToTasks = {};
  this.generateTasksBetween(startBoundary, endBoundary).forEach(function(task){
    startTimesToTasks[task.start] = task;
  });

  this.existingTasksBetween(startBoundary, endBoundary, function(err, foundTasks){
    if (err) { return callback(err); }
    foundTasks.forEach(function(task) {
      startTimesToTasks[task.start] = task;
    });

    callback(null,
      Object.keys(startTimesToTasks).sort(function(a,b){
        return a-b;
      }).map(function(startTime){
        return startTimesToTasks[startTime];
      })
    );
  });
};
ScheduleSchema.methods.existingTasksBetween = function(start, end, callback){
  // Clobber map with persistent tasks.
  Task.where('scheduleId').equals(this.id)
      .where('start').gt(start).lte(end)
      .exec(callback);
};

ScheduleSchema.methods.generateTasksBetween = function(startBoundary, endBoundary){
  if(this.start) startBoundary = Math.max(startBoundary, this.start);
  if(this.end)   endBoundary   = Math.min(endBoundary, this.end);

  var tasks = [];
  if(this.frequency){
    // Use maths to figure out where our timing should start within this period
    var periodsSinceStart = (startBoundary - this.start) / (this.frequency * 1000);
    var start = Math.ceil(periodsSinceStart) * this.frequency * 1000 + this.start
    while (start < endBoundary) {
      tasks.push(
        new Task({
          name: this.name,
          scheduleId: this.id,
          start: start
        })
      );
      start += this.frequency * 1000; // It's all milliseconds
    }
  }else if(this.start >= startBoundary && this.start < endBoundary){
    // A frequency of 0 (or any false value) indicates a 1 time task
    tasks.push(
      new Task({
        name: this.name,
        carePlanId: this.carePlanId,
        start: this.start
      })
    );
  }
  return tasks;
};

/**
 * Returns a task for the time given
 * @param {number} startTime The start time of the task
 */
ScheduleSchema.methods.taskFor = function(startTime, next){
  var self = this;
  if(startTime < this.start){
    return next(Error("Task cannot start before the schedule ("+startTime+" must be greater than "+ this.start+")"));
  }
  if(this.end && startTime > this.end){
    return next(Error("Task cannot end after the schedule"));
  }
  if(this.frequency && ((this.start - startTime) % this.frequency != 0)){
    return next(Error("Task start time invalid for schedule"));
  }

  // First look it up
  Task.where('scheduleId').equals(this.id)
  .where('start').equals(startTime).findOne(function(error, task){
    if(error) return next(error);
    // Return if we find it.
    if(task) return next(null, task);
    // Otherwise generate a new one.
    next(null,
      new Task({
        name: self.name,
        scheduleId: self.id,
        start: startTime
      })
    );
  });
};

mongoose.model('Schedule', ScheduleSchema);
