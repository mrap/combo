// Globally disables backspace button unless within a input or textarea
// Source: http://www.technicaladvices.com/2012/07/16/preventing-backspace-from-navigating-back-in-all-the-browsers/
(function() {
  "use strict";

  var backspaceKeyDown = new Event('backspaceKeyDown');

  document.onkeydown = function (event) {

    if (!event) { /* This will happen in IE */
      event = window.event;
    }

    var keyCode = event.keyCode;

    if (keyCode == 8 &&
        ((event.target || event.srcElement).tagName != "TEXTAREA") &&
          ((event.target || event.srcElement).tagName != "INPUT")) {

      if (navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
        event.stopPropagation();
      } else {
        alert("prevented");
        event.returnValue = false;
      }

      document.dispatchEvent(backspaceKeyDown);

      return false;
    }
  };

})();
