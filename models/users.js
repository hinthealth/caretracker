var mongoose = require('mongoose')
  , HealthRecord = mongoose.model('HealthRecord')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;


var matches_confirmation = [function(value){
    if(this.isSelected('password_confirmation')){
      return value != this.get('password_confirmation');
    }
  }, "Passwords do not match"];
// User schema
var UserSchema = new Schema({
  _id: ObjectId,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: matches_confirmation},
  admin: { type: Boolean, required: true }
});

UserSchema.virtual('password_confirmation').set(function(newPasswordConfirmation){
  this._password_confirmation = newPasswordConfirmation;
}).get(function(){
  this._password_confirmation;
});


// Bcrypt middleware
UserSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);
    Bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// TODO - Move this elsewhere?
var CCDA = require("./../lib/ccda_service");
UserSchema.methods.updateHealthRecords = function(){
  // TODO - Registration email != the direct address
  var self = this;
  if(!self.email) return "No email";
  var service = CCDA.Service(CCDA.server_url, self.email);
  service.retrieveAll(function(error, attributes, xml){
    var record = HealthRecord.findOne({direct_address: self.email, key: attributes.key}).exec(function(error, found){
      if(record){
        record.created = attributes.created;
      } else {
        record = new HealthRecord(attributes);
      }
      record.save(function(error){
        if(error) console.log("Error saving health record", error);
      });
    });
  });
};

UserSchema.methods.healthRecord = function(done){
  HealthRecord.findOne({direct_address: this.email}).sort('-created').exec(done);
};

UserSchema.methods.canAccess = function(){
  return [this.id];
};


// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, done) {
  Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return done(err);
    done(null, isMatch);
  });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
