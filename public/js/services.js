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
    var current = function(id){
      if(!id){
        return $rootScope.carePlan = null;
      }
      if($rootScope.myCarePlan && $rootScope.myCarePlan._id == id){
        $rootScope.carePlan = $rootScope.myCarePlan;
        $rootScope.patientNamePossesive = 'Your';
      }else if($rootScope.carePlans){
        $rootScope.carePlan = $rootScope.carePlans.filter(function(carePlan){
          return carePlan._id == id;
        })[0];
        $rootScope.patientNamePossesive = $rootScope.carePlan.patient.name + "'s";
      }
      return $rootScope.carePlan;
    };
    var refresh = function(){
      $http.get('/api/care_plans').
        success(function(data, status, headers, config) {
          $rootScope.myCarePlan = data.myCarePlan;
          $rootScope.carePlans = data.carePlans;
        });
    };
    refresh()
    return {
      current: current,
      refresh: refresh
    };
  }]);
}).
  value('version', '0.1');
