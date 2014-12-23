'use strict';

var controllers = angular.module('appControllers', []);

controllers.controller('TyperCtrl', function($scope, $routeParams) {
  $scope.layout = $routeParams.layout;
  $scope.lesson = $routeParams.lesson;
});
