(function() {
  "use strict";

  var app = angular.module('typeApp', [
    'ngRoute',
    'appControllers',
    'angular-google-analytics'
  ]);

  app.config(function ($routeProvider){
    $routeProvider.
      when('/layout/:layout/level/:level', {
      templateUrl: 'public/partials/lesson.html',
      controller: 'TyperCtrl'
    }).
      when('/', {
      templateUrl: 'public/partials/home.html',
      controller: 'HomeCtrl'
    }).
      otherwise({
      redirectTo: '/'
    });
  });

  app.config(function (AnalyticsProvider) {
    var ngCookies = angular.injector(['ngCookies']);
    var $cookies  = ngCookies.get('$cookies');
    var userID = $cookies.analyticsID;
    AnalyticsProvider.setAccount('UA-40417328-2', { 'userId': userID });
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
  });

  app.run(function(Analytics) {
    // In case you are relying on automatic page tracking, you need to inject Analytics
    // at least once in your application (for example in the main run() block)
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
