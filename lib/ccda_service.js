
// "https://healthstore-dot-healthio-dev.appspot.com/ccda/list/jeremydw@direct.gohint.com"
var server_url = 'https://healthstore-dot-healthio-dev.appspot.com/ccda/';
// TODO - Fix this require, it should work with the updated library version

// var url = ccda_server_url + email;
var DocumentService = function(url, email, options){
  var protocol = url.match(/^https/) ? https : http;
  this.base_url = url;
  this.email = email;
  this.options = options;
  this.ccdaParser = options.parser || require("./../node_modules/bluebutton/build/bluebutton.js");

  var getURL = function(url, done){
    console.log("getting "+url);
    protocol.get(url, function(res) {
      var body = '';
      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
        console.log("Got response!");
        done(null, body);
      });
    }).on('error', function(e) {
        console.log("Got error: ", e);
        done(e);
    });
  };

  var getJSON = function(url, done){
    getURL(url, function(resp, error){
      var parsedResponse = JSON.parse(resp);
      done(null, parsedResponse);
    });
  };
  this.list = function(done){
    var url = this.base_url + 'list/' + this.email;
    getJSON(url, done);
  };
  this.contentFor = function(key, done){
    var url = this.base_url + 'content/' + key;
    getURL(url, done);
  };

  this.retrieveAll = function(done){
    this.list(this.email, function(res, error){
      if(error) return "Error listing ccda's";
      res.forEach(function(ccda){
        contentFor(ccda.key, function(error, content){
          if(error) return "Error pulling down ccda xml for "+ccda.key;
          done(null, ccda.key, this.ccdaParser(content));
        });
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
