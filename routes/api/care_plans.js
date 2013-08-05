var mongoose = require('mongoose')
  , CarePlan = mongoose.model('CarePlan')
  , analytics = require('../../middlewares/analytics');

// GET care_plans/
exports.index = function (req, res) {
  // TODO: Scope by current user access
  CarePlan.accessibleTo(req.user).exec(function(error, carePlans){
    if(error) return res.json(false);
    res.json({carePlans: carePlans});
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
exports.create = function (req, res) {
  // TODO: Scope by current user access
  req.body.ownerId = req.user.id;
  CarePlan.create(req.body, function(error, carePlan){
    if(error) return res.json(false);

    if(carePlan.patient.email){
      // Send patient invite
      analytics.track({
        userId     : req.user.id,
        event      : 'Patient Invitation Created',
        properties : {
          sendEmail: true,
          fromFirstName: req.user.name.first,
          fromLastName: req.user.name.first,
          fromEmail: req.user.email,
          toName: carePlan.patient.name,
          toEamil: carePlan.patient.email,
          inviteKey: carePlan.patient.invitePath,
          inviteUrl: carePlan.invitePatientUrl(req.headers.host)
        }
      });

    }
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
    carePlan.patient.name = req.body.patient.name;

    carePlan.save(function(error){
      if(error) return res.json({error: error});
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