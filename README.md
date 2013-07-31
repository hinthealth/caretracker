# Caretracker!
Caretracker is the best way for care providers to collaborate on patient care, and
to manage the daily schedule of multiple patients.

## Application setup
1. Install NPM (follow instructions on their website)
2. clone this repository ```git clone git@github.com:healthio/caretracker.git```
3. Install the npm packages (npm install)
4. Run tests to make sure you're setup: ```npm test```
5. Run the server! ```npm start```
6. Visit your new server at localhost:3000

## Database setup
_This was part of the original setup, not sure if it still works_
#### You will need to install grunt to seed and drop the database.

http://gruntjs.com/

```
npm install -g grunt-cli
```

You will then be able to run

```
grunt --version
grunt --help
```

You can seed and drop the database with a grunt task by running the following commands from the root directory of the node app in terminal.

```
grunt dbseed
grunt dbdrop
```


## Contributing code
0. Create a new branch for your code ```git checkout master && git pull && git checkout -b 'feature/my_feature_name'```
1. Write a new feature test in ./test/acceptance, or write a test for a bug in ./test/models or ./test/routes
2. Run the test with ```npm test``` (or ```make test```)
3. See it fail
4. Code till it passes
5. Push your code up (```git push origin feature/my_feature_name```), then login to github and create a pull request.


## Architectural Overview
_TODO: Move this kind of general documentation to the github wiki_

### A few conventions
#### 1. Require an entire folder, utilizing that folders index.js
When requiring someting into app.js, simply require a folder and have the folder/index.js require anything nested within. This way we simplify the app.js and have some nice, built-in namespacing for our app. An example of this is how we include models:

```
// in ./models/index.js
...
exports.events = require('./events');
exports.health_records = require('./health_records');
exports.users = require('./users');

// in ./app.js
...
, models = require('./models')
// Then you can do something like
, User = models.users
```
#### 2. Application layout
Express has little or no opinion as to how you structure our application. They can be as structured or unstructred as you like, and I expect this will be a major point of discussion throughout the development of the app. I've tried to start us off on a decent enough footing and cobbled together some apparant best practices I've seen from blogs and example applications, with some definite influence from Rails. Here's the current layout:

* **./models** Where we set mongoose model definitions, and the index.js establishes the db connection
* **./routes** serves as a routing and application logic, and would be the "controller" in an MVC.
* **./views** contains the express views. Shared partials are prefixed with a "_". The view "main.ejs" is special, and contains our angular single page app.
* **./views/partials** is where our angular.js views live. These should generally *not* use ejs to interpolate values, and instead only be evaluated by Angular.js. They share the views directory to keep everything in one spot and allow potential reuse/sharing of partials.
* **./test** has unit and acceptance tests.
* **./public** everything in /public is served directly to the client if the path matches
* **./public/js** holds our angular app (app.js), and the lib folder holds our external js dependencies.

#### 3. What's angular.js, what's express?
Right now, authentication / authorization are handled directly from the express app.
Once logged in/authenticated, the express app renders views/main.ejs, which serves
the angular app.

## Deploying to production
### *TBD*


