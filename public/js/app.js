'use strict';

angular.module('caretracker', ['caretracker.filters', 'caretracker.services', 'caretracker.directives', 'caretracker.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
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
      otherwise({
        redirectTo: '/events'
      });
    $locationProvider.html5Mode(true);
}]);
