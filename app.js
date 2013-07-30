var env = process.env.NODE_ENV || 'development';

var express = require('express')
    , app = express()
    , db = require('./config/database')
    , pass = require('./config/pass')
    , passport = require('passport')
    , routes = require('./routes')
    , routes_user = require('./routes/user')
    , routes_basic = require('./routes/basic')
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
app.get('/', routes_basic.index);

// Login pages
app.get('/dmz/login', routes_user.getlogin);
app.post('/dmz/login', routes_user.postlogin);
app.get('/dmz/logout', routes_user.logout);

// Signup pages
app.get('/dmz/signup', routes_user.getsignup);
app.post('/dmz/signup', routes_user.signup);

// secure pages
app.get('/secure/account', routes_user.account);

//admin pages
app.get('/secure/admin', routes_user.admin);

// Events api for angular
app.get('/api/events', api.events);
app.get('/api/event/:event_id', api.event);
app.post('/api/events', api.eventAdd);
app.put('/api/event/:event_id', api.eventEdit);
app.delete('/api/event/:event_id', api.eventDelete);

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

