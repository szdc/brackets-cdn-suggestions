/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var GOOGLE_HOSTED_LIBRARIES_URL = 'https://developers.google.com/speed/libraries/devguide',
      REGEX_LIBRARIES = /div.*?>\s*?<dl>([\s\S]+?)<\/dl>/g;
  
  function downloadSource(url) {
    function onload() {
      parseLibraries(this.responseText);
    }
    
    var req = new XMLHttpRequest();
    req.onload = onload;
    req.open('get', url);
    req.send();
  }
  
  function parseLibraries(source) {
    var libraryMatches = source.match(REGEX_LIBRARIES);
  }
  
  downloadSource(GOOGLE_HOSTED_LIBRARIES_URL);
});