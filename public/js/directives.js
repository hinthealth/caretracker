'use strict';

/* Directives */


angular.module('caretracker.directives', []).
  directive('eatClick', function() {
    return function(scope, element, attrs) {
      console.log('eating click...');
      $(element).click(function(event) {
        event.preventDefault();
      });
    }
  }).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
