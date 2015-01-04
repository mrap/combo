(function() {
  "use strict";

  var userModule = angular.module('userModule', [
    'kbLayoutsModule',
    'ngCookies'
  ]);

  userModule.factory('User', function($cookies, $http, kbLayouts) {

    function User() {
      this.uid = $cookies.analyticsID;
      this.layout = null;
      this.layoutMaxLevel = {};
      if ($cookies.UserLevelProgress) {
        var decoded = atob($cookies.UserLevelProgress);
        this.layoutMaxLevel = JSON.parse(decoded);
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
        var url = '/users/' + this.uid + '/level_progress';
        $http.put(
          url,
          this.layoutMaxLevel
        ).success(function(data, status, headers, config) {

        }).error(function(data, status, headers, config) {
          console.log("Error:", url, status, data);
        });
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
