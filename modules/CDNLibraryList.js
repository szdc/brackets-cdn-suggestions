/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var Library = require('./CDNLibrary').Library;
  
  /**
   * Represents a list of Library objects hosted by
   * various CDNs.
   */
  function LibraryList() {
    var libraries = [];
    
    /**
     * Gets the matching library from the array if
     * it exists, otherwise a new library object that
     * is added to the array.
     */
    function getLibrary(cdnLibrary) {
      for (var i = 0; i < libraries.length; i++) {
        if (libraries[i].matches(cdnLibrary.name)) {
          return libraries[i];
        }
      }
      libraries.push(new Library(cdnLibrary.name));
      return libraries[libraries.length - 1];
    }
    
    /**
     * Adds the libraries hosted by a CDN to the list.
     */
    function addCDN(name, cdnLibraries) {
      cdnLibraries.forEach(function (lib) {
        var library = getLibrary(lib);
        library.addCDNInfo(name, lib);
      });
    }

    /**
     * Returns the internal array of Library objects.
     */
    function getLibraries() {
      return libraries;
    }
    
    return {
      addCDN:       addCDN,
      getLibraries: getLibraries
    };
  }
  
  exports.LibraryList = LibraryList;
});