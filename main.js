/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  // Brackets modules
  var CodeHintManager = brackets.getModule('editor/CodeHintManager'),
      ExtensionUtils  = brackets.getModule('utils/ExtensionUtils');
  
  // Extension modules
  var CDNHintProvider = require('modules/CDNHintProvider').CDNHintProvider,
      LibraryList     = require('modules/CDNLibraryList').LibraryList,
      API             = require('modules/jsdelivrAPI'),
      CDNs            = JSON.parse(require('text!modules/CDNs.json'));
  
  /**
   * Downloads libraries from the specified array
   * of CDNs.
   */
  function downloadLibraries(cdns, callback) {
    var libraryList = new LibraryList(),
        cdnResponses = 0;
    
    cdns.forEach(function (cdn) {
      API.getLibraries(cdn.name, function (err, libraries) {
        if (err) {
          console.log(err);
        } else {
          libraryList.addCDN(cdn.name, libraries);
        }
        
        cdnResponses++;
        console.log('Downloaded', cdnResponses, 'of', cdns.length, 'CDNs.');
        if (cdnResponses === cdns.length) {
          callback(libraryList);
        }
      });
    });
  }
  
  /**
   * Registers a hint provider for the extension.
   */
  function registerHintProvider(libraryList) {
    console.log('Total libraries: ' + libraryList.getLibraryNames().length);
    var cdnHintProvider = new CDNHintProvider(libraryList);
    CodeHintManager.registerHintProvider(cdnHintProvider, ['html'], 10);
  }
  
  downloadLibraries(CDNs, registerHintProvider);
});