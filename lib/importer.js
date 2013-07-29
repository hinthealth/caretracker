
var CcdaParser = require("./../node_modules/bluebutton/build/bluebutton.js");


// "https://healthstore-dot-healthio-dev.appspot.com/ccda/list/jeremydw@direct.gohint.com"
var server_url = 'https://healthstore-dot-healthio-dev.appspot.com/ccda/';
// var url = ccda_server_url + email;
var DocumentService = function(url, email, options){
  var protocol = url.match(/^https/) ? https : http;
  this.base_url = url;
  this.email = email;
  this.options = options;

  var getURL = function(url, done){
    console.log("getting "+url);
    protocol.get(url, function(res) {
      var body = '';
      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
        console.log("Got response!");
        done(body);
      });
    }).on('error', function(e) {
        console.log("Got error: ", e);
        done(null, e);
    });
  };

  var getCCDA = function(url, done){
    getURL(url, function(resp, error){
      if(!error){
        var parsedResponse = CcdaParser(resp);
        done(parsedResponse);
      }else{
        done(null, error);
      }
    });
  };

  var getJSON = function(url, done){
    getURL(url, function(resp, error){
      var parsedResponse = JSON.parse(resp);
      done(parsedResponse);
    });
  };
  this.list = function(done){
    var url = this.base_url + 'list/' + this.email;
    getJSON(url, done);
  };
  this.contentFor = function(key, done){
    var url = this.base_url + 'content/' + key;
    getCCDA(url, done);
  };
  this.retrieveAll = function(done){
    this.list(this.email, function(res, error){
      res.forEach(function(ccda){
        contentFor(ccda.key, done);
      });
    });
  };
};
// response = '';
// body = '';
// https.get("https://healthstore-dot-healthio-dev.appspot.com/ccda/list/jeremydw@direct.gohint.com", function(res){
//   response = res;
//   res.on('data', function(data){
//     body += data;
//   });
// });

exports.Service = DocumentService;
exports.server_url = server_url;
