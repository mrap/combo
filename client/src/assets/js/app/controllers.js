(function() {
  "use strict";

  var controllers = angular.module('appControllers', [
    'kbLayoutsModule',
    'typingLessonModule'
  ]);

  controllers.controller('MainCtrl', function($rootScope) {
    $rootScope.rootKeyDown = function(e) {
      $rootScope.$broadcast('keydown', e);
    };

    $rootScope.rootKeyPress = function(e) {
      $rootScope.$broadcast('keypress', e);
    };
  });

  controllers.controller('TyperCtrl', function($scope, $routeParams, $http, Lesson, lessonManager) {
    $scope.layout = $routeParams.layout;
    $scope.level = $routeParams.level;

    $scope.lesson = new Lesson();
    $http.get(
      '/combos',
      { params: lessonManager.getLessonParams($scope.level, $scope.layout) }
    ).success(function(data, status, headers, config) {
      $scope.lesson.start(data.combos);
    }).error(function(data, status, headers, config) {
      console.log("Error requesting /combos");
    });
  });

})();
