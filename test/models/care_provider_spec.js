var helper = require('./../test_helper') // Always require first, sets up test db
  , mongoose = require('mongoose')
  , CarePlan = mongoose.model('CarePlan')
  , CareProvider = mongoose.model('CareProvider')
  , clearModels = [CarePlan, CareProvider]
  , should = require('should');

describe("CareProvider", function(){
  var self = this;
  clearModels.forEach(function(model){
    self.beforeEach(function(done){
      model.remove({}, done);
    });
  });

  describe("#inviteKey", function(){
    beforeEach(function(done){
      this.careProvider = new CareProvider({email: 'joe@example.com', name: 'Joe Shmoe', relation: 'That guy'});
      var otherProvider = {email: 'other@example.com', name: 'Other one', relation: 'None'};
      this.carePlan = new CarePlan({name: 'e-Patient dave', careProviders: [this.careProvider.toObject(), otherProvider], ownerId: new CarePlan().id});
      this.carePlan.save(done);
    });
    it("should allow the careplan to be found", function(done){
      var key = this.careProvider.inviteKey;
      var self = this;
      CarePlan.findOne({careProviders: {$elemMatch: {inviteKey: key}}}, function(error, plan){
        plan.should.have.property('id');
        var careProvider = plan.careProviders.filter(function(elem){ return elem.inviteKey == self.careProvider.inviteKey})[0];
        careProvider.id.should.equal(self.careProvider.id);
        done();
      });
    });
  })
});