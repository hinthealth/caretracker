var generateHexKey = function(length){
  length = length;
  return (new Array(length + 1)).join('n').replace(/n/g, function(){
    return Math.floor(Math.random()*16).toString(16);
  });
};

exports.generateInviteKey = function(){
  return generateHexKey(12);
};

exports.generateDirectKey = function(){
  return generateHexKey(6);
}
