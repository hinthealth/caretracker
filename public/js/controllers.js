'use strict';

/* Controllers */
angular.module('caretracker.controllers', []).
  // MenuController
  controller('MenuController', ['$scope', '$http', function($scope, $http){
    $http.get('/api/care_plans').
      success(function(data, status, headers, config) {
        $scope.carePlans = data.carePlans;
      });
  }]).

  // CarePlan Controllers
  controller('IndexCarePlansCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.showWelcomeMessage = 'welcome' in $routeParams;
    $http.get('/api/care_plans').success(function(data) {
      $scope.carePlans = data.carePlans;
    });
  }]).
  controller('AddCarePlanCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.form = {};
    $scope.createCarePlan = function() {
      $http.post('/api/care_plans', $scope.form).success(function(data) {
        if (data.carePlan.patient.email) {
          $location.path('/care_plans/'+ data.carePlan._id + '/verify');
        } else {
          $location.path('/care_plans/'+ data.carePlan._id + '/finished');
        }
      });
    };
  }]).
  controller('ShowCarePlanCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    // By default, get today's tasks.
    var current = moment();
    var start = moment(current).startOf('day');
    var end = moment(current).endOf('day');

    // $http.get('/api/care_plans/' + $routeParams.id).success(function(data) {
    //   $scope.carePlan = data.carePlan;
    // });
    $scope.updateTasks = function(){
      $http.get('/api/care_plans/' + $routeParams.id + '/tasks', {
        params: {start: start.valueOf(), end: end.valueOf()}
      }).success(function(data) {
        $scope.formattedDay = current.format('dddd, MMMM Do');
        if(current.isSame(moment(), 'day')){
          // Special code for "today"
          $scope.formattedDay = "Today, " + $scope.formattedDay;
        }
        $scope.tasks = data.tasks;
        $scope.carePlan = data.carePlan;
      });
    };
    $scope.toggleCompleted = function(scheduleId, taskTime){
      $http.put('/api/care_plans/' + $routeParams.id +
          '/schedules/' + scheduleId +
          '/tasks/' + taskTime +
          '/toggle').success(function(data) {
        $scope.updateTasks();
      });
    };

    $scope.updateTasks();
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
      $http.post('/api/care_plans/' + $routeParams.id +
          '/care_providers', $scope.form).success(function(data) {
        $location.path('/care_plans/' + $routeParams.id + '/care_providers');
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
      $http.post('/api/events', $scope.form).success(function(data) {
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
  controller('DeleteEventCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
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
  }]).
  controller('ShowHealthRecordCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id + '/health_record').
      success(function(data) {
        $scope.carePlan = data.carePlan;
        $scope.demographics = data.healthRecord.data.demographics;
        $scope.medications = data.healthRecord.data.medications;
      });

  }]).

  // Schedules Controllers
  controller('AddSchedulesCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
    $scope.form = {start: new Date().getTime()};
    $scope.createSchedule = function() {
      var path = '/api/care_plans/' + $routeParams.id + '/schedules';
      $http.post(path, $scope.form).success(function(data) {
        $location.path('/care_plans/' + $routeParams.id );
      });
    };
  }]).
  controller('ShowScheduleCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $http.get('/api/care_plans/' + $routeParams.id).success(function(data) {
      $scope.carePlan = data.carePlan;
    });
  }]).
    // Tasks Controllers
  controller('EditTasksCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    var baseUrl = '/api/care_plans/'+ $routeParams.carePlanId
                + '/schedules/' + $routeParams.scheduleId
                + '/tasks/';
    $scope.form = {};
    $http.get(baseUrl + $routeParams.id).
      success(function(data) {
        $scope.task = data.task;
        $scope.form = data.task;
      });

    $scope.saveTask = function () {
      $http.put(baseUrl + $routeParams.id, $scope.form).
        success(function(data) {
          $location.url('/care_plans/' + $routeParams.carePlanId);
        });
    };
  }]);
