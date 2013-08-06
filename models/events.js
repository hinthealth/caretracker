var mongoose    = require('mongoose')
  , UserAction  = mongoose.model('UserAction')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.Types.ObjectId;


var EventSchema = new Schema({
  name: String,
  content: String,
  carePlan: ObjectId,
  created: UserAction.schema.tree
});

mongoose.model('Event', EventSchema);
