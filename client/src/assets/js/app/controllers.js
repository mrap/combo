(function() {
  "use strict";

  var controllers = angular.module('appControllers', [
    'kbLayoutsModule',
    'typingLessonModule'
  ]);

  controllers.controller('MainCtrl', function($rootScope, $scope, kbLayouts, lessonManager) {
    var DEFAULT_LAYOUT = "qwerty";
    var DEFAULT_LEVEL = 1;

    $scope.selectedLevel = DEFAULT_LEVEL;
    $scope.selectedLayout = DEFAULT_LAYOUT;
    $scope.layouts = kbLayouts.layouts;
    $scope.levelNumbers = lessonManager.levelNumbers;

    $rootScope.rootKeyDown = function(e) {
      $rootScope.$broadcast('keydown', e);
    };

    $rootScope.rootKeyPress = function(e) {
      $rootScope.$broadcast('keypress', e);
    };
  });

  controllers.controller('TyperCtrl', function($scope, $location, $routeParams, $http, Lesson, lessonManager) {
    $scope.lesson = new Lesson();
    $scope.selectedLayout = $routeParams.layout;
    $scope.selectedLevel = parseInt($routeParams.level);

    // Update page when layout or level changes
    $scope.$watch('selectedLayout', function(cur, prev) {
      if (cur != prev) {
        reloadLesson();
      }
    });

    $scope.$watch('selectedLevel', function(cur, prev) {
      if (cur != prev) {
        reloadLesson();
      }
    });

    loadCombos();

    function loadCombos() {
      $http.get(
        '/combos',
        { params: lessonManager.getLessonParams($scope.selectedLevel, $scope.selectedLayout) }
      ).success(function(data, status, headers, config) {
        $scope.lesson.start(data.combos);
      }).error(function(data, status, headers, config) {
        console.log("Error requesting /combos");
      });
    }

    function reloadLesson() {
      $location.path("/layout/"+$scope.selectedLayout+"/level/"+$scope.selectedLevel);
    }

  });

})();
