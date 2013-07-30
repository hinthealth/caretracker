var env = process.env.NODE_ENV || 'development';

var express = require('express')
    , app = express()
    // Initialize database & models
    , models = require('./models')
    , pass = require('./config/pass')
    , passport = require('passport')
    , routes = require('./routes')
    , api = require('./routes/api');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

// use express.session before passport, so that passport session will work
app.use(express.session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
// clearly denote public content
app.use('/', express.static('public'));
app.use('/zxcvbn', express.static('node_modules/zxcvbn'));

// set up our security to be enforced on all requests to secure paths
app.all('/secure', pass.ensureAuthenticated);
app.all('/secure/admin', pass.ensureAdmin);

// Basic pages
// app.get('/', routes.index);

// Login pages
app.get('/login', routes.sessions.new);
app.post('/login', routes.sessions.create);
app.get('/logout', routes.sessions.destroy);

// Signup pages
app.get('/signup', routes.users.new);
app.post('/signup', routes.users.create);
app.get('/secure/account', routes.users.account);
app.get('/secure/admin', routes.users.admin);

// Events api for angular
app.get('/api/events', api.events.index);
app.get('/api/event/:event_id', api.events.show);
app.post('/api/events', api.events.create);
app.put('/api/event/:event_id', api.events.update);
app.delete('/api/event/:event_id', api.events.destroy);

// Enables back button
app.get('*', routes.index);

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Express server listening on port '+ port);
});

