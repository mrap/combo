(function() {
  "use strict";

  var controllers = angular.module('appControllers', [
    'kbLayoutsModule',
    'typingLessonModule',
    'userModule'
  ]);

  controllers.controller('MainCtrl', function($rootScope, $scope, User) {
    $scope.currentUser = new User();

    $rootScope.rootKeyDown = function(e) {
      $rootScope.$broadcast('keydown', e);
    };

    $rootScope.rootKeyPress = function(e) {
      $rootScope.$broadcast('keypress', e);
    };
  });

  controllers.controller('HomeCtrl', function($scope, appRouter) {
    var ENTER_KEYCODE = 13;

    $scope.$on('keypress', function(e, kp) {
      var key = kp.charCode || kp.keyCode;
      if (key === ENTER_KEYCODE) {
        var layout = $scope.currentUser.layout.name;
        appRouter.goToLayoutLevel(layout, $scope.currentUser.getMaxLayoutLevel(layout));
      }
    });
  });

  controllers.controller('TyperCtrl', function($scope, $routeParams, $http, appRouter, Lesson, levelManager, LevelStates, kbLayouts) {
    $scope.currentUser.setLayout($routeParams.layout);
    $scope.selectedLevel = parseInt($routeParams.level);
    // Guard route
    var _maxLayoutLevel = $scope.currentUser.getMaxLayoutLevel($scope.currentUser.layout.name);
    if (_maxLayoutLevel < $scope.selectedLevel) {
      appRouter.goToLayoutLevel($scope.currentUser.layout.name, _maxLayoutLevel);
      return;
    }

    (function updateLevelNumbers() {
      $scope.levelNumbers = [];
      for (var i = _maxLayoutLevel; i > 0; --i) {
        $scope.levelNumbers[i-1] = i;
      }
    })();

    $scope.lesson = new Lesson();
    $scope.LevelStates = LevelStates;
    $scope.layouts = kbLayouts.layouts;

    // Update page when layout or level changes
    $scope.$watch('currentUser.layout.name', function(cur, prev) {
      if (cur != prev) {
        changeLevel();
      }
    });

    $scope.$watch('selectedLevel', function(cur, prev) {
      if (cur != prev) {
        changeLevel();
      }
    });

    function keypressROnce(callback) {
      var dereg = $scope.$on('keypress', function(e, kd) {
        var keyCode = kd.charCode || kd.keyCode;
        if (String.fromCharCode(keyCode) === 'r') {
          dereg();
          callback();
        }
      });
    }

    function keypressEnterOnce(callback) {
      var deregEnter = $scope.$on('keypress', function(e, kd) {
        var key = kd.charCode || kd.keyCode;
        if (key === 13) {
          deregEnter();
          callback();
        }
      });
    }

    $scope.userPrevPassedLevel = _maxLayoutLevel > $scope.selectedLevel;

    $scope.didUserPass = function() {
      return $scope.userPrevPassedLevel || $scope.lesson.isPassable();
    };

    $scope.$watch('lesson.state', function(curState) {
      switch (curState) {
        case LevelStates.Pre:
          keypressEnterOnce(function() {
            $scope.lesson.start();
          });
          break;

        case LevelStates.Post:
          // 'r' reloads level
          keypressROnce(function() {
            appRouter.reload();
          });

          if ($scope.didUserPass()) {
            var nextLevel = $scope.selectedLevel+1;
            // if user passes last level
            if (nextLevel > levelManager.layoutLevels[$scope.currentUser.layout.name].length) {
              appRouter.goToRoot();
            } else {
              // increment user max level
              $scope.currentUser.setCurrentMaxLayoutLevel(nextLevel);

              keypressEnterOnce(function() {
                changeLevel(nextLevel);
              });
            }
          }
          break;
      }
    });

    loadCombos();

    function loadCombos() {
      var levelParams = levelManager.getLevelParams($scope.selectedLevel, $scope.currentUser.layout.name);
      // If no level params, go back to lesson 1
      if (!levelParams) {
        changeLevel(1);
        return;
      }

      $http.get(
        '/combos',
        { params: levelParams }
      ).success(function(data, status, headers, config) {
        $scope.lesson.loadCombos(data.combos);
      }).error(function(data, status, headers, config) {
        console.log("Error requesting /combos");
      });
    }

    function changeLevel(level) {
      appRouter.goToLayoutLevel($scope.currentUser.layout.name, (level || $scope.selectedLevel));
    }

  });

})();
