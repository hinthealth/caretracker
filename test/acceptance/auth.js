require("better-stack-traces").install();

process.env.NODE_ENV = 'test';
process.env.PORT = 7357;

var app = require('../../app').server
  , Browser = require('zombie')
  , assert = require('assert');

describe("signing in", function(){
  before(function(){
    this.server = app;
    this.browser = new Browser({ site: 'http://localhost:7357' });
  });
  beforeEach(function(done){
    this.browser.visit('/', done);
  });
  it("should email, password fields", function(){
    console.log('this browser',this.browser.success);
    this.browser.success.should.be.ok;
    this.browser.text('h1').should.equal('Carefull');
    this.browser.query('input[name="email"]').should.be.ok;
    this.browser.query('input[name="password"]').should.be.ok;
  });
  it.skip("should show the users name if authentication succeeds", function(){
    var self = this;
    this.browser.fill('email', 'jeremydw@gmail.com').
    fill('password', 'hello!').
    pressButton('Sign in', function(){
      self.browser.redirected.should.be.true;
      self.browser.success.should.be.ok;
      // TODO: On Success, have his name show.
      self.browser.text().should.include('Jeremy Dee Dubs');
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
