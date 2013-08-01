require("better-stack-traces").install();
var models = require('./../../models')
  , User = models.users
  , helper = require('./test_helper');

process.env.NODE_ENV = 'test';
process.env.PORT = 7357;


describe("signing in", function(){
  beforeEach(function(done){
    // Extract into some kind of generic seeding
    User.remove({}, function(err, result){
      User.create({name: {full: "Mary Jane"}, email: 'mary@example.com', password: 'p4ssw0rd'}, done);
    });
  });

  before(function(){
    this.server =helper.app;
    this.browser = new helper.Browser({ site: 'http://localhost:7357' });
  });
  beforeEach(function(done){
    this.browser.visit('/login', done);
  });
  it("should email, password fields", function(){
    console.log('this browser',this.browser.success);
    this.browser.success.should.be.ok;
    this.browser.query('input[name="email"]').should.be.ok;
    this.browser.query('input[name="password"]').should.be.ok;
  });
  it("should show the users name if authentication succeeds", function(done){
    var self = this;
    this.timeout(6000);
    // Test takes about 5000 ms on my machine... WTF?!
    // Approx. 4750ms of this is insantiating an empty angular app in zombie.
    // Commenting out only the js/app.js include results in a ~300ms test.
    // But if we only instantiate an empty angular app, we back at about 5000ms
    // Not sure if we should stub it out here and test angular totally separately.
    this.browser.
    fill('email', 'mary@example.com').
    fill('password', 'p4ssw0rd').
    pressButton('Sign in', function(){
      self.browser.text().should.include('Log Out');
      done();
    });
  });
  it("should show an error if the passsword is incorrect", function(done){
    var self = this;
    this.browser.
    fill('email', 'mary@example.com').
    fill('password', 'incorrect').
    pressButton('Sign in', function(){
      self.browser.text().should.include('Validation failed');
      done();
    });
  });
  after(function(done){
    if(this.server)
      this.server.close(done);
    else
      done();
  });
});
