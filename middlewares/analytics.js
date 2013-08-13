
var analytics = require('analytics-node');

analytics.init({
  secret: process.env.SEGMENT_IO_SECRET || '93gm91qlkh4vcvtvxknj',
  flushAt : 1
});

exports.track = analytics.track;
exports.identify = function (user){
  // See https://segment.io/docs/methods/identify
  analytics.identify({
    userId: user.id,
    traits: {
      name:         user.name.full,
      firstName:    user.name.first,
      lastName:     user.name.last,
      email:        user.email,
      created:      user.createdAt
    }
  });
};

