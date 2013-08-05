'use strict';
angular.module('caretracker', ['caretracker.filters', 'caretracker.services', 'caretracker.directives', 'caretracker.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
      when('/care_plans/:id/verify', {
        templateUrl: '/partials/care_plans/create_verify',
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
      // Events
      when('/events', {
        templateUrl: '/partials/events/index',
        controller: 'IndexEventsCtrl'
      }).
      when('/events/add', {
        templateUrl: '/partials/events/new',
        controller: 'AddEventCtrl'
      }).
      when('/events/:id', {
        templateUrl: '/partials/events/show',
        controller: 'ShowEventCtrl'
      }).
      when('/events/:id/edit', {
        templateUrl: '/partials/events/edit',
        controller: 'EditEventCtrl'
      }).
      when('/events/:id/delete', {
        templateUrl: '/partials/events/destroy_confirm',
        controller: 'DeleteEventCtrl'
      }).
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
