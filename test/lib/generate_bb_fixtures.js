
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
var fixtures = fixtures.fixtures().ccda;
var medications = {};
Object.keys(fixtures).forEach(function(fileName){
  console.log("Parsing", fileName,"...");
  var parsed;
  try{
    parsed = BBParser(fixtures[fileName]);
  } catch(error) {
    console.log("     * ",fileName,"Parsing error");
    console.log("       ", error.message);
    console.log(error.stack);
    throw(error);
  }
  if(parsed.medications().length){
    medications[fileName.toLowerCase().replace(/\W/g,'_')] = parsed.medications();
  }
});
console.log("*************************************")
console.log("* MEDICATIONS ")
console.log("*************************************")
for (var name in medications) {
  console.log(name,"has",medications[name].length,"medications");
}

// console.log("Preparing for json..");
// for (var name in medications) {
//   console.log(" - Prepping",name);
//   medications[name] = medications[name].map(function(medication){
//     debugger;
//     medication.json();
//   });
// }

outputFilename = __dirname + "/../fixtures/medications.json"
console.log("Writing to ",outputFilename);
fs.writeFile(outputFilename, JSON.stringify(medications, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved!");
    }
});

