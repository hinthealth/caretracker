var mongoose = require('mongoose');
var CarePlan = mongoose.model('CarePlan');
var Schedule = mongoose.model('Schedule');
var Task = mongoose.model('Task');


/**
 * Lists tasks within a time boundary.
 */
exports.index = function(req, res) {
  // TODO(healthio-dev): Permissions.
  CarePlan.findById(req.params.care_plan_id, function(error, carePlan) {
    if (error) { return res.json(false); }
    carePlan.findTasks(req.query.start, req.query.end, function(tasks) {
      res.json({tasks: tasks});
    });
  });
};



/**
 * Updates a specific task.
 */
exports.update = function(req, res) {
  // TODO(healthio-dev): Permissions.
  // TODO(healthio-dev): Implement.
};
