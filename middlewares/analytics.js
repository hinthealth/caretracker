
var analytics = require('analytics-node');

analytics.init({
  secret: process.env.SEGMENT_IO_SECRET || 'vxd6e6zsh5e6oc82j9ab',
  flushAt : 1
});

exports.track = analytics.track;
exports.identify = function (user){
  analytics.identify({
    userId: user.id,
    traits: {
      name:   user.name.full,
      email:  user.email
    }
  });
};

