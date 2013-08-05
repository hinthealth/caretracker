'use strict';

/* Controllers */
angular.module('caretracker.controllers', []).
  // CarePlan Controllers
  controller('IndexCarePlansCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('/api/care_plans').success(function(data) {
        $scope.carePlans = data.carePlans;
    });
  }]).
  controller('AddCarePlanCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.form = {};
    $scope.createCarePlan = function() {
      $http.post('/api/care_plans', $scope.form).success(function(data) {
          if(data.carePlan.email){
            $location.path('/care_plans/'+ data.carePlan._id + '/verify');
          }else{
            $location.path('/care_plans/'+ data.carePlan._id + '/finished');
          }
      });
    };
  }]).
  controller('ShowCarePlanCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id).success(function(data) {
      $scope.carePlan = data.carePlan;
    });
    $http.get('/api/care_plans/' + $routeParams.id + '/tasks').success(
          function(data) {
      $scope.tasks = data.tasks;
    });
  }]).

  // CareProviders Controllers
  controller('IndexCareProvidersCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id + '/care_providers' ).
      success(function(data, status, headers, config) {
        $scope.carePlan = data.carePlan;
        $scope.careProviders = data.carePlan.careProviders;
      });
  }]).
  controller('AddCareProvidersCtrl', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
    $scope.form = {};
    $http.get('/api/care_plans/' + $routeParams.id + '/care_providers' ).
      success(function(data, status, headers, config) {
        $scope.carePlan = data.carePlan;
        $scope.careProviders = data.carePlan.careProviders;
      });
    $scope.createCareProvider = function(){
      $http.post('/api/care_plans/'+ $routeParams.id +'/care_providers', $scope.form).
        success(function(data){
          $location.path('/care_plans/'+ $routeParams.id +'/care_providers');
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
