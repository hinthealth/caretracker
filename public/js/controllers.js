'use strict';

/* Controllers */
angular.module('caretracker.controllers', []).
  // MenuController
  controller('MenuController', ['$scope', '$http', 'carePlansService', function($scope, $http, carePlansService) {
  }]).
  // CarePlan Controllers
  controller('IndexCarePlansCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'carePlansService', function($rootScope, $scope, $http, $routeParams, carePlansService) {
    $rootScope.title = 'Your patients';
    $scope.showWelcomeMessage = 'welcome' in $routeParams;
    carePlansService.clearCurrent();
  }]).
  controller('AddCarePlanCtrl', ['$rootScope', '$scope', '$http', '$location', 'carePlansService', function($rootScope, $scope, $http, $location, carePlansService) {
    $rootScope.title = 'Add a patient';
    $scope.form = {};
    $scope.createCarePlan = function() {
      $http.post('/api/care_plans', $scope.form).success(function(data) {
        if (data.carePlan.patient.email) {
          $location.path('/care_plans/'+ data.carePlan._id + '/verify');
        } else {
          $location.path('/care_plans/'+ data.carePlan._id + '/finished');
        }
        carePlansService.refresh();
      });
    };
  }]).
  controller('AddPatientCarePlanCtrl', ['$rootScope', '$scope', '$http', '$location', 'carePlansService', function($rootScope, $scope, $http, $location, carePlansService) {
    $rootScope.title = 'I am a patient';
    $scope.createPatientCarePlan = function() {
      $http.post('/api/care_plans/self').success(function(data) {
        $location.path('/care_plans/'+ data.carePlan._id);
        carePlansService.refresh();
     });
    };
  }]).
  controller('ShowCarePlanCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'carePlansService', function($rootScope, $scope, $http, $routeParams, carePlansService) {
    // Set current care plan
    carePlansService.setCurrent($routeParams.id, function(error, carePlan){
      $rootScope.title = carePlan.patient.name;
    });
    // By default, get today's tasks.
    var current = moment();
    var start = moment(current).startOf('day');
    var end = moment(current).endOf('day');

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
  controller('ShowCarePlanDataImportCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'carePlansService', function($rootScope, $scope, $http, $routeParams, carePlansService) {
    $rootScope.title = 'Import health data';
  }]).

  // CareProviders Controllers
  controller('IndexCareProvidersCtrl', ['$rootScope', '$scope', '$http', '$routeParams', function($rootScope, $scope, $http, $routeParams) {
    $http.get('/api/care_plans/' + $routeParams.id + '/care_providers' ).
      success(function(data, status, headers, config) {
        $rootScope.title = data.carePlan.patient.name;
        $scope.careProviders = data.carePlan.careProviders;
      });
  }]).
  controller('AddCareProvidersCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', function($rootScope, $scope, $http, $routeParams, $location) {

    $scope.form = {};
    $http.get('/api/care_plans/' + $routeParams.id + '/care_providers' ).
      success(function(data, status, headers, config) {
        $rootScope.title = 'Add to ' + data.carePlan.patient.name + '\'s Care Team';
        $scope.careProviders = data.carePlan.careProviders;
      });
    $scope.createCareProvider = function(){
      $http.post('/api/care_plans/' + $routeParams.id +
          '/care_providers', $scope.form).success(function(data) {
        $location.path('/care_plans/' + $routeParams.id + '/care_providers');
      });
    };
  }]).

  controller('ShowHealthRecordCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('/api/care_plans/' + $routeParams.id + '/health_record').
      success(function(response) {
        $scope.medications = response.medications;
        if(response.healthRecord){
          $scope.healthRecord = response.healthRecord.data.demographics;
        }
      });

  }]).

  // Schedules Controllers
  controller('AddSchedulesCtrl', ['$rootScope', '$scope', '$http', '$location', '$routeParams', function($rootScope, $scope, $http, $location, $routeParams) {
    $rootScope.title = 'Add new Journal task';
    $scope.form = {start: new Date().getTime()};
    $scope.units = [
      {name: 'Hour(s)', value: 3600},
      {name: 'Day(s)', value: 86400},
      {name: 'Week(s)', value: 604800},
      {name: 'No repeat', value: 0}
    ]
    var today = moment().startOf('day');
    $scope.days = [
      {name: 'Today', value: today.valueOf()},
      {name: 'Tomorrow', value: moment(today).add(1, 'day').valueOf()}
    ].concat(
      [2,3,4,5,6,7].map(function(i){
        var day = moment().startOf('day').add(i, 'day');
        return {name: day.format('ddd, MMM Do'), value: day.valueOf()};
      })
    );
    $scope.virtualForm = {startDate: $scope.days[0], unit: $scope.units[1], value: 1};
    $scope.createSchedule = function() {
      var path = '/api/care_plans/' + $routeParams.id + '/schedules';
      var startDate = moment($scope.virtualForm.startDate.value);

      // THERE MUST BE A BETTER WAY
      var dateFormat = "YYYY-MM-DD"
      var formats = [
        dateFormat + " h:mA",
        dateFormat + " h:ma",
        dateFormat + " h:m a",
        dateFormat + " h:m A",
        dateFormat + " HH:mm"
      ];
      var start = moment(startDate.format(dateFormat) + ' ' + $scope.virtualForm.startTime, formats);

      $scope.form.frequency = parseInt($scope.virtualForm.value) * $scope.virtualForm.unit.value;
      $scope.form.start = start.valueOf();

      $http.post(path, $scope.form).success(function(data) {
        $location.path('/care_plans/' + $routeParams.id );
      });
    };
  }]).
  controller('ShowPatientCtrl', ['$scope', '$http', '$location', '$routeParams', 'carePlansService', function($scope, $http, $location, $routeParams, carePlansService) {
    $scope.form = {patient: {}};

    $scope.updatePatient = function(options){
      if(options && options.email){ $scope.form.patient.sendEmail = true; }
      $http.put('/api/care_plans/' + $routeParams.id, $scope.form).success(function(data) {
        $location.path('/care_plans/'+ $routeParams.id);
        carePlansService.refresh();
     });

    }
    carePlansService.setCurrent($routeParams.id, function(error, carePlan){
      $scope.form.patient = carePlan.patient;
      $scope.invalidEmail = !carePlan.patient.email;
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

    $scope.toggleTask = function(scheduleId, start) {
      $http.put('/api/care_plans/' + $routeParams.carePlanId +
        '/schedules/' + scheduleId +
        '/tasks/' + start +
        '/toggle').success(function(task) {
        $scope.task = task;
      });
    };

  }]);
