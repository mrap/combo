(function() {
  "use strict";

  var userModule = angular.module('userModule', [
    'kbLayoutsModule'
  ]);

  userModule.factory('User', function(kbLayouts) {

    function User() {
      this.layout = null;
      this.layoutMaxLevel = {};

      this.setLayout('qwerty');
    }

    User.prototype = {
      setLayout: function(layoutName) {
        var _layout = kbLayouts.getLayout(layoutName);
        if (!_layout) {
          console.log("Unable to set user layout");
          return;
        }

        this.layout = _layout;

        if (!this.layoutMaxLevel[layoutName]) {
          this.layoutMaxLevel[layoutName] = 1;
        }
      },
      setMaxLayoutLevel: function(layoutName, level) {
        this.layoutMaxLevel[layoutName] = level;
      },
      getMaxLayoutLevel: function(layoutName) {
        return this.layoutMaxLevel[layoutName];
      },
      setCurrentMaxLayoutLevel: function(level) {
        this.setMaxLayoutLevel(this.layout.name, level);
      }
    };

    return User;
  });

})();
