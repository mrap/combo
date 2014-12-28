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

  _module.directive('typingLesson', function() {

    function link(scope, elem, attrs) {

      scope.$on('keypress', function(e, kd) {
        var key = String.fromCharCode(kd.keyCode);

        if (key === scope.lesson.curLetter) {
          if (!scope.lesson.next()) {
            console.log("Completed!");
          }
        } else {
          scope.lesson.restartCurrent();
        }
      });

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
