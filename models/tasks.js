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
  note: String,
  completed: UserAction.schema.tree,
  comments: [Comment.schema]
});

TaskSchema.methods.toggleCompleted = function(user){
  if(this.completed.at){
    this.unmarkCompleted();
  }else{
    this.markCompleted(user);
  }
};
TaskSchema.methods.unmarkCompleted = function(){
  this.completed = {};
  this.markModified('completed.at');
  this.markModified('completed.userId');
  this.markModified('completed.name');
};
TaskSchema.methods.markCompleted = function(user){
  this.completed.at = new Date();
  this.completed.userId = user.id;
  this.completed.name = user.name.full;
  this.markModified('completed.at');
  this.markModified('completed.userId');
  this.markModified('completed.name');
};
mongoose.model('Task', TaskSchema);
