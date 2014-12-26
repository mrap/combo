'use strict';

var app = angular.module('typeApp', [
  'ngRoute',
  'appControllers'
]);

app.config(function ($routeProvider){
    $routeProvider.
      when('/layout/:layout/lesson/:lesson', {
        templateUrl: 'assets/partials/lesson.html',
        controller: 'TyperCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
});