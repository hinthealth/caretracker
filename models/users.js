var mongoose = require('mongoose')
  , HealthRecord = mongoose.model('HealthRecord')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
  _id: ObjectId,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  admin: { type: Boolean, required: true }
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

var CCDA = require("./../lib/ccda_service");
UserSchema.methods.updateHealthRecords = function(){
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
  HealthRecord.findOne({direct_address: self.email}).sort('-created').exec(done);
};

UserSchema.methods.canAccess = function(){
  return [self.id];
};


// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
