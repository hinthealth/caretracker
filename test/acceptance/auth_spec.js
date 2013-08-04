var helper = require('./acceptance_helper')
  , mongoose = require('mongoose')
  , User = mongoose.model('User');


describe("visiting a link requiring authentication while not authenticated", function(){
  before(function(){
    this.server = helper.app;
  });

  beforeEach(function(done){
    User.remove({}, function(err, result){
      User.create({name: {full: "Mary Jane"}, email: 'mary@example.com', password: 'p4ssw0rd'}, done);
    });
  })

  beforeEach(function(done){
    this.browser = new helper.Browser({ site: 'http://localhost:7357' });
    this.browser.visit('/account', done);
  });

  it("should ask you to log in first", function(){
    this.browser.location.pathname.should.equal('/login');
    this.browser.text().should.include("Please log in");
  });

  describe("after authenticating", function(){
    beforeEach(function(done){
      var self = this;
      this.timeout(10000);
      this.browser.
      fill('email', 'mary@example.com').
      fill('password', 'p4ssw0rd').
      pressButton('Sign in', done);
    });

    it("should direct you to the page you requested", function(done){
      this.browser.location.pathname.should.equal('/account');
      done();
    });
  });

  describe("after account creation", function(){
    beforeEach(function(done){
      var self = this;
      this.timeout(10000);
      this.browser.clickLink("Sign up", function(){
        self.browser.location.pathname.should.equal('/signup');
        self.browser.
        fill('name[full]', 'Sue Zan').
        fill('email', 'suez@example.com').
        fill('password', 'p4ssw0rd1').
        fill('passwordConfirmation', 'p4ssw0rd1').
        pressButton('Sign up', done);
      });
    });
    it("should direct you to the page you requested", function(done){
      this.browser.location.pathname.should.equal('/account');
      done();
    });
  });

});

describe("signing in", function(){
  beforeEach(function(done){
    // Extract into some kind of generic seeding
    User.remove({}, function(err, result){
      User.create({name: {full: "Mary Jane"}, email: 'mary@example.com', password: 'p4ssw0rd'}, done);
    });
  });

  before(function(){
    this.server = helper.app;
    this.browser = new helper.Browser({ site: 'http://localhost:7357' });
  });
  beforeEach(function(done){
    this.browser.visit('/login', done);
  });

  it("should email, password fields", function(){
    this.browser.success.should.be.ok;
    this.browser.query('input[name="email"]').should.be.ok;
    this.browser.query('input[name="password"]').should.be.ok;
  });
  it("should show flag in comment if user is logged in", function(done){
    var self = this;
    this.timeout(10000);
    // Test takes about 5000 ms on my machine... WTF?!
    // Approx. 4750ms of this is insantiating an empty angular app in zombie.
    // Commenting out only the js/app.js include results in a ~300ms test.
    // But if we only instantiate an empty angular app, we back at about 5000ms
    // Not sure if we should stub it out here and test angular totally separately.
    this.browser.
    fill('email', 'mary@example.com').
    fill('password', 'p4ssw0rd').
    pressButton('Sign in', function(){
      self.browser.html().should.include('<!-- User is logged in. -->');
      done();
    });
  });
  it("should show an error if the passsword is incorrect", function(done){
    var self = this;
    this.browser.
    fill('email', 'mary@example.com').
    fill('password', 'incorrect').
    pressButton('Sign in', function(){
      self.browser.text().should.include('Invalid username or password.');
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
