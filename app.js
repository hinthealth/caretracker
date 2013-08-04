const NODE_ENV = process.env.NODE_ENV || 'development';

// Set up analytics before the other libraries get included.
var flash = require('connect-flash');
var express = require('express');

// Initialize database and models.
var models = require('./models');
var passport = require('./config/passport');
var routes = require('./routes');
var lessMiddleware = require('less-middleware');
var middlewares = require('./middlewares');
var path = require('path');
var api = require('./routes/api');

// Express app.
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

// use express.session before passport, so that passport session will work
app.use(express.session({ secret: 'OF0rMlqo2kdRv0zYSqLabBPAeLtbKEQJ27G' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// Allow flash messages
app.use(flash());

// Prefer static assets to routed paths

app.use('/public', lessMiddleware({
    src: path.join(__dirname, '/public'),
    compress: true
}));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/zxcvbn', express.static('node_modules/zxcvbn'));

// Route!
app.use(app.router);


// set up our security to be enforced on all requests to secure paths
app.all('/account', middlewares.auth.requireUser);
app.all('/api/*', middlewares.auth.requireUser);

// Pages for angular
app.get('/partials/:model/:view', routes.partials);

// Login pages
app.get('/login', routes.sessions.new);
app.post('/login', routes.sessions.create);
app.get('/logout', routes.sessions.destroy);

// Signup pages
app.get('/signup', routes.users.new);
app.post('/signup', routes.users.create);
app.get('/account', routes.users.account);

// Accept care team invitation
app.get('/join-team/:id', routes.care_team.join)

/**********
 * JSON API, primarily for angular to interact with.
 * Note: This is very formulaic, perhaps we could standardize or
 *       find a plugin that makes this less boilerplate.
 **/

// Events
app.get('/api/events', api.events.index);
app.get('/api/events/:id', api.events.show);
app.post('/api/events', api.events.create);
app.put('/api/events/:id', api.events.update);
app.delete('/api/events/:id', api.events.destroy);

// CarePlans
app.get('/api/care_plans', api.care_plans.index);
app.get('/api/care_plans/:id', api.care_plans.show);
app.post('/api/care_plans', api.care_plans.create);
app.put('/api/care_plans/:id', api.care_plans.update);
app.delete('/api/care_plans/:id', api.care_plans.destroy);

// CarePlan Sharing (available to owner - and patient?)
app.get('/api/care_plans/:care_plan_id/care_team', api.care_team.index);
app.post('/api/care_plans/:care_plan_id/care_team', api.care_team.create);

// app.get('/api/care_plans/:care_plan_id/care_team/:id', api.care_team.show);
// app.delete('/api/care_plans/:care_plan_id/care_team/:id', api.care_team.destroy);

// CarePlan Invitations (available to owner - and patient?)
// Include type=(patient|careteam) to specify the type of invitation. Default is careteam
// app.post('/api/care_plans/:care_plan_id/invitations', api.invitations.create);


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
