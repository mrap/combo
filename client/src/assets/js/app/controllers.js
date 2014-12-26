'use strict';

var controllers = angular.module('appControllers', [
  'kbLayoutsModule'
]);

controllers.controller('TyperCtrl', function($scope, $routeParams, lessonManager) {
  $scope.layout = $routeParams.layout;
  $scope.lesson = $routeParams.lesson;
});
