var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

// User schema
var InvitationSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  carePlanId: {type: ObjectId, required: true},
  forPatient: {type: Boolean, default: false}
});

module.exports = mongoose.model('Invitation', InvitationSchema);
