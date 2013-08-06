var async = require('async');
var fs    = require('fs');

var loadDirectories = ['ccda'];


exports.load = function(callback){
  async.reduce(loadDirectories, {}, function(loadedDirectories, directoryName, reduction){
    var directory = "./"+directoryName+"/";
    fs.readdir(directory, function(err, fileNames){
      console.log("Loaded:",directory,"contains",fileNames);
      async.reduce(fileNames, {}, function(loadedFiles, fileName, reduction){
        fs.readFile(directory+fileName, 'utf-8', function(err, data){
          loadedFiles[fileName] = data;
          reduction(loadedFiles);
        });
      }, function(error, filesInDirectory){
        loadedDirectories[directoryName] = filesInDirectory;
        reduction(error, loadedDirectories);
      });
    });
  }),
  callback
}
exports.fixtures = function(){
  loaded = {};
  loadDirectories.forEach(function(directoryName){
    loaded[directoryName] = {};
    var directory = __dirname + "/" + directoryName+"/";
    var fileNames = fs.readdirSync(directory);
    fileNames.forEach(function(fileName){
      loaded[directoryName][fileName] = fs.readFileSync(directory+fileName, 'utf-8');
    });
  });
  return loaded;
}

exports.medications = function(){
  return require('./medications');
}
