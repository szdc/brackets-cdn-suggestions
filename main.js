/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var GOOGLE_HOSTED_LIBRARIES_URL = 'https://developers.google.com/speed/libraries/devguide';
  
  function downloadSource(url) {
    var req = new XMLHttpRequest();
    req.onload = onload;
    req.open('get', url);
    req.send();
    
    function onload() {
      return this.responseText();
    }
  }
  
  var source = downloadSource(GOOGLE_HOSTED_LIBRARIES_URL));
});