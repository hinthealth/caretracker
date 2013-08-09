exports.env = process.env.NODE_ENV || 'development';
exports.hostname = process.env.HOSTNAME || 'localhost';

if(exports.env == 'production'){
  exports.scheme = 'https';
}

if(exports.env == 'development' || exports.env == 'test'){
  exports.scheme = '';
  exports.hostname = 'localhost';
  exports.port = 3000;
}

var schemeSuffix = exports.scheme ? '://' : '';

var portPrefix = exports.port ? ':' : '';

exports.hostWithPort = exports.hostname + portPrefix + exports.port
exports.url = exports.scheme + schemeSuffix + exports.hostWithPort
