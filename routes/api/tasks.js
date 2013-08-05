var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule');
var Task = mongoose.model('Task');


/**
 * Lists tasks within a time boundary.
 */
exports.index = function(req, res) {
  // TODO(healthio-dev): Permissions.
  Schedule.find({carePlanId: req.params.care_plan_id},
      function(error, schedules) {
    if (error) { return res.json(false); }
    res.json({schedules: schedules});
  });
};



/**
 * Updates a specific task.
 */
exports.update = function(req, res) {
  // TODO(healthio-dev): Permissions.
  Schedule.findById(req.params.id, function(error, schedule) {
    if (error) { return res.json(false); }
    schedule.end = req.params.end;
    schedule.frequency = req.params.frequency;
    req.start = req.params.start;
    req.save(function(error) {
      if (error) { return res.json({error: error}); }
      res.json({schedule: schedule});
    });
  });
};
