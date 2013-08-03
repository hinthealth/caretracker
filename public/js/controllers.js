'use strict';

/* Controllers */
angular.module('caretracker.controllers', []).
  // CarePlan Controllers
  controller('IndexCarePlansCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('/api/care_plans').
      success(function(data, status, headers, config) {
        $scope.carePlans = data.carePlans;
      });
  }]).
  controller('AddCarePlanCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.form = {};
    $scope.createCarePlan = function () {
      $http.post('/api/care_plans', $scope.form).
        success(function(data) {
          if(data.carePlan.email){
            $location.path('/care_plans/'+ data.carePlan._id + '/verify');
          }else{
            $location.path('/care_plans/'+ data.carePlan._id + '/finished');
          }
        });
    };
  }]).
  controller('ShowCarePlanCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id).
      success(function(data) {
        $scope.carePlan = data.carePlan;
      });
  }]).

  // CareTeam Controllers
  controller('IndexCareTeamCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id + '/care_team' ).
      success(function(data, status, headers, config) {
        $scope.careTeam = data.careTeam;
        $scope.carePlan = data.carePlan;
      });
  }]).
  controller('AddCareTeamCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
    $scope.form = {};
    $http.get('/api/care_plans/' + $routeParams.id + '/care_team' ).
      success(function(data, status, headers, config) {
        $scope.careTeam = data.careTeam;
        $scope.carePlan = data.carePlan;
      });
    $scope.addToCareTeam = function(){
      $http.post('/api/care_plans/'+ $routeParams.id +'/care_team', $scope.form).
        success(function(data){
          $location.path('/care_plans/'+ $routeParams.id +'/care_team');
        });
    };
  }]).

  // Events Controllers
  controller('IndexEventsCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('/api/events').
      success(function(data, status, headers, config) {
        $scope.events = data.events;
      });
    }]).
  controller('AddEventCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.form = {};
    $scope.createEvent = function () {
      $http.post('/api/events', $scope.form).
        success(function(data) {
          $location.path('/events');
        });
    };
  }]).
  controller('ShowEventCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/events/' + $routeParams.id).
      success(function(data) {
        $scope.event = data.event;
      });
  }]).
  controller('EditEventCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    $scope.form = {};
    $http.get('/api/events/' + $routeParams.id).
      success(function(data) {
        $scope.form = data.event;
      });

    $scope.editEvent = function () {
      $http.put('/api/events/' + $routeParams.id, $scope.form).
        success(function(data) {
          $location.url('/events/' + $routeParams.id);
        });
    };
  }])
  .controller('DeleteEventCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    $http.get('/api/events/' + $routeParams.id).
      success(function(data) {
        $scope.event = data.event;
      });

    $scope.deleteEvent = function () {
      $http.delete('/api/events/' + $routeParams.id).
        success(function(data) {
          $location.url('/');
        });
    };

    $scope.home = function () {
      $location.url('/');
    };
  }]);
