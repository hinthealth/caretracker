'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('caretracker.services', [], function($provide){
  /**
   * Care Plan Service
   * Responsible for loading and updating care plans. To be used by any
   * controller that uses careplans. To allow sharing between them and to
   * keep all controllers in sync. Also allows for a much simpler API.
   *
   * Setting "current" carePlan effects default back button behavior.
   */
  $provide.factory('carePlansService', ['$http', '$rootScope', function($http, $rootScope){
    // Private functions
    var dirty = true;
    var doRefresh = function(done){
      $http.get('/api/care_plans').
      success(function(data, status, headers, config) {
        $rootScope.myCarePlan = data.myCarePlan;
        $rootScope.carePlans = data.carePlans;
        dirty = false;
        done();
      });
    }

    var reload = function(done){
      if(dirty){
        return doRefresh(function(){
          reload(done);
        });
      }
      var error;
      if(!$rootScope.carePlanId){
        $rootScope.carePlan = null;
        $rootScope.patientNamePossesive = "Nobody's";
      }else{
        if($rootScope.myCarePlan &&
           $rootScope.myCarePlan._id == $rootScope.carePlanId){
          $rootScope.carePlan = $rootScope.myCarePlan;
          $rootScope.patientNamePossesive = 'Your';
        }else if($rootScope.carePlans){
          $rootScope.carePlan = $rootScope.carePlans.filter(function(carePlan){
            return carePlan._id == id;
          })[0];
          if($rootScope.carePlan){
            $rootScope.patientNamePossesive = $rootScope.carePlan.patient.name + "'s";
          }else{
            error = Error("Unable to find carePlan with ID",$rootScope.carePlanId);
          }
        }
      }
      if(done){
        done(error, $rootScope.carePlan)
      }else if(error){
        console.log(error.message);
      }
    }

    // Public functions
    var pub = {}; // public is protected keyword?
    pub.clearCurrent = function(){
      if($rootScope.carePlanId != null){
        $rootScope.carePlanId = null;
        reload();
      }
    }
    pub.setCurrent = function(id, done){
      if($rootScope.carePlanId != id){
        $rootScope.carePlanId = id;
        reload(function(error){
          if(done){
            done(error, $rootScope.myCarePlan);
          }
        });
      }
    }
    pub.refresh = function(){
      dirty = true;
    }

    return pub;
  }]);
}).
  value('version', '0.1');
