var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule');


/**
 * Lists schedules for a given care plan.
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
 * Shows a single schedule.
 */
exports.show = function(req, res) {
  // TODO(healthio-dev): Permissions.
  Schedule.findById(req.params.id, function(error, schedule) {
    if (error) { return res.json(false); }
    res.json({schedule: schedule});
  });
};


/**
 * Creates a new schedule.
 */
exports.create = function(req, res) {
  // TODO(healthio-dev): Permissions.
  var schedule = new Schedule({
    carePlanId: req.params.care_plan_id,
    end: req.params.end,
    frequency: req.params.frequency,
    start: req.params.start
  });
  schedule.save(function(error, schedule) {
    if (error) { return res.json(false); }
    res.json({schedule: schedule});
  });
};


/**
 * Updates an existing schedule.
 */
exports.update = function(req, res) {
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


/**
 * Destroys an existing schedule.
 */
exports.destroy = function(req, res) {
  // TODO(healthio-dev): Permissions.
  Schedule.findByIdAndRemove(req.params.id, function(error, schedule) {
    if (error) { return res.json(false); }
    res.json(true);
  });
};
