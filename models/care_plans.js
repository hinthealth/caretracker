var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

var generateHexKey = function(length){
  length = length;
  return (new Array(length + 1)).join('n').replace(/n/g, function(){
    return Math.floor(Math.random()*16).toString(16);
  });
};

var generateDirectAddress = function(){
  // TODO: Setup system-wide configuration that depend on NODE_ENV
  // Keys of length 6 provide 16777216 possibilities. This will need to be
  // expanded once we have over ~2k people (chance collisions > 1/10k),
  // or we need a way to lookup keys until we find a unique one.
  return generateHexKey(6) + '@direct.' + (process.env.HOSTNAME || 'localhost:3000');
}
// CarePlan schema
var CarePlanSchema = new Schema({
  name: String, // Required, but overwritten by patient account name
  photo: {}, // Overwritten by patient account name
  directAddress: {type: String, required: true, default: generateDirectAddress },
  ownerId: {type: ObjectId, required: true},
  careTeamIds: [{type: ObjectId}]
});

CarePlanSchema.static('ownedBy', function(user){
  return this.where({ownerId: user.id});
});

CarePlanSchema.static('for', function(user){
  return this.findOne({id: user.carePlanId });
});

CarePlanSchema.static('accessibleTo', function(user){
  return this.where().or([{ownerId: user.id}, {_id: user.carePlanId }, {careTeamIds: user.id}])
});

module.exports = mongoose.model('CarePlan', CarePlanSchema);