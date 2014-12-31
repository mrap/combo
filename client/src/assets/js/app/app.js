(function() {
  "use strict";

  var app = angular.module('typeApp', [
    'ngRoute',
    'appControllers'
  ]);

  app.config(function ($routeProvider){
    $routeProvider.
      when('/layout/:layout/level/:level', {
      templateUrl: 'assets/partials/lesson.html',
      controller: 'TyperCtrl'
    }).
      otherwise({
      redirectTo: '/layout/qwerty/level/1'
    });
  });
})();
