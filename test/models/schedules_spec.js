var helper = require('./../test_helper');
var mongoose = require('mongoose');
var should = require('should');
var moment = require('moment');

var CarePlan    = mongoose.model('CarePlan');
var Schedule    = mongoose.model('Schedule');
var Medication  = mongoose.model('Medication');
var User        = mongoose.model('User');
var clearModels = [CarePlan, Schedule, User];

describe('Schedule', function() {
  var self = this;
  clearModels.forEach(function(model){
    self.beforeEach(function(done){
      model.remove({}, done);
    });
  });

  beforeEach(function(done) {
    this.carePlan = new CarePlan({patient: {name: 'Joe'}, ownerId: new User().id});
    this.carePlan.save(done);
  });

  describe('validation', function() {
    it('should save', function(done) {
      var schedule = new Schedule({
        name: 'Now required',
        carePlanId: this.carePlan.id,
        frequency: 86400,  // Once per day.
        start: new Date('2013-01-01').getTime()
      });
      schedule.save(function(err) {
        should.not.exist(err);
        done();
      })
    });
  });

  describe('#taskFor', function(){
    beforeEach(function() {
      this.start = new Date().valueOf();
      this.frequency = 60 * 60 * 6;

      this.schedule = new Schedule({
        name: "Feed the cat",
        carePlanId: this.carePlan.id,
        frequency: this.frequency,  // Once per day.
        start: this.start,
      });
    });
    it("should return a task for the schedule start time", function(done){
      var self = this;
      this.schedule.taskFor(this.start, function(error, result){
        should.exist(result);
        result.start.should.equal(self.start);
        result.name.should.equal("Feed the cat");
        done();
      });
    });
    it("should return a tasks that have valid interval times", function(done){
      this.schedule.taskFor(this.start + this.frequency * 5, function(error, result){
        should.exist(result);
        done();
      });
    });
    it("should return an error for times before the start", function(done){
      this.schedule.taskFor(this.start - this.frequency, function(error, result){
        should.not.exist(result);
        should.exist(error);
        error.message.should.include("start before");
        done();
      });
    });
    it("should return an error for random times", function(done){
      this.schedule.taskFor(this.start + 50, function(error, result){
        should.not.exist(result);
        should.exist(error);
        error.message.should.include("start time invalid");
        done();
      });
    });
  });

  describe('#tasksBetween', function() {
    beforeEach(function() {
      this.oneDay = {
        start: new Date('2013-02-01').getTime(),
        end: new Date('2013-02-02').getTime()
      };
      this.twoDays = {
        start: new Date('2013-02-01').getTime(),
        end: new Date('2013-02-03').getTime()
      }
    });
    context("6 hour schedule", function(){
      beforeEach(function(){
        this.schedule = new Schedule({
          name: "Take pills",
          carePlanId: this.carePlan.id,
          frequency: 60 * 60 * 6, // Every 6 hours
          start: moment().startOf('day').add('hours', 8).valueOf()
        });
      });
      it("should start at 8am", function(done){
        var self = this;
        var start = moment().startOf('day').valueOf();
        var end   = moment().endOf('day').valueOf();
        this.schedule.tasksBetween(start, end, function(error, tasks){
          tasks.should.not.be.empty;
          tasks[0].start.should.equal(self.schedule.start);
          done();
        });
      })
    })
    context("once a day schedule", function(){
      beforeEach(function(){
        this.schedule = new Schedule({
          name: "go running",
          carePlanId: this.carePlan.id,
          frequency: 86400,  // Once per day.
          start: new Date('2013-01-01').getTime()
        });
      });
      it('should return 1 task in a day', function(done){
        this.schedule.tasksBetween(this.oneDay.start, this.oneDay.end,
            function(error, tasks) {
          tasks.length.should.equal(1);
          done();
        });
      });
      it('should return 2 task in 2 days', function(done){
        this.schedule.tasksBetween(this.twoDays.start, this.twoDays.end,
            function(error, tasks) {
          tasks.length.should.equal(2);
          done();
        });
      });
    });
    context("with a twice a day schedule", function(){
      beforeEach(function(){
        this.schedule = new Schedule({
          name: "Get involved with the community",
          carePlanId: this.carePlan.id,
          frequency: 43200,  // Twice per day.
          start: new Date('2013-01-01').getTime()
        });
      });
      it('should return two tasks within one day', function(done) {
        this.schedule.tasksBetween(this.oneDay.start, this.oneDay.end,
            function(error, tasks) {
          tasks.length.should.equal(2);
          done();
        });
      });
      it('should return four tasks between two days', function(done) {
        this.schedule.tasksBetween(this.twoDays.start, this.twoDays.end,
            function(error, tasks) {
          tasks.length.should.equal(4);
          done();
        });
      });
    });

  });
  describe(".attributesFromMedication", function(){
    before(function(){
      this.medication = new Medication({
        carePlanId: new CarePlan().id,
        start: new Date(2012, 8, 30),
        end: null,
        schedule: {
          period: {
            unit: 'h',
            value: '6'
          }
        },
        product: {
          name: 'Teamocil'
        },
        dose: {
          unit: 'Chewable pills',
          value: '2'
        }
      });
    });
    beforeEach(function(){
      // every 12 hours
      // CLARITHROMYCIN, 500MG (Oral Tablet)
      this.schedule = new Schedule(Schedule.attributesFromMedication(this.medication));
    });
    it("should have a frequency of every 6 hours", function(){
      this.schedule.frequency.should.equal(6 * 60 * 60);
    });
    it("should have a name of '2 Chewable pills of Teamocil'", function(){
      this.schedule.name.should.equal("2 Chewable pills of Teamocil");
    });
    it("should start at 1348988400000", function(){
      this.schedule.start.should.equal(1348988400000);
    });
    it("should have a careplan id", function(){
      should.exist(this.schedule.carePlanId);
      this.schedule.carePlanId.should.equal(this.medication.carePlanId);
    });
  });
});
