var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.Types.ObjectId;
/* User Action
 * For tagging a user responsible for an action in another object
 * with enough information to not have to query that user to display it
 * WARNING: Do not define validations here, they may not run when embedded.
 */
var UserActionSchema = new Schema({
  at: { type: Date },
  userId: ObjectId,
  name: String
}, { _id: false, id: false });

mongoose.model('UserAction', UserActionSchema);
