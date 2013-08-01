require("better-stack-traces").install();
process.env.NODE_ENV = 'test';
process.env.PORT = 7357;

exports.app = require('../../app').server;
exports.Browser = require('zombie');
