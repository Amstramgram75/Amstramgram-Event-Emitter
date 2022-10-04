(function () {
  'use strict';
  (function(){
    //https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    if (typeof window.CustomEvent !== "function") {
      function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
       }
      window.CustomEvent = CustomEvent;
    }
  })();
}());
