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

## Contributing code
0. Create a new branch for your code ```git checkout master && git pull && git checkout -b 'feature/my_feature_name'```
1. Write a new feature test in ./test/acceptance, or write a test for a bug in ./test/models or ./test/routes
2. Run the test with ```npm test``` (or ```make test```)
3. See it fail
4. Code till it passes
5. Push your code up (```git push origin feature/my_feature_name```), then login to github and create a pull request.

## Deploying to production
### *TBD*


## Database setup 
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
