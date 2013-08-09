var NODE_ENV = process.env.NODE_ENV || 'development';

// require('better-stack-traces').install();

// Set up analytics before the other libraries get included.
var flash = require('connect-flash');
var express = require('express');

// Initialize database and models.
var db = require('./models');
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
app.use(express.responseTime());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());


// use express.session before passport, so that passport session will work
app.use(express.cookieSession({
    secret: 'OF0rMlqo2kdRv0zYSqLabBPAeLtbKEQJ27G',
    cookie: { maxAge: 1000*60*60*2 } // Two hours
  }));

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

app.get('/public/js/lib/zxcvbn.js',function(req,res) {
  res.sendfile(path.join(__dirname,'node_modules','zxcvbn','zxcvbn.js'));
});
app.get('/public/js/lib/moment.js',function(req,res) {
  res.sendfile(path.join(__dirname,'node_modules','moment','min','moment.min.js'));
});

// Route!
app.use(app.router);

// set up our security to be enforced on all requests to secure paths
app.all('/account', middlewares.auth.requireUser);
app.all('/join-*', middlewares.auth.requireUser);

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


// Join as a patient
app.get('/join-plan/:id', routes.care_plan.addPatient);

// Accept care team invitation
app.get('/join-team/:id', routes.care_plan.addCarePrivider);

// Privacy & Terms
app.get('/privacy-policy', routes.privacyPolicy);

/**********
 * JSON API, primarily for angular to interact with.
 * Note: This is very formulaic, perhaps we could standardize or
 *       find a plugin that makes this less boilerplate.
 **/

// CarePlans.
app.get('/api/care_plans', api.care_plans.index);
app.get('/api/care_plans/:id', api.care_plans.show);
app.post('/api/care_plans', api.care_plans.create);
app.put('/api/care_plans/:id', api.care_plans.update);
app.post('/api/care_plans/self', api.care_plans.create_for_me);
app.delete('/api/care_plans/:id', api.care_plans.destroy);

// CarePlan Sharing (available to owner - and patient?)
app.get('/api/care_plans/:care_plan_id/care_providers', api.care_providers.index);
app.post('/api/care_plans/:care_plan_id/care_providers', api.care_providers.create);

// CarePlan schedules.
app.get('/api/care_plans/:care_plan_id/schedules', api.schedules.index);
app.get('/api/care_plans/:care_plan_id/schedules/:id', api.schedules.show);
app.post('/api/care_plans/:care_plan_id/schedules', api.schedules.create);
app.put('/api/care_plans/:care_plan_id/schedules/:id', api.schedules.update);
app.delete('/api/care_plans/:care_plan_id/schedules/:id', api.schedules.destroy);

// CarePlan tasks.
app.get('/api/care_plans/:care_plan_id/tasks', api.tasks.index);
app.get('/api/care_plans/:care_plan_id/schedules/:schedule_id/tasks/:taskStart', api.tasks.show);
app.put('/api/care_plans/:care_plan_id/schedules/:schedule_id/tasks/:taskStart', api.tasks.update);
app.put('/api/care_plans/:care_plan_id/schedules/:schedule_id/tasks/:taskStart/toggle', api.tasks.toggle);

// app.get('/api/care_plans/:care_plan_id/care_team/:id', api.care_team.show);
// app.delete('/api/care_plans/:care_plan_id/care_team/:id', api.care_team.destroy);

app.get('/api/care_plans/:care_plan_id/health_record', api.health_record.show)




// Any reqests that haven't matched so far are assumed to be for angular.
// Require a valid user then send them on to our angular app (routes.index).
app.get('*', middlewares.auth.requireUser);
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
