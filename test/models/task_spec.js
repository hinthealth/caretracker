var helper = require('./../test_helper');
var mongoose = require('mongoose');
var should = require('should');
var moment = require('moment');

var Task = mongoose.model('Task');
var Schedule = mongoose.model('Schedule');
var User = mongoose.model('User');
var clearModels = [Task, Schedule, User];

describe('Task', function(){
  describe('toggleCompleted', function(){
    context('for an uncompleted task', function(){
      beforeEach(function(){
        this.user = new User({'name.full': 'Greg Gregorson', email: 'greg@example.com'});
        this.task = new Task();
      });
      it("should set userId, name, and at", function(){
        this.task.toggleCompleted(this.user);
        this.task.completed.name.should.equal('Greg Gregorson');
        should.exist(this.task.completed.at);
        this.task.completed.userId.toString().should.equal(this.user.id);
      });
      it("should persist the changes on save", function(done){
        var self = this;
        this.task.toggleCompleted(this.user);
        this.task.save(function(err){
          Task.findById(self.task.id, function(err, dbTask){
            dbTask.completed.name.should.equal('Greg Gregorson');
            done();
          });
        });
      });
    });
  });
});