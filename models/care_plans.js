var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

var generateHexKey = function(length){
  length = length;
  return (new Array(length + 1)).join('n').replace(/n/g, function(){
    return Math.floor(Math.random()*16).toString(16);
  });
};

var generateInviteKey = function(){
  return generateHexKey(12);
};

var generateDirectAddress = function(){
  // TODO: Setup system-wide configuration that depend on NODE_ENV
  // Keys of length 6 provide 16777216 possibilities. This will need to be
  // expanded once we have over ~2k people (chance collisions > 1/10k),
  // or we need a way to lookup keys until we find a unique one.
  return generateHexKey(6) + '@direct.' + (process.env.HOSTNAME || 'localhost:3000');
};

/****************************************************
 * CareProvider
 *
 * The relationship between a caretracker user and a patients care plan.
 * All of the CareProviders on a CarePlan comprise a CareTeam. (too much care).
 * Care providers may be family, caregivers or physicians who want to be
 * kept in the loop on a patients daily care.
 * A CareProvider without a userId represents an invitation to join
 * a careteam.
 ****************************************************/

var CareProviderSchema = new Schema({
    userId: ObjectId,
    name: {type: String, required: true},
    relation: String,
    email: {type: String, required: true},
    inviteKey: {type: String, default: generateInviteKey}
});

CareProviderSchema.virtual('inviteUrl').get(function(hostname){
  return (hostname || '') + '/join-team/' + this.inviteKey;
});

var CareProvider = mongoose.model('CareProvider', CareProviderSchema);

/****************************************************
 * CarePlan
 *
 * Care plans represent the shared set of tasks/events associated
 * with a patients care,
 ****************************************************/
var CarePlanSchema = new Schema({
  name: String, // Required, but overwritten by patient account name
  photo: {}, // Overwritten by patient account name
  directAddress: {type: String, required: true, default: generateDirectAddress },
  ownerId: {type: ObjectId, required: true},
  careTeam: [CareProvider.schema]
});

CarePlanSchema.static('ownedBy', function(user){
  return this.where({ownerId: user.id});
});

CarePlanSchema.static('for', function(user){
  return this.findOne({id: user.carePlanId });
});

CarePlanSchema.static('accessibleTo', function(user){
  return this.where().or([{ownerId: user.id}, {_id: user.carePlanId }, {careTeam: {$elemMatch: {userId: user.id}}}])
});

module.exports = mongoose.model('CarePlan', CarePlanSchema);