var mongoose = require('mongoose')
  , HealthRecord = mongoose.model('HealthRecord')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

// User schema
var UserSchema = new Schema({
  name: { first: String, last: String},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  carePlanId: { type: ObjectId }
});

UserSchema.virtual('name.full')
.get(function () {
  return [this.name.first, this.name.last].filter(function(i){return i;}).join(' ');
}).set(function (setFullNameTo) {
  var split = setFullNameTo.split(' ')
    , firstName = split[0]
    , lastName = split.slice(1,split.length).join(' ');

  this.set('name.first', firstName);
  this.set('name.last', lastName);
});

UserSchema.virtual('password').set(function(newPassword){
  // Bcrypt middleware
  var salt = Bcrypt.genSaltSync(SALT_WORK_FACTOR)
    , hash = Bcrypt.hashSync(newPassword, salt);
  this.passwordHash = hash;

  this._password = newPassword;
  this.markModified('password');

}).get(function(){
  return this._password;
});

UserSchema.virtual('passwordConfirmation').set(function(newPasswordConfirmation){
  this._password_confirmation = newPasswordConfirmation;
  this.markModified('passwordConfirmation');
}).get(function(){
  return this._password_confirmation;
});

// var Validator = require('validator').Validator
//   , val = new Validator()
//   , check = val.check;
var validations = {
  user: [
    function(){
      if(this.isNew && !this.password){
        this.invalidate('password', 'required');
      }
      if(this.isModified('password')){
        if(this.password.length < 6){
          this.invalidate('password', 'must be at least 6 characters.');
        }
        if(this.isModified('passwordConfirmation') && this.password !== this.passwordConfirmation){
          this.invalidate('passwordConfirmation', 'must be the same');
        }
      }
    }
  ]
};

UserSchema.path('passwordHash').validate(validations.user[0], null);

var matches_confirmation = [function(value){
    if(this.isModified('passwordConfirmation')){
      return value != this.get('passwordConfirmation');
    }
  }, "Passwords do not match"];

// Password verification
UserSchema.methods.comparePassword = function(candidatePassword, done) {
  Bcrypt.compare(candidatePassword, this.passwordHash, function(err, isMatch) {
    if(err) return done(err);
    done(null, isMatch);
  });
};

mongoose.model('User', UserSchema);
