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
    beforeEach(function(){

    });
  })
});