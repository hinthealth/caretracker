'use strict';

/* Controllers */
angular.module('caretracker.controllers', []).
  controller('IndexEventsCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('/api/events').
      success(function(data, status, headers, config) {
        $scope.events = data.events;
      });
    }]).
  controller('AddEventCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.form = {};
    $scope.submitEvent = function () {
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
