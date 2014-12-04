/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  // Modules
  require('modules/DOMParser');
  var Library = require('modules/Library');
  
  // Constants
  var GOOGLE_HOSTED_LIBRARIES_URL = 'https://developers.google.com/speed/libraries/devguide',
      SELECTOR_LIBRARIES = 'div[itemprop=articleBody] > div[id]';
  
  // Fields
  var libraries = [];
  
  /**
   * Downloads and parses the Google Hosted Libraries webpage.
   */
  function downloadSource(url) {
    function onload() {
      var parser    = new DOMParser();
      var document  = parser.parseFromString(this.responseText, 'text/html');
      var libElements = document.body.querySelectorAll(SELECTOR_LIBRARIES);
      
      for (var i = 0; i < libElements.length; i++) {
        var element = libElements[i],
            library = Library.fromElement(element);
      
        if (library !== null) {
          libraries.push(library);
        }
      }
    }
    
    var req = new XMLHttpRequest();
    req.onload = onload;
    req.open('get', url);
    req.overrideMimeType('text/html; charset=x-user-defined');
    req.send();
  }
  
  downloadSource(GOOGLE_HOSTED_LIBRARIES_URL);
});