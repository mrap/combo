(function() {
  "use strict";

  angular.module('sounds.service', ['ngAudio'])
    .service('Sounds', function(ngAudio) {

      function RepeatableAudioElement(id) {
        var cloneCount = 10;
        var audioSrc = angular.element(id).attr('src');

        this.audios = [];
        for (var i = 0; i < cloneCount; i++) {
          var sound = ngAudio.load(audioSrc);
          this.audios.push(sound);
        }

        this.i = 0;
      }

      RepeatableAudioElement.prototype.play = function play() {
        var a = this.audios[this.i];

        // We might be trying to play a sound that's already playing.
        a.currentTime = 0;
        a.play();

        if (++this.i >= this.audios.length) this.i = 0;
      };

      var keyboardPressAudio = new RepeatableAudioElement('audio#keyboard-press');
      this.playKeyboardPress = keyboardPressAudio.play.bind(keyboardPressAudio);

      var wrongKeyAudio = new RepeatableAudioElement('audio#wrong-key');
      this.playWrongKey = wrongKeyAudio.play.bind(wrongKeyAudio);

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
