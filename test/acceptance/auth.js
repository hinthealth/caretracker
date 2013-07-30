require("better-stack-traces").install();
var models = require('./../../models')
  , User = models.users;

process.env.NODE_ENV = 'test';
process.env.PORT = 7357;

var app = require('../../app').server
  , Browser = require('zombie')
  , assert = require('assert');

describe("signing in", function(){
  beforeEach(function(done){
    // Extract into some kind of generic seeding
    User.remove({}, function(err, result){
      User.create({admin:false, email: 'mary@example.com', password: 'p4ssw0rd', username: 'maryjay'}, done);
    });
  });

  before(function(){
    this.server = app;
    this.browser = new Browser({ site: 'http://localhost:7357' });
  });
  beforeEach(function(done){
    this.browser.visit('/login', done);
  });
  it("should email, password fields", function(){
    console.log('this browser',this.browser.success);
    this.browser.success.should.be.ok;
    this.browser.query('input[name="username"]').should.be.ok;
    this.browser.query('input[name="password"]').should.be.ok;
  });
  it("should show the users name if authentication succeeds", function(){
    var self = this;

    this.browser.
    fill('username', 'mary@example.com').
    fill('password', 'p4ssw0rd').
    pressButton('Sign in', function(){
      self.browser.redirected.should.be.true;
      self.browser.success.should.be.ok;
      // TODO: On Success, have his name show.
      self.browser.text().should.include('maryjay');
    });
  });
  it("should show an error if the passsword is incorrect");
  after(function(done){
    if(this.server)
      this.server.close(done);
    else
      done();
  });
});
