var mongoose = require('mongoose')
  , HealthRecord = mongoose.model('HealthRecord')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

var generateKey = function(length){
  length = length || 6;
  // arr = [];
  // while(length--){
  //   arr[length] = Math.floor(Math.random() * 16).toString(16); }
  // };
  // return arr.join('');
  // or
  return (new Array(length + 1)).join('n').replace(/n/g, function(){
    return Math.floor(Math.random()*16).toString(16);
  });
};

var matches_confirmation = [function(value){
    if(this.isSelected('password_confirmation')){
      return value != this.get('password_confirmation');
    }
  }, "Passwords do not match"];
// User schema
var UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, validate: matches_confirmation},
  admin: { type: Boolean, required: true, default: false },
  directPrefix: {type: String, default: generateKey, unique: true}
});

UserSchema.virtual('password_confirmation').set(function(newPasswordConfirmation){
  this._password_confirmation = newPasswordConfirmation;
}).get(function(){
  return this._password_confirmation;
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

UserSchema.methods.directAddress = function(){
  return this.username + '@direct.gohint.com';
};

// TODO - Move this elsewhere?
var HealthStore = require("./../lib/ccda_service");
UserSchema.methods.updateHealthRecords = function(){
  var self = this;
  var directAddress = self.directAddress();
  if(!directAddress) return "No email";
  var store = new HealthStore({directAddress: directAddress});
  store.retrieveAll(function(error, attributes, ccdaXml){
    HealthRecord.findOne({direct_address: directAddress, key: attributes.key}).exec(function(error, found){
      var record = null;
      if(found){
        record = found;
        // Update health record attributes that could change
        record.created = attributes.created;
      } else {
        record = new HealthRecord(attributes);
      }
      record.data.xml = ccdaXml;
      record.save(function(error){
        if(error) return console.log("Error saving health record", error);
        console.log("Health Records updated for "+ directAddress);
      });
    });
  });
};

UserSchema.methods.healthRecord = function(done){
  HealthRecord.findOne({direct_address: this.directAddress()}).sort('-created').exec(done);
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
