var mongoose  = require('mongoose')
  , async     = require('async')
  , Schema    = mongoose.Schema
  , Schedule  = mongoose.model('Schedule')
  , ObjectId  = Schema.Types.ObjectId;

/**
 * Medications
 * These are the medications associated with a care plan (e.g. patient)
 * They are updated from data from a CCDA
 * If current, they create schedules that add new tasks to the careplan.
 */

var MedicationSchema = new Schema({
  carePlanId: ObjectId,
  dose: {
    value: String, // "2"
    unit: String   // "puffs"
  },
  end: Date,
  product: {
    name: String,
    code: String,
    code_system: String
  },
  rate: {
    value: String, // "90"
    unit: String   // "ml/min"
  },
  schedule: {
    scheduleType: String,
    period: {
      value: String,
      unit: String
    }
  },
  start: Date
});

/**
 * Given a Medication object, finds a matching/duplicate Medication object
 * @param {medication} medication Medication that we're looking to match
 */
MedicationSchema.static('findMatching', function(carePlan, medication, callback){
  this.findOne({carePlanId: carePlan.id, 'product.code': medication.product.code}).exec(callback);
});

/**
 * Given a Medication object, finds a matching/duplicate Medication object
 * @param {medication} medication Medication that we're looking to match
 */
MedicationSchema.static('importToPlan', function(carePlan, medicationsData, done){
  var self = this;
  async.map(medicationsData, function(medication, callback){
    var attributes = self.parseData(medication);
    self.findMatching(carePlan, attributes, function(error, found){
      var medication;
      if(error) return callback(error);
      if(found){
        medication = found;
      }else{
        medication = new self({carePlanId: carePlan.id});
      }
      medication.set(attributes);
      medication.save(function(error){
        if(error) return callback(error);
        medication.updateSchedule(function(error, result){
          callback(error, medication);
        })
      });
    });
  }, done);
});


/**
 * Generates a new Medication based on a BB.js medication object
 * @param {bb_medication} medication BB.js medication object
 */
MedicationSchema.static('parseData', function(medication){
  return {
    end:    medication.date_range.end,
    start:  medication.date_range.start,
    dose: {
      unit: medication.dose_quantity.unit,
      value: medication.dose_quantity.value
    },
    product: {
      name: medication.product.name,
      code: medication.product.code,
      code_system: medication.product.code_system
    },
    rate:{
      unit: medication.rate_quantity.unit,
      value: medication.rate_quantity.value
    },
    schedule: {
      scheduleType: medication.schedule.type,
      period: {
        unit: medication.schedule.period && medication.schedule.period.unit,
        value: medication.schedule.period && medication.schedule.period.value
      }
    }
  };
});

MedicationSchema.methods.updateSchedule = function(callback){
  var self = this;
  Schedule.findOne({medicationId: this.id}).exec(function(error, schedule){
    if(error) return callback(error);
    if(!schedule){
      schedule = new Schedule({medicationId: self.id});
    }
    schedule.set(Schedule.attributesFromMedication(self));
    schedule.save(function(error){
      callback(error, schedule);
    });
  });
};

mongoose.model('Medication', MedicationSchema);
