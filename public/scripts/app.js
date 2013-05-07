'use strict';

var javascriptApp = angular.module('javascriptApp', [])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    })
    .controller('MainCtrl', function ($scope, Security) {
        $scope.security = Security;
    })
javascriptApp.factory('Security', function ($location) {
    return {
        showLogin: function () {
            this.isSignupShown = false;
            this.isLoginShown = true;
        },
        isLoginShown: false,
        showSignup: function () {
            this.isLoginShown = false;
            this.isSignupShown = true;
        },
        isSignupShown: false,
        login: function (username, password) {
            this.currentUser = {username: username, email: username+"@example.com" };
            this.isLoginShown = false;

        },
        signup: function (username, email, password1, password2) {
            this.currentUser = {username: username, email: email};
            this.isSignupShown = false;
        },
        logout: function () {
            delete this.currentUser;
        },
        isAuthenticated: function () {
            return !!this.currentUser;
        }
    };
});

javascriptApp.directive("login", function () {
    return {
        restrict: "E",
        scope: {},
        replace: true,
        templateUrl: "views/login.html",
        controller: function ($scope, Security) {
            $scope.security = Security;
        },
        link: function (scope) {
        }
    }
});



javascriptApp.directive("loginToolbar", function () {
    return {
        restrict: "E",
        scope: {},
        replace: true,
        templateUrl: "views/login-toolbar.html",
        controller: function ($scope, Security) {
            $scope.security = Security;
        },
        link: function (scope) {
        }
    }
});


javascriptApp.directive("signup", function () {
    return {
        restrict: "E",
        scope: {},
        replace: true,
        templateUrl: "views/signup.html",
        controller: function ($scope, Security) {
            $scope.user = {};
            $scope.security = Security;
        },
        link: function (scope) {
            scope.$watch("user.password", function (value) {
                scope.user.passwordStrength = !value || value.length === 0 ? 0 : typeof zxcvbn !== "undefined" ? zxcvbn(value).score : 0;
            })
        }
    }
});
