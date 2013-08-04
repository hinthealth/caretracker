var helper = require('./acceptance_helper')
  , mongoose = require('mongoose')
  , User = mongoose.model('User');


describe("new user signup", function(){
  beforeEach(function(done){
    // Extract into some kind of generic seeding
    User.remove({}, done);
  });

  before(function(){
    this.server = helper.app;
    this.browser = new helper.Browser({ site: 'http://localhost:7357' });
  });
  beforeEach(function(done){
    this.timeout(6000);
    this.browser.visit('/signup', done);
  });
  it("should have name, email, password fields", function(done){
    this.browser.success.should.be.ok;
    this.browser.query('input[name="name[full]"]').should.be.ok;
    this.browser.query('input[name="email"]').should.be.ok;
    this.browser.query('input[name="password"]').should.be.ok;
    this.browser.query('input[name="passwordConfirmation"]').should.be.ok;
    done();
  });
  it("should create a user and let me login with valid email/pass", function(done){
    this.timeout(10000);
    var self = this;
    this.browser.
    fill('name[full]', 'Mary Jane').
    fill('email', 'mary@example.com').
    fill('password', 'p4ssw0rd').
    fill('passwordConfirmation', 'p4ssw0rd').
    pressButton('Sign up', function(){
      self.browser.html().should.include('<!-- User is logged in. -->');
      User.findOne({email: 'mary@example.com'}, done);
    });
  });
  it("should not allow signup if password doesn't match", function(done){
    this.timeout(10000);
    var self = this;
    this.browser.
    fill('name[full]', 'Mary Jane').
    fill('email', 'mary@example.com').
    fill('password', 'p4ssw0rd').
    fill('passwordConfirmation', 'p4ssw0rdNoMatchy').
    pressButton('Sign up', function(){
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
