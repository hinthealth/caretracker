var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId
  , Util      = require('./../lib/util');

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
    inviteKey: {type: String, default: Util.generateInviteKey}
});

CareProviderSchema.virtual('inviteUrl').get(function(hostname){
  return (hostname || '') + '/join-team/' + this.inviteKey;
});

mongoose.model('CareProvider', CareProviderSchema);