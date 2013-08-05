var mongoose  = require('mongoose')
  , UserAction  = mongoose.model('UserAction')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.Types.ObjectId;


/* Comment
 * Supports rendering:
 * "Don't forget to take your medicine!" - 5 minutes ago by Mom
 * without doing additional queries or having to limit user json
 * that would get returned by populating a user object in the response
*/
var CommentSchema = new Schema({
  created: UserAction.schema.tree,
  content: String
});

var Comment = mongoose.model('Comment', CommentSchema);

/* Task
 * Stores actions taken by a user in their plan
*/

var TaskSchema = new Schema({
  start: Number, // Primary key: start + scheduleId
  scheduleId: ObjectId,
  name: String,
  completed: UserAction.schema.tree,
  comments: [Comment.schema]
});
mongoose.model('Task', TaskSchema);
