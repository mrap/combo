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
    }

    Lesson.prototype = {
      _updateVars: function() {
        this.curCombo = this.combos[this.comboIdx];
        this.curLetter = this.curCombo[this.letterIdx];
      },
      start: function(combos) {
        this.combos = combos;
        this.letterIdx = 0;
        this.comboIdx = 0;
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


  _module.directive('typingLesson', function($timeout) {

    function link(scope, elem, attrs) {

      function correctKey() {
        if (!scope.lesson.next()) {
          console.log("Completed!");
        }
      }

      function wrongKey(actual) {
        var letterNode = getComboElem().children()[scope.lesson.letterIdx];
        var letterElem = angular.element(letterNode);

        letterElem.addClass('wrong');
        scope.lesson.restartCurrent();

        $timeout(function(){
          letterElem.removeClass('wrong');
        }, 500);
      }

      var deregKeypress = scope.$on('keypress', function(e, kd) {
        var key = String.fromCharCode(kd.keyCode);

        if (key === scope.lesson.curLetter) {
          correctKey();
        } else {
          wrongKey(key);
        }
      });

      // Clean up
      scope.$on('$destroy', function() {
        deregKeypress();
      });

      // Cache comboElem
      var _comboElem = null;
      function getComboElem() {
        if (_comboElem) { return _comboElem; }

        var children = elem.children();

        for (var i = 0; i < children.length; i++) {
          var child = angular.element(children[i]);
          if (child.hasClass('current-combo')) {
            _comboElem = child;
            return _comboElem;
          }
        }
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
})();