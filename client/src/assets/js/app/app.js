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
      when('/', {
      templateUrl: 'assets/partials/home.html',
      controller: 'HomeCtrl'
    }).
      otherwise({
      redirectTo: '/'
    });
  });

  app.service('appRouter', function($location, $route) {

    this.goToRoot = function() {
      $location.url('/');
    };

    this.goToLayoutLevel = function(layoutName, level) {
      $location.url('/layout/' + layoutName + '/level/' + level);
    };

    this.reload = function() {
      $route.reload();
    };

  });

})();
