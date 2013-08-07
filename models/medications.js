var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

/**
 * Medications
 * This is the current set of medications a patient is taking
 * These
 */

var MedicationSchema = new Schema({
  scheduleId: ObjectId,
  name: {type: String, required: true},
  start: Date,
  end: Date,
  frequency: Number,
  product: {
    name: String,
    code: String
  }
});

mongoose.model('Medication', MedicationSchema);
