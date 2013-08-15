var helper      = require('./../test_helper') // Always require first, sets up test db
  , mongoose    = require('mongoose')
  , CarePlan    = mongoose.model('CarePlan')
  , Medication  = mongoose.model('Medication')
  , clearModels = [CarePlan, Medication]
  , should      = require('should');


describe("Medication", function(){
  var self = this;
  clearModels.forEach(function(model){
    self.beforeEach(function(done){
      model.remove({}, done);
    });
  });
  before(function(){
    this.medicationsData = helper.fixtures.medications();
    this.carePlan = new CarePlan();
  });

  describe(".importToPlan", function(){
    beforeEach(function(){
      this.medicationsImportData = this.medicationsData['170_314_b__2_inpt_discharge_summary_ced_type_xml'];
    });
    it("should create medications from the data", function(done){
      var self = this;
      Medication.importToPlan(this.carePlan, this.medicationsImportData, function(error, result){
        should.not.exist(error);
        result.length.should.equal(self.medicationsImportData.length);
        Medication.find({carePlanId: self.carePlan.id}, function(error, result){
          result.length.should.equal(self.medicationsImportData.length);
          done();
        });
      });
    });
    context("with a previous import", function(){
      beforeEach(function(done){
        Medication.importToPlan(this.carePlan, this.medicationsImportData, done);
      });
    })
    it("should not create duplicate medications if imported twice", function(done){
      var self = this;
      Medication.importToPlan(this.carePlan, this.medicationsImportData, function(error, result){
        should.not.exist(error);
        Medication.find({carePlanId: self.carePlan.id}, function(error, result){
          result.length.should.equal(self.medicationsImportData.length);
          done();
        });
      });
    });
  });

  describe("#set", function(){
    it("should set all the attributes", function(){
      var start = Date.now();
      var med = new Medication();
      med.set({
        end: null,
        start: start,
        product: {
          name: 'Benadryl',
          code: '1049908',
          code_system: "2.16.840.1.113883.6.88"
        },
        schedule: {
          scheduleType: 'Foobar',
          period: {unit: 'h', value: '6'}
        }
      });
      med.should.have.property('start');
      med.start.valueOf().should.equal(start.valueOf());

      // med.should.should.have.property('product');
      // med.product.should.have.property('name');
      med.product.name.should.equal('Benadryl');
      med.product.code_system.should.equal('2.16.840.1.113883.6.88');


      med.should.have.property('schedule');
      // med.schedule.should.have.property('period');
      // med.schedule.period.should.have.property('value');
      med.schedule.period.value.should.equal('6');
    });
  });

  describe(".parseData", function(){
    beforeEach(function(){
      this.medicationData = this.medicationsData['encounter_based_c_cda_ccd___08_06_2012__jones__isabella___170314e2__xml'][0];

      this.attributes = Medication.parseData(this.medicationData);
    });
    it("should return a hash that maps to a medications attributes", function(){
      should.not.exist(this.attributes.end);
      this.attributes.start.should.equal('2012-08-06T07:00:00.000Z');
      this.attributes.product.name.should.equal('CLARITHROMYCIN, 500MG (Oral Tablet)');
      this.attributes.product.code.should.equal('197517');
      this.attributes.product.code_system.should.equal('2.16.840.1.113883.6.88');
      this.attributes.dose.value.should.equal('1');
      this.attributes.dose.unit.should.equal('Tablet');
      this.attributes.schedule.scheduleType.should.equal('frequency');
      this.attributes.schedule.period.value.should.equal('12');
      this.attributes.schedule.period.unit.should.equal('h');
    });
  });

  describe(".findMatching", function(){
    beforeEach(function(done){
      var recordMedications = this.medicationsData['encounter_based_c_cda_ccd___08_06_2012__jones__isabella___170314e2__xml'];
      this.medicationAttributes = Medication.parseData(recordMedications[0]);

      // Create one medication so we actually have to match something
      var med = new Medication(Medication.parseData(this.medicationsData['170_314_b__1_inpt_discharge_summary_ced_type_xml'][0]));
      med.carePlanId = this.carePlan.id;
      med.save(done);
    });
    describe("for a new medication", function(done){
      it("should call the callback with a second argument of null", function(done){
        Medication.findMatching(this.carePlan, this.medicationAttributes, function(error, result){
          should.not.exist(result);
          done();
        });
      });
    });
    describe("a similar medication", function(){
      beforeEach(function(done){
        this.similarMedication = new Medication(this.medicationAttributes);
        this.similarMedication.carePlanId = this.carePlan.id;
        this.similarMedication.save(done);
      });
      it("should return that medication", function(done){
        var self = this;
        Medication.findMatching(this.carePlan, this.medicationAttributes, function(error, result){
          should.exist(result);
          result.id.should.equal(self.similarMedication.id);
          done();
        });
      });
    });
  });

});