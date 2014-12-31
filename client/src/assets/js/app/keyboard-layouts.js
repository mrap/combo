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
      },
      qwerty: {
        topL: "qwerty",
        midL: "asdfg",
        botL: "zxcvb",
        topR: "uiop",
        midR: "hjkl",
        botR: "nm"
      }
    };

    this.layouts = _layouts;

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
    var MIN_LEVEL = 1;
    var MAX_LEVEL = 9;

    function Lesson(chars, minLen, maxLen) {
      this.count = DEFAULT_COUNT;
      this.chars = chars || "";
      this.min_len = minLen || 2;
      this.max_len = maxLen || 2;
    }


    this.levelNumbers = [];
    for (var i = MIN_LEVEL; i <= MAX_LEVEL; i++) {
      this.levelNumbers.push(i);
    }

    this.getLessonParams = function(level, layoutName) {
      var layout = kbLayouts.getLayout(layoutName);
      if (!layout) { return null; }

      switch (parseInt(level)) {
        case 1:
          return new Lesson(layout.midL+layout.midR, 2, 3);
        case 2:
          return new Lesson(layout.midL+layout.midR, 2, 5);
        case 3:
          return new Lesson(layout.midL+layout.midR+layout.topL, 2, 3);
        case 4:
          return new Lesson(layout.midL+layout.midR+layout.topR, 2, 3);
        case 5:
          return new Lesson(layout.midL+layout.midR+layout.topL+layout.topR, 3, 5);
        case 6:
          return new Lesson(layout.midL+layout.midR+layout.botL, 2, 3);
        case 7:
          return new Lesson(layout.midL+layout.midR+layout.botR, 2, 3);
        case 8:
          return new Lesson(layout.midL+layout.midR+layout.botL+layout.botR, 3, 5);
        case 9:
          return new Lesson(layout.midL+layout.midR+layout.topL+layout.topR+layout.botL+layout.botR, 3, 5);
        // TODO: create remaining lessons
        default:
          console.log("No lesson number " + level);
        return null;
      }
    };

  });
})();
