var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

// User schema
// TODO: Camelize these
var EventSchema = new Schema({
  name: String,
  user_id: ObjectId,
  created_at: { type: Date, default: Date.now },
  completed_at: Date,
  completed_by: ObjectId
});

mongoose.model('Event', EventSchema);
