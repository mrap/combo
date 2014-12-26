'use strict';

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
  }
});

kbLayouts.factory('lessonManager', function(kbLayouts){
  var DEFAULT_COUNT = 20;

  function Lesson(chars, maxLen) {
    this.count = DEFAULT_COUNT;
    this.chars = chars || "";
    this.maxLen = maxLen || 2;
  }

  return {
    getLesson: function(lessonNum, layoutName) {
      var layout = kbLayouts.getLayout(layoutName);
      if (!layout) { return null; }

      switch (parseInt(lessonNum)) {
        case 1:
          return new Lesson(layout.midL, 2);
        case 2:
          return new Lesson(layout.midR, 2);
        // TODO: create remaining lessons
        default:
          console.log("No lesson number " + lessonNum);
          return null;
      }
    }
  };
});
