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

var HealthStore = require("./../lib/ccda_service");
HealthRecordSchema.static('updateDirectAddress', function(directAddress){
  var self = this;
  // Erm, we should really deal with multiple health records,
  // and not just pick the most recent.
  if(!directAddress) throw Error("Direct address is required.");
  var store = new HealthStore({directAddress: directAddress});
  store.retrieveAll(function(error, attributes, ccdaXml){
    self.findOne({direct_address: directAddress, key: attributes.key}).exec(function(error, found){
      var record = null;
      if(found){
        record = found;
        // Update health record attributes that could change
        if(record.created < attributes.created){
          record.created = attributes.created;
          record.data.xml = ccdaXml;
        }
      } else {
        record = new self(attributes);
        record.data.xml = ccdaXml;
      }
      record.save(function(error){
        if(error) return console.log("Error saving health record", error);
        console.log("Health Records updated for "+ directAddress);
      });
    });
  });
});

var periodInSeconds = function(period){
  var mult = parseFloat(period.value);
  switch(period.unit){
    case 'mo':
    mult *= 52/12;
    case 'wk':
    mult *= 7;
    case 'd':
    mult *= 24;
    case 'h':
    mult *= 60;
    case 'min':
    mult *= 60;
    case 's':
    mult *= 1;
    break;
    default:
    console.log("Unknown unit "+period.unit);
    mult = NaN;
  };
  return mult == NaN ? 0 : mult;
}

HealthRecordSchema.methods.generateEvents = function(){
  events = [];
  self.data.toObject().medications.forEach(function(medication){
    // Medication fields should be:
    // date_range start, end
    // schedule type, period: value, unit
    // product: name, code
    // prescriber.person
    // reason.name
    // dose_quantity: value, unit
    var dose = medication.dose_quantity.value + " " + medication.dose_quantity.unit
    //  e.g. 200 mg
    var name = dose + ' ' + medication.product.name
    // e.g. Vicodin
    var content = "";
    if(medication.prescriber.person){
      content += "By " + medication.prescriber.person + " ";
    }
    if(medication.reason.name){
      content += "for " + medication.reason.name + " ";
    }
    var period = 0;
    if(medication.period){
      period = periodInSeconds(medication.period);
    }
    var start = medication.date_range.start || new Date();
    var end = medication.date_range.end;
    // Special case non-repeating events
    if(period == 0 && !end){ end = start};
    var sched = new Schedule({
      starting: start,
      ending: end,
      period: period
    });
    events.push(new Event({name: name, content: content, schedule: sched}));
  });
  return events;
}

mongoose.model('HealthRecord', HealthRecordSchema);
