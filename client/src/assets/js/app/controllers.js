(function() {
  "use strict";

  var controllers = angular.module('appControllers', [
    'kbLayoutsModule',
    'typingLessonModule'
  ]);

  controllers.controller('MainCtrl', function($rootScope, $scope, kbLayouts, levelManager) {
    var DEFAULT_LAYOUT = "qwerty";
    var DEFAULT_LEVEL = 1;

    $scope.selectedLevel = DEFAULT_LEVEL;
    $scope.selectedLayout = DEFAULT_LAYOUT;
    $scope.layouts = kbLayouts.layouts;
    $scope.levelNumbers = levelManager.levelNumbers;

    $rootScope.rootKeyDown = function(e) {
      $rootScope.$broadcast('keydown', e);
    };

    $rootScope.rootKeyPress = function(e) {
      $rootScope.$broadcast('keypress', e);
    };
  });

  controllers.controller('HomeCtrl', function($scope, $location) {
    var SPACE_KEYCODE = 13;

    $scope.$on('keypress', function(e, kp) {
      var key = kp.charCode || kp.keyCode;
      if (key === SPACE_KEYCODE) {
        $location.url('/layout/qwerty/level/1');
      }
    });
  });

  controllers.controller('TyperCtrl', function($scope, $location, $routeParams, $http, Lesson, levelManager, LevelStates) {
    $scope.lesson = new Lesson();
    $scope.selectedLayout = $routeParams.layout;
    $scope.selectedLevel = parseInt($routeParams.level);
    $scope.levelNumbers = [];
    $scope.LevelStates = LevelStates;

    // Update page when layout or level changes
    $scope.$watch('selectedLayout', function(cur, prev) {
      if (cur != prev) {
        changeLevel();
      }
    });

    $scope.$watch('selectedLevel', function(cur, prev) {
      if (cur != prev) {
        changeLevel();
      }
    });

    function keypressEnterOnce(callback) {
      var deregEnter = $scope.$on('keypress', function(e, kd) {
        var key = kd.charCode || kd.keyCode;
        if (key === 13) {
          deregEnter();
          callback();
        }
      });
    }

    $scope.$watch('lesson.state', function(curState) {
      switch (curState) {
        case LevelStates.Pre:
          keypressEnterOnce(function() {
            $scope.lesson.start();
          });
          break;
        case LevelStates.Post:
          keypressEnterOnce(function() {
            $scope.selectedLevel++;
          });
          break;
      }
    });

    loadCombos();

    function loadCombos() {
      var levelParams = levelManager.getLevelParams($scope.selectedLevel, $scope.selectedLayout);
      // If no level params, go back to lesson 1
      if (!levelParams) {
        changeLevel(1);
        return;
      }

      $http.get(
        '/combos',
        { params: levelParams }
      ).success(function(data, status, headers, config) {
        updateLevelNumbers();
        $scope.lesson.loadCombos(data.combos);
      }).error(function(data, status, headers, config) {
        console.log("Error requesting /combos");
      });
    }

    function updateLevelNumbers() {
      var total = levelManager.layoutLevels[$scope.selectedLayout].length;
      var numArr = [];
      for (var i = total; i > 0; --i) {
        numArr[i-1] = i;
      }
      $scope.levelNumbers = numArr;
    }

    function changeLevel(level) {
      $location.url('/layout/' + $scope.selectedLayout + '/level/' + (level || $scope.selectedLevel));
    }

  });

})();
