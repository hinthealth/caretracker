var env = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');

// Database connect
var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/caretracker-' + env;

var mongoOptions = { db: { safe: true }};

mongoose.connect(uristring, mongoOptions, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);
  }
});

// Require all the models!

require('./events');
require('./health_records');
require('./care_providers');
require('./care_plans');
require('./users');

module.exports = mongoose;