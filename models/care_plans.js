var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

var generateHexKey = function(length){
  length = length || 6;
  return (new Array(length + 1)).join('n').replace(/n/g, function(){
    return Math.floor(Math.random()*16).toString(16);
  });
};

var generateDirectAddress = function(){
  // TODO: Setup system-wide configuration that depend on NODE_ENV
  generateHexKey(6) + '@' + process.env.HOSTNAME || 'localhost:3000';
}
// CarePlan schema
var CarePlanSchema = new Schema({
  name: String, // Required, but overwritten by user account name
  photo: {}, // Overwritten by user account name
  userId: ObjectId, // Optional, overwrites name and photo
  directAddress: {type: String, required: true, default: generateDirectAddress }
});


module.exports = mongoose.model('CarePlan', CarePlanSchema);