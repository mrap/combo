(function() {
  "use strict";

  angular.module('sounds.service', [])
    .service('Sounds', function() {

      var keyboardPressAudio = angular.element('audio#keyboard-press');
      this.playKeyboardPress = function() {
        // Clone it so you can play multiple at once.
        keyboardPressAudio.clone()[0].play();
      };

      var wrongKeyAudio = angular.element('audio#wrong-key');
      this.playWrongKey = function() {
        wrongKeyAudio.clone()[0].play();
      };

      var levelPassedAudio = angular.element('audio#level-passed');
      this.playLevelPassed = function() {
        levelPassedAudio[0].play();
      };

      var levelFailedAudio = angular.element('audio#level-failed');
      this.playLevelFailed = function() {
        levelFailedAudio[0].play();
      };

    });
})();
