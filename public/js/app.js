'use strict';

angular.module('caretracker', ['caretracker.filters', 'caretracker.services', 'caretracker.directives', 'caretracker.controllers']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/events', {
        templateUrl: 'partials/events/index',
        controller: 'IndexEventsCtrl'
      }).
      when('/events/add', {
        templateUrl: 'partials/events/new',
        controller: 'AddEventCtrl'
      }).
      when('/events/:id', {
        templateUrl: 'partials/events/show',
        controller: 'ShowEventCtrl'
      }).
      when('/events/:id/edit', {
        templateUrl: 'partials/events/edit',
        controller: 'EditEventCtrl'
      }).
      when('/event/:id/delete', {
        templateUrl: 'partials/events/destroy_confirm',
        controller: 'DeleteEventCtrl'
      }).
      otherwise({
        redirectTo: '/events'
      });
    $locationProvider.html5Mode(true);
}]);


// var javascriptApp = angular.module('javascriptApp', [])
//     .config(function ($routeProvider, $locationProvider) {
//         $routeProvider
//             .when('/', {
//                 templateUrl: 'views/main.html',
//                 controller: 'MainCtrl'
//             })
//             .when('/account', {
//                 templateUrl: 'views/account.html',
//                 controller: 'MainCtrl'
//             })
//             .otherwise({
//                 redirectTo: '/'
//             });
//         $locationProvider.html5Mode(true);
//     })
//     .controller('MainCtrl', function ($scope, Security) {
//         $scope.security = Security;
//     })

// javascriptApp.factory('Security', function ($location) {
//     return {
//         showLogin: function () {
//             this.isSignupShown = false;
//             this.isLoginShown = true;
//         },
//         isLoginShown: false,
//         showSignup: function () {
//             this.isLoginShown = false;
//             this.isSignupShown = true;
//         },
//         isSignupShown: false,
//         login: function (username, password) {
//             this.currentUser = {username: username, email: username+"@example.com" };
//             this.isLoginShown = false;
//         },
//         signup: function (username, email, password1, password2) {
//             this.currentUser = {username: username, email: email};
//             this.isSignupShown = false;
//         },
//         logout: function () {
//             delete this.currentUser;
//         },
//         isAuthenticated: function () {
//             return !!this.currentUser;
//         }
//     };
// });


