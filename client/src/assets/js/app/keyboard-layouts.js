(function() {
  "use strict";

  var kbLayouts = angular.module('kbLayoutsModule', []);

  kbLayouts.service('kbLayouts', function(){
    var _layouts = {
      colemak: {
        name: "colemak",
        topL: "qwfpg",
        topR: "jluy",
        midL: "arstd",
        midR: "hneio",
        botL: "zxcvb",
        botR: "km"
      },
      dvorak: {
        name: "dvorak",
        topL: "py",
        topR: "fgcrl",
        midL: "aoeui",
        midR: "dhtns",
        botL: "qjkxb",
        botR: "mwvz"
      },
      qwerty: {
        name: "qwerty",
        topL: "qwert",
        topR: "yuiop",
        midL: "asdfg",
        midR: "hjkl",
        botL: "zxcvb",
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

  kbLayouts.service('levelManager', function(kbLayouts){
    this.layoutLevels = {};

    // Takes a level parameter that is min level 1
    this.getLevelParams = function(level, layoutName) {
      var levelNum = parseInt(level)-1; // actual array is 0 indexed
      // Check if already cached
      if (this.layoutLevels[layoutName]) {
        return this.layoutLevels[layoutName][levelNum];
      }

      // Verify layout exists
      var l = kbLayouts.getLayout(layoutName);
      if (!l) { return null; }

      // Build layout's levels
      this.layoutLevels[layoutName] = [
        // Home row
        new Level(2, 3, [l.midL, l.midR]),
        new Level(3, 4, [l.midL, l.midR]),
        new Level(2, 6, [l.midL, l.midR]),
        // home row + top left
        new Level(2, 3, [l.midL, l.midR, l.topL]),
        new Level(3, 4, [l.midL, l.midR, l.topL]),
        new Level(2, 6, [l.midL, l.midR, l.topL]),
        // home row + top right
        new Level(2, 3, [l.midL, l.midR, l.topR]),
        new Level(3, 4, [l.midL, l.midR, l.topR]),
        new Level(2, 6, [l.midL, l.midR, l.topR]),
        // home + top rows
        new Level(2, 3, [l.midL, l.midR, l.topL, l.topR]),
        new Level(3, 4, [l.midL, l.midR, l.topL, l.topR]),
        new Level(2, 6, [l.midL, l.midR, l.topL, l.topR]),
        // home row + bottom left
        new Level(2, 3, [l.midL, l.midR, l.botL]),
        new Level(3, 4, [l.midL, l.midR, l.botL]),
        new Level(2, 6, [l.midL, l.midR, l.botL]),
        // home row + bottom right
        new Level(2, 3, [l.midL, l.midR, l.botR]),
        new Level(3, 4, [l.midL, l.midR, l.botR]),
        new Level(2, 6, [l.midL, l.midR, l.botR]),
        // home + bottom rows
        new Level(2, 3, [l.midL, l.midR, l.botL, l.botR]),
        new Level(3, 4, [l.midL, l.midR, l.botL, l.botR]),
        new Level(2, 6, [l.midL, l.midR, l.botL, l.botR]),
        // all rows
        new Level(2, 3, [l.midL, l.midR, l.topL, l.topR, l.botL, l.botR]),
        new Level(3, 4, [l.midL, l.midR, l.topL, l.topR, l.botL, l.botR]),
        new Level(2, 6, [l.midL, l.midR, l.topL, l.topR, l.botL, l.botR])
      ];

      return this.layoutLevels[layoutName][levelNum];
    };

    var DEFAULT_COUNT = 20;

    function Level(minLen, maxLen, charGroups) {
      this.count = DEFAULT_COUNT;
      this.min_len = minLen || 2;
      this.max_len = maxLen || 2;

      this.chars = '';
      charGroups.forEach(function(chars) {
        this.chars += chars;
      }, this);
    }

  });
})();
