var helper = require('./../test_helper') // Always require first, sets up test db
  , mongoose = require('mongoose')
  , CarePlan = mongoose.model('CarePlan')
  , User = mongoose.model('User')
  , clearModels = [User, CarePlan]
  , should = require('should');

describe("CarePlan", function(){
  var self = this;
  clearModels.forEach(function(model){
    self.beforeEach(function(done){
      model.remove({}, done);
    });
  });

  beforeEach(function(){
    // TODO: Involve some kind of factory obj generation?
    this.carePlan = new CarePlan({ownerId: new User().id, patient: {name: 'That guy'}});
  });
  describe("validations", function(){
    it("default plan should be valid", function(done){
      this.carePlan.save(function(err){
        should.not.exist(err);
        done();
      })
    });
  });

  describe(".accessibleTo", function(){
    describe("the careProviders", function(){
      beforeEach(function(done){
        this.user = new User({name: "That guy", email: "that.guy@example.com"});
        var careProvider1 = {name: this.user.name, email: this.user.email, userId: this.user.id, relation: "brother"};
        var careProvider2 = {name: "Samual L Jackson", email: "sammyj@example.com", relation: "Awesome"};
        this.carePlan.careProviders = [careProvider1, careProvider2];
        this.carePlan.save(done);
      });
      it("should be accessible", function(done){
        var self = this;
        CarePlan.accessibleTo(self.user).exec(function(err, result){
          should.not.exist(err);
          result.map(function(o){return o.id}).should.include(self.carePlan.id);
          done();
        });
      });
    });
    describe("the owner", function(){
      beforeEach(function(done){
        this.user = new User();
        this.carePlan.ownerId = this.user.id;
        this.carePlan.save(done);
      });
      it("should be accessible", function(done){
        var self = this;
        CarePlan.accessibleTo(self.user).exec(function(err, result){
          should.not.exist(err);
          result.map(function(o){return o.id}).should.include(self.carePlan.id);
          done();
        });
      });
    });
    describe("the patient", function(){
      beforeEach(function(done){
        var self = this;
        this.user = new User({'name.full': 'Good guy greg', email: 'greg@example.com'});
        this.carePlan.setPatient(this.user);
        this.carePlan.patient.userId.toString().should.equal(this.user.id.toString());
        this.carePlan.save(function(err){
          CarePlan.for(self.user).exec(function(err, plan){
            plan.id.should.equal(self.carePlan.id);
            done()
          });
        });
      });
      it("should be accessible", function(done){
        var self = this;
        CarePlan.accessibleTo(self.user).exec(function(err, result){
          should.not.exist(err);
          result.map(function(o){return o.id}).should.include(self.carePlan.id);
          done();
        });
      });
    });
    describe("as part of a query", function(){
      beforeEach(function(done){
        this.user = new User();
        this.carePlan.ownerId = this.user.id;
        this.carePlan.save(done);
      });
      it("should be queryable by the id", function(done){
        var self = this;
        CarePlan.accessibleTo(this.user).find({_id: this.carePlan.id}).findOne(function(error, plan){
          should.not.exist(error);
          plan.id.should.equal(self.carePlan.id);
          done();
        });
      });
      it("should not match a different id", function(done){
        var self = this;
        CarePlan.accessibleTo(this.user).find({_id: new CarePlan().id}).findOne(function(error, plan){
          should.not.exist(error);
          should.not.exist(plan);
          done();
        });
      });
    });
  });
  describe("#directAddress", function(){
    it("should exist for new plans", function(){
      this.carePlan.should.have.property('directAddress');
    });
    it("should be a direct address", function(){
      this.carePlan.directAddress.should.match(/[0-9a-f]+@direct\..+/);
    });
    it("should be random", function(){
      this.carePlan.directAddress.should.not.equal((new CarePlan()).directAddress);
    });
    it("should be unique");
  })
  after(function(done){
    done();
    // models.mongoose.disconnect(done);
  });
});
