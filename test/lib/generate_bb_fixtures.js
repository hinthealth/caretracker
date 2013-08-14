
require('better-stack-traces').install();
var BBParser = require('./../../node_modules/bluebutton/build/bluebutton.js');
var fixtures = require("./../fixtures");
var fs       = require("fs");

// fixtures.load(function(err, directories){
//   Object.keys(directories.ccda).forEach(function(fileName){
//     console.log("Parsing "+fileName);
//     var parsed = BBParser(directories.ccda[fileName]);
//   })
// })

/*
// Code for running in repl to get a sample:

bb = require('./node_modules/bluebutton/build/bluebutton.js');
ccda = bb(require('./test/fixtures').fixtures().ccda['CCD.sample.xml']);

*/
BBFixtureGenerator = {};

/**
 * Parses each file in ./ccda/, strips everything but the section you want,
 * and generates a single JSON file of every example of that section.
 * @param {String} section Determines which section of the CCDA to parse out.
 *                         e.g. "medications". THIS MUST MATCH A CCDA SECTION
 */

BBFixtureGenerator.sectionJSON = function(section){
  var fixtures = fixtures.fixtures().ccda;
  var examples = {};
  Object.keys(fixtures).forEach(function(fileName){
    console.log("Parsing", fileName,"...");
    var parsed;
    try{
      parsed = BBParser(fixtures[fileName]);
    } catch(error) {
      console.log("     * ",fileName,"Parsing error");
      console.log("       ", error.message);
      console.log(error.stack);
      throw(error); // Be noisy and stop if we fail
    }
    var data = parsed.data[section];
    if(
        (Array.isArray(data) && data.length) ||
        (data instanceof Object && Object.keys(data).length)
      ){
      examples[fileName.toLowerCase().replace(/\W/g,'_')] = data;
    };
  });
  console.log("*************************************");
  console.log("*", section.toUpperCase());
  console.log("*************************************");
  for (var name in examples) {
    if(Array.isArray(examples[name])){
      console.log(name, "has", examples[name].length, section);
    }
  }

  outputFilename = __dirname + "/../fixtures/"+section+".json"
  console.log("Writing to ",outputFilename);
  fs.writeFile(outputFilename, JSON.stringify(examples, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved!");
      }
  });

};

module.exports = BBFixtureGenerator;

