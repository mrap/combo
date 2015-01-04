(function() {
  "use strict";

  var _module = angular.module('typingLessonModule', []);

  _module.factory('LevelStates', function() {
    return {
      NotReady: 'NotReady',
      Pre: 'Pre',
      Running: 'Running',
      Post: 'Post'
    };
  });

  _module.factory('Lesson', function(LevelStates) {
    var MIN_PASSING_ACCURACY = 90,
        MIN_PASSING_WPM      = 30;

    function Lesson() {
      this.combos = [];
      this.letterIdx = 0;
      this.comboIdx = 0;
      this.curCombo = "";
      this.curLetter = "";
      this.combosLeft = 0;
      this.state = LevelStates.NotReady;

      // Updated in typingLesson directive
      this.wpm = null;
      this.accuracy = null;
    }

    Lesson.prototype = {
      _updateVars: function() {
        this.curCombo = this.combos[this.comboIdx];
        this.curLetter = this.curCombo[this.letterIdx];
        this.combosLeft = this.combos.length - this.comboIdx;
      },
      loadCombos: function(combos) {
        if (!combos) {
          console.log("Lesson cannot load without any combos!");
          return;
        }

        this.combos = combos;
        this.state = LevelStates.Pre;
      },
      start: function() {
        if (!this.combos) {
          console.log("Lesson cannot start without any combos!");
          return;
        }

        this.letterIdx = 0;
        this.comboIdx = 0;
        this.wpm = null;
        this.accuracy = null;
        this.state = LevelStates.Running;
        this._updateVars();
      },
      next: function() {
        if (++this.letterIdx >= this.curCombo.length) {
          this.letterIdx = 0;
          if (++this.comboIdx >= this.combos.length) {
            this.comboIdx = 0; // prevent from going out of bounds
            this.state = LevelStates.Post;
            this._updateVars();
            return false;
          }
        }
        this._updateVars();
        return true;
      },
      restartCurrent: function() {
        this.letterIdx = 0;
        this._updateVars();
      },
      isPassable: function() {
        return this.accuracy >= MIN_PASSING_ACCURACY && this.wpm >= MIN_PASSING_WPM;
      }
    };

    return Lesson;
  });


  _module.directive('typingLesson', function($timeout, $interval, LevelStates) {

    function link(scope, elem, attrs) {
      var wpmTimer = null;
      var secondsPassed = 0;

      var levelStartWatch = scope.$watch('lesson.state', function(curState) {
        if (curState === LevelStates.Running) {
          if (wpmTimer === null) {
            levelStartWatch(); // deregister watch since level will only begin once
            startWpmTimer();
          }
        }
      });

      function startWpmTimer() {
        wpmTimer = $interval(function() {
          ++secondsPassed;
          scope.lesson.wpm = ((scope.lesson.comboIdx+1) / (secondsPassed / 60)).toFixed(2);
        }, 1000);
      }

      function stopWpmTimer() {
        $interval.cancel(wpmTimer);
        // Reset Defaults
        secondsPassed = 0;
      }

      function correctKey() {
        if (!scope.lesson.next()) {
          stopWpmTimer();
        }
      }

      function wrongKey(actual) {
        var letterNode = getComboElem().children()[scope.lesson.letterIdx];
        var letterElem = angular.element(letterNode);

        // Show actual key pressed in red
        var copyElem = letterElem.clone()
                         .text(actual)
                         .addClass('wrong');

        letterElem.after(copyElem).addClass('hidden');

        scope.lesson.restartCurrent();

        $timeout(function(){
          // Revert to original
          copyElem.detach();
          letterElem.removeClass('hidden');
        }, 200);
      }

      // Track accuracy
      var charCount = 0;
      var wrongCount = 0;

      // Only react to alphabetical keys
      var wrongKeyExp = new RegExp('[a-zA-Z]', 'i');

      var deregKeypress = scope.$on('keypress', function(e, kd) {
        var key = String.fromCharCode(kd.charCode || kd.keyCode);

        if (scope.lesson.state != LevelStates.Running || !wrongKeyExp.test(key)) {
          return;
        }

        if (key === scope.lesson.curLetter) {
          correctKey();
        } else {
          wrongKey(key);
          ++wrongCount;
        }

        // Update Accuracy
        var correctCount = ++charCount - wrongCount;
        scope.lesson.accuracy = (correctCount / charCount * 100).toFixed(2);
      });

      // Clean up
      scope.$on('$destroy', function() {
        deregKeypress();
        stopWpmTimer();
      });

      // Cache comboElem
      var _comboElem = null;
      function getComboElem() {
        if (_comboElem) { return _comboElem; }
        _comboElem = elem.find('current-combo');
        return _comboElem;
      }
    }

    return {
      restrict: 'E',
      scope: {
        lesson: '='
      },
      link: link
    };
  });

  _module.directive('animateCombo', function() {
    function link(scope, elem, attrs) {
      elem.addClass('animated');

      scope.$watch('comboIndex', function(newIdx, oldIdx) {
        elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          elem.removeClass('fadeInUp');
        });
        elem.addClass('fadeInUp');
      });
    }

    return {
      restrict: 'A',
      scope: {
        comboIndex: '=animateCombo'
      },
      link: link
    };
  });

  _module.directive('backspaceToastTip', function($document) {
    function link(scope, elem, attr) {

      var toggleTip = function() {
        toast(scope.toastTipText, 3000);
      };

      $document.bind('backspaceKeyDown', toggleTip);

      scope.$on('$destroy', function() {
        $document.unbind('backspaceKeyDown', toggleTip);
      });
    }

    return {
      restrict: 'E',
      scope: {
        toastTipText: '@'
      },
      link: link
    };
  });
})();
