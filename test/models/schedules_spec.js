var helper = require('./../test_helper');
var mongoose = require('mongoose');
var should = require('should');

var CarePlan = mongoose.model('CarePlan');
var Schedule = mongoose.model('Schedule');
var User = mongoose.model('User');


describe('Schedule', function() {
  after(function(done) {
    done();
  });

  beforeEach(function(done) {
    this.carePlan = new CarePlan({ownerId: new User().id});
    this.carePlan.save(done);
  });

  describe('validation', function() {
    it('should save', function(done) {
      var schedule = new Schedule({
        carePlan: this.carePlan.id,
        frequency: 86400000,  // Once per day.
        start: new Date('2013-01-01').getTime()
      });
      schedule.save(function(err) {
        should.not.exist(err);
        done();
      })
    });
  });

  describe('#findTasks', function() {
    beforeEach(function() {
      this.schedule = new Schedule({
        carePlan: this.carePlan.id,
        frequency: 86400000,  // Once per day.
        start: new Date('2013-01-01').getTime()
      });
      this.frequentSchedule = new Schedule({
        carePlan: this.carePlan.id,
        frequency: 43200000,  // Twice per day.
        start: new Date('2013-01-01').getTime()
      });
    });

    it('should return one tasks within one day', function(done) {
      var startBoundary = new Date('2013-02-01').getTime();
      var endBoundary = new Date('2013-02-02').getTime();
      this.schedule.findTasks(startBoundary, endBoundary, function(tasks) {
        tasks.length.should.equal(1);
        // TODO(healthio-dev): Avoid multiple dones.
        // done();
      });
      this.frequentSchedule.findTasks(startBoundary, endBoundary,
          function(tasks) {
        tasks.length.should.equal(2);
        done();
      });
    });

    it('should return two tasks between two days', function(done) {
      var startBoundary = new Date('2013-02-01').getTime();
      var endBoundary = new Date('2013-02-03').getTime();
      this.schedule.findTasks(startBoundary, endBoundary, function(tasks) {
        tasks.length.should.equal(2);
        // TODO(healthio-dev): Avoid multiple dones.
        // done();
      });
      this.frequentSchedule.findTasks(startBoundary, endBoundary,
          function(tasks) {
        tasks.length.should.equal(4);
        done();
      });
    });
  });
});
