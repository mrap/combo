(function() {
  "use strict";

  var userModule = angular.module('userModule', [
    'kbLayoutsModule',
    'ngCookies'
  ]);

  userModule.factory('User', function($cookies, kbLayouts) {

    function User() {
      this.uid = $cookies.analyticsID;
      this.layout = null;
      this.layoutMaxLevel = {};
      if ($cookies.UserLevelProgress) {
        this.layoutMaxLevel = JSON.parse($cookies.UserLevelProgress);
      }

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
        $cookies.UserLevelProgress = JSON.stringify(this.layoutMaxLevel);
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
