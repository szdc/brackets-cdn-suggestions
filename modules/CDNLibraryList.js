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
    var libraries    = [],
        libraryNames = [];
    
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
      if (
        typeof cdnLibrary.mainfile === 'undefined' ||
        cdnLibrary.mainfile.length === 0
      ) {
        return null;
      } else {
        libraries.push(new Library(cdnLibrary.name));
        return libraries[libraries.length - 1];
      }
    }
    
    /**
     * Adds the libraries hosted by a CDN to the list.
     *
     * @param name {String}
     * The name of the CDN to add.
     *
     * @param cdnLibraries {Array}
     * An array of libraries from the jsDeliver API.
     */
    function addCDN(name, cdnLibraries) {
      cdnLibraries.forEach(function (lib) {
        var library = getLibrary(lib);
        if (library) {
          library.addCDNInfo(name, lib);
        }
      });
      libraries.sort(Library.compareIds);
      updateLibraryNames();
    }
    
    function updateLibraryNames() {
      libraryNames = libraries.map(function (library) {
        return library.getName();
      });
    }
    
    /**
     * Returns the library with the id given,
     * or null if none was found.
     *
     * @param {String} id
     * The id of the library
     */
    function findById(id) {
      for (var i = 0; i < libraries.length; i++) {
        var library = libraries[i];
        if (library.getId() === id) {
          return library;
        }
      }
      return null;
    }
    
    /**
     * Returns the library with the name given,
     * or null if none was found.
     *
     * @param {String} name
     * The id of the library
     */
    function findByName(name) {
      for (var i = 0; i < libraries.length; i++) {
        var library = libraries[i];
        if (library.getName() === name) {
          return library;
        }
      }
      return null;
    }
    
    function getLibraryNames() {
      return libraryNames;
    }
    
    return {
      addCDN:          addCDN,
      findById:        findById,
      findByName:      findByName,
      getLibraryNames: getLibraryNames
    };
  }
  
  exports.LibraryList = LibraryList;
});