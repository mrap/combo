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

  controllers.controller('TyperCtrl', function($scope, $routeParams, Lesson) {
    $scope.layout = $routeParams.layout;
    $scope.lesson = $routeParams.lesson;

    $scope.lesson = new Lesson();
    $scope.lesson.start(["abc", "xyz"]);

    $scope.$on('keypress', function(e, kd) {
      var key = String.fromCharCode(kd.keyCode);

      if (key === $scope.lesson.curLetter) {
        if (!$scope.lesson.next()) {
          console.log("Completed!");
        }
      } else {
        $scope.lesson.restartCurrent();
      }
    });
  });

})();
