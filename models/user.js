var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
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

// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// Export user model
module.exports = mongoose.model('User', UserSchema);
