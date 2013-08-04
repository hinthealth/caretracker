var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;


var TaskSchema = new Schema({
  care_plan: ObjectId,
  comment: String,
  completed_at: Number,
  completed_by: ObjectId,
  start: Number
});
mongoose.model('Task', TaskSchema);
