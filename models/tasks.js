var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;


var TaskSchema = new Schema({
  carePlan: ObjectId,
  comment: String,
  completedAt: Number,
  completedBy: ObjectId,
  start: Number
});
mongoose.model('Task', TaskSchema);
