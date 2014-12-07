/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var HTMLUtils = brackets.getModule('language/HTMLUtils');
  
  function CDNHints(cdnLibraries) {
    this.libraries = cdnLibraries;
  }
  
  CDNHints.prototype.hasHints = function (editor, implicitChar) {
    return false;
  }
  
  CDNHints.prototype.getHints = function (implicitChar) {
    return null;
  }
  
  CDNHints.prototype.insertHint = function (hint) {

  }

  exports.CDNHints = CDNHints;
});