var mongoose = require('mongoose');
var CarePlan = mongoose.model('CarePlan');
var Schedule = mongoose.model('Schedule');
var Task = mongoose.model('Task');

/**
 * Lists tasks within a time boundary.
 */
exports.index = function(req, res) {
  var d = new Date();
  d.setHours(0); d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);

  var beginningOfToday = new Date(d);
  d.setHours(24);
  var endOfToday = new Date(d);

  var start = req.query.start || beginningOfToday.valueOf();
  var end = req.query.start || endOfToday.valueOf();
  // TODO(healthio-dev): Permissions.
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).findOne(function(error, carePlan) {
    // TODO(healthio-dev): Issue a 400 when start/end are not present.
    if (error) {
      return res.json({error: error.message}, 400);
    }
    carePlan.findTasks(parseInt(req.query.start), parseInt(req.query.end),
        function(error, tasks) {
      if(error){ return res.json({error: error.message}, 400); }
      res.json({tasks: tasks, carePlan: carePlan});
    });
  });
};

/**
 * Gets a specific task.
 */
exports.show = function(req, res, next) {
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).findOne(function(error, carePlan) {
    if(error || !carePlan) return next(error || Error("Access denied"));
    Schedule.findById(req.params.schedule_id)
      .find({carePlanId: req.params.care_plan_id})
      .exec(function(error, schedule){
      schedule.taskFor(req.params.taskStart, function(error, task){
        if(error) return next(error);
        res.json({task: task});
      })
    });
  });
};

/**
 * Updates a specific task.
 */
exports.update = function(req, res, next) {
  CarePlan.accessibleTo(req.user).find({_id: req.params.care_plan_id}).findOne(function(error, carePlan) {
    if(error || !carePlan) return next(error || Error("Access denied"));
    Schedule.findById(req.params.schedule_id)
      .find({carePlanId: req.params.care_plan_id})
      .exec(function(error, schedule){
      schedule.taskFor(req.params.taskStart, function(error, task){
        if(error) return next(error);
        if(req.body.completed) { task.markCompleted(req.user) };
        task.content = req.body.content;
        task.save(function(error){
          if(error) return next(error);
          res.json({task: task});
        });
      })
    });
  });
};
