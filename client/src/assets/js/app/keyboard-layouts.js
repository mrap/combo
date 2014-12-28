(function() {
  "use strict";

  var kbLayouts = angular.module('kbLayoutsModule', []);

  kbLayouts.service('kbLayouts', function(){
    var _layouts = {
      colemak: {
        topL: "qwfpg",
        midL: "arstd",
        botL: "zxcvb",
        topR: "jluy",
        midR: "hneio",
        botR: "km"
      }
    };

    this.getLayout = function(layoutName) {
      var layout = _layouts[layoutName];
      if (!layout) {
        console.log("No layout named " + layoutName);
        return null;
      }
      return layout;
    };
  });

  kbLayouts.service('lessonManager', function(kbLayouts){
    var DEFAULT_COUNT = 20;

    function Lesson(chars, maxLen) {
      this.count = DEFAULT_COUNT;
      this.chars = chars || "";
      this.max_len = maxLen || 2;
    }

    this.getLessonParams = function(level, layoutName) {
      var layout = kbLayouts.getLayout(layoutName);
      if (!layout) { return null; }

      switch (parseInt(level)) {
        case 1:
          return new Lesson(layout.midL, 2);
        case 2:
          return new Lesson(layout.midR, 2);
        // TODO: create remaining lessons
        default:
          console.log("No lesson number " + level);
        return null;
      }
    };

  });
})();
