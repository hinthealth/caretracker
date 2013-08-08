exports.env = process.env.NODE_ENV || 'development';
exports.passport = require('./passport');

if(exports.env == 'production'){
  exports.scheme = 'http';
  exports.hostname = 'caretracker-test.jit.su';
}else{ // Development
  exports.scheme = '';
  exports.hostname = 'localhost';
  exports.port = 3000;
}

var schemeSuffix = exports.scheme ? '://' : '';

var portPrefix = exports.port ? ':' : '';

exports.url = exports.scheme + schemeSuffix + exports.hostname + portPrefix + exports.port
