var AppConfig = require('../config/app');
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
  return generateHexKey(6) + '@' + AppConfig.directHostname;
};

exports.generateDirectAddress = generateDirectAddress;
exports.generateInviteKey = generateInviteKey;