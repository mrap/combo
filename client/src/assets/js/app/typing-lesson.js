(function() {
  "use strict";

  var _module = angular.module('typingLessonModule', []);

  _module.factory('Lesson', function() {

    function Lesson() {
      this.combos = [];
      this.letterIdx = 0;
      this.comboIdx = 0;
      this.curCombo = "";
      this.curLetter = "";
      this.combosLeft = 0;
      this.wpm = null;
    }

    Lesson.prototype = {
      _updateVars: function() {
        this.curCombo = this.combos[this.comboIdx];
        this.curLetter = this.curCombo[this.letterIdx];
        this.combosLeft = this.combos.length - this.comboIdx;
      },
      start: function(combos) {
        this.combos = combos;
        this.letterIdx = 0;
        this.comboIdx = 0;
        this.wpm = null;
        this._updateVars();
      },
      next: function() {
        if (++this.letterIdx >= this.curCombo.length) {
          this.letterIdx = 0;
          if (++this.comboIdx >= this.combos.length) {
            this.comboIdx = 0;
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
      }
    };

    return Lesson;
  });


  _module.directive('typingLesson', function($timeout, $interval) {

    function link(scope, elem, attrs) {
      scope.isLevelComplete = false;

      var wpmTimer = null;
      var secondsPassed = 0;

      function startWpmTimer() {
        wpmTimer = $interval(function() {
          ++secondsPassed;
          scope.lesson.wpm = ((scope.lesson.comboIdx+1) / 60 * secondsPassed).toFixed(2);
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
          scope.isLevelComplete = true;
        }
      }

      var wrongKeyExp = new RegExp('[a-zA-Z]', 'i');
      function wrongKey(actual) {
        // Only change ui if actual key is alphabetical
        if (!wrongKeyExp.test(actual)) {
          return;
        }

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
        }, 500);
      }

      var deregKeypress = scope.$on('keypress', function(e, kd) {
        if (scope.isLevelCompelete) { return; }
        var key = String.fromCharCode(kd.charCode || kd.keyCode);

        if (key === scope.lesson.curLetter) {
          correctKey();
        } else {
          wrongKey(key);
        }
        if (wpmTimer === null) {
          startWpmTimer();
        }
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
        lesson: '=',
        isLevelComplete: '=levelCompleted'
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
        if (scope.toastTipEnabled) {
          toast(scope.toastTipText, 3000, '', function() {
          });
        }
      };

      $document.bind('backspaceKeyDown', toggleTip);

      scope.$on('$destroy', function() {
        $document.unbind('backspaceKeyDown', toggleTip);
      });
    }

    return {
      restrict: 'E',
      scope: {
        toastTipEnabled: '=',
        toastTipText: '@'
      },
      link: link
    };
  });
})();
