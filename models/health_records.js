var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId
  , BBParser = require("./../node_modules/bluebutton/build/bluebutton.js");

// HealthRecord schema
// TODO: Camelize these variables
var HealthRecordSchema = new Schema({
  direct_address: String,
  content_url: String,
  key: String,
  created: Number,
  data: {}
});

// Setup input/output of health documents
HealthRecordSchema.virtual('data.xml').get(function(){
  throw Error("Not yet implemented in bluebutton.js");
  return BBParser(this.data.json).xml();
})
.set(function(dataXml){
  this.data.document = BBParser(dataXml);
});

HealthRecordSchema.virtual('data.document')
.get(function(){
  return BBParser(this.data.json);
})
.set(function(newDocument){
  this.data.json = newDocument.data.json();
});

HealthRecordSchema.virtual('data.json')
.get(function(){
  return JSON.stringify(this.data);
})
.set(function(newJson){
  this.data = JSON.parse(newJson);
  this.markModified('data');
});

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
