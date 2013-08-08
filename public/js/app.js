'use strict';

var app = angular.module('caretracker', ['caretracker.filters', 'caretracker.services', 'caretracker.directives', 'caretracker.controllers']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    // Care Plans
    when('/care_plans', {
      templateUrl: '/partials/care_plans/index',
      controller: 'IndexCarePlansCtrl'
    }).
    when('/care_plans/add', {
      templateUrl: '/partials/care_plans/new',
      controller: 'AddCarePlanCtrl'
    }).
    when('/care_plans/add_my_plan', {
      templateUrl: '/partials/care_plans/new_patient',
      controller: 'AddPatientCarePlanCtrl'
    }).
    when('/care_plans/:id/verify', {
      templateUrl: '/partials/care_plans/create_verify',
      title: 'Patient invited',
      controller: 'ShowCarePlanCtrl'
    }).
    when('/care_plans/:id/finished', {
      templateUrl: '/partials/care_plans/create_finished',
      controller: 'ShowCarePlanCtrl'
    }).
    when('/care_plans/:id', {
      templateUrl: '/partials/care_plans/show',
      controller: 'ShowCarePlanCtrl'
    }).
    when('/care_plans/:id/care_providers', {
      templateUrl: '/partials/care_providers/index',
      controller: 'IndexCareProvidersCtrl'
    }).
    when('/care_plans/:id/care_providers/new', {
      templateUrl: '/partials/care_providers/new',
      controller: 'AddCareProvidersCtrl'
    }).
    when('/care_plans/:id/schedules/new', {
      templateUrl: '/partials/schedules/new',
      controller: 'AddSchedulesCtrl'
    }).
    when('/care_plans/:carePlanId/schedules/:scheduleId/tasks/:id', {
      templateUrl: '/partials/tasks/edit',
      controller: 'EditTasksCtrl'
    }).
    when('/care_plans/:id/schedules', {
      templateUrl: '/partials/schedules/edit',
      controller: 'EditScheduleCtrl'
    }).
    // when('/care_plans/:id/edit', {
    //   templateUrl: '/partials/care_plans/edit',
    //   controller: 'EditCarePlanCtrl'
    // }).
    // when('/care_plans/:id/delete', {
    //   templateUrl: '/partials/care_plans/destroy_confirm',
    //   controller: 'DeleteCarePlanCtrl'
    // }).

    // Health Record!
    when('/care_plans/:id/health_record', {
      templateUrl: '/partials/health_records/show',
      controller: 'ShowHealthRecordCtrl'
    }).
    otherwise({
      redirectTo: '/care_plans'
    });
  $locationProvider.html5Mode(true);
}]);


/**
 * Updates the page title in the root scope if the route has a title.
 */
app.run(['$location', '$rootScope', function($location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
    if (current.$route) {
      $rootScope.title = current.$route.title || '';
    }
  });
}]);
