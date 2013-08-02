var models = require('./../../models')
  , CarePlan = models.care_plans
  , User = models.users
  , should = require('should');

describe("CarePlan", function(){
  beforeEach(function(done){
    CarePlan.remove({}, done);
  });
  beforeEach(function(){
    // TODO: Involve some kind of factory obj generation?
    this.carePlan = new CarePlan({ownerId: new User().id});
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
    describe("the careTeam", function(){
      beforeEach(function(done){
        this.user = new User();
        this.carePlan.careTeamIds = [this.user.id]
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
        this.user = new User({carePlanId: this.carePlan.id});
        this.user.save(function(err){
          self.carePlan.save(function(err){
            self.user.carePlanId.equals(self.carePlan.id).should.be_true;
            done();
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
