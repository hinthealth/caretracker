require('better-stack-traces').install();

// MUST setup environment & port before instantiating DB or it clears out
// our dev database
process.env.NODE_ENV = 'test';
process.env.PORT = 7357;

require('../models');
