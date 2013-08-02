var models = require('./../../models')
  , CarePlan = models.care_plans;

describe("CarePlan", function(){
  beforeEach(function(done){
    CarePlan.remove({}, done);
  });
  beforeEach(function(){
    // TODO: Involve some kind of factory obj generation?
    this.carePlan = new CarePlan();
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
