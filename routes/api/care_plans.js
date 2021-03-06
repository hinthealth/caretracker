var mongoose  = require('mongoose')
  , CarePlan  = mongoose.model('CarePlan')
  , AppConfig    = require('../../config/app')
  , analytics = require('../../middlewares/analytics');

// GET care_plans/
exports.index = function (req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).exec(function(error, carePlans){
    if(error) return res.json(false);
    var myCarePlan;
    carePlans = carePlans.filter(function(plan){
      if(plan.patient.userId == req.user.id){
        myCarePlan = plan;
        return false;
      }else{
        return true;
      }
    });
    res.json({carePlans: carePlans, myCarePlan: myCarePlan});
  });
};

// GET care_plan/:id
exports.show = function (req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).find({_id: req.params.id}).findOne(function(error, carePlan){
    if(error) return res.json(false);
    res.json({carePlan: carePlan});
  });
};

// POST
exports.create = function (req, res, next) {
  // TODO: Scope by current user access
  req.body.ownerId = req.user.id;
  CarePlan.create(req.body, function(error, carePlan){
    if(error) return next(error);

    if(carePlan.patient.email){
      // Send patient invite
      analytics.track({
        userId     : req.user.id,
        event      : 'Patient Invitation Created',
        properties : {
          sendEmail:        true,
          fromFirstName:    req.user.name.first,
          fromLastName:     req.user.name.first,
          fromEmail:        req.user.email,
          patientName:      carePlan.patient.name,
          patientFirstName: carePlan.get('patient.name.first'),
          patientEmail:     carePlan.patient.email,
          inviteKey:        carePlan.patient.invitePath,
          inviteUrl:        carePlan.invitePatientUrl(AppConfig.url)
        }
      });
      console.log("Email sent to patient ", req.user.email, "with url", carePlan.invitePatientUrl(AppConfig.url));
    }
    res.json({carePlan: carePlan});
  });
};

// POST
exports.create_for_me = function (req, res, next) {
  // TODO: Scope by current user access
  var carePlan = new CarePlan({ownerId: req.user.id});
  carePlan.setPatient(req.user);
  carePlan.save(function(error){
    if(error) return next(error);
    res.json({carePlan: carePlan});
  });
};

// PUT
exports.update = function (req, res) {
  CarePlan.accessibleTo(req.user).find({_id: req.params.id}).findOne(function(error, carePlan){
    if(error) return res.json(false);
    if(carePlan.ownerId == req.user.id){
      // Allow elevated access, like managing the careteam
    }
    if(!carePlan.patient.userId){
      // No user associated yet, let them update
      carePlan.patient.name   = req.body.patient.name;
      carePlan.patient.email  = req.body.patient.email;
    }

    carePlan.save(function(error){
      if(error) return res.json({error: error});
      if(req.body.patient.sendEmail){
        analytics.track({
          userId     : req.user.id,
          event      : 'Patient Invitation Updated',
          properties : {
            sendEmail: true,
            fromFirstName: req.user.name.first,
            fromLastName: req.user.name.first,
            fromEmail: req.user.email,
            toName: carePlan.patient.name,
            toEmail: carePlan.patient.email,
            inviteKey: carePlan.patient.invitePath,
            inviteUrl: carePlan.invitePatientUrl(AppConfig.url)
          }
        });
      }
      res.json({carePlan: carePlan});
    });
  });
};

// DELETE
exports.destroy = function (req, res) {
  CarePlan.ownedBy(req.user).find({_id: req.params.id}).findOneAndRemove(function(error, carePlan){
    if(error) return res.json(false);
    res.json(true);
  });
};