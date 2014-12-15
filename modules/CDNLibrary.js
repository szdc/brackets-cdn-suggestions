/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  /**
   * Represents a JS/CSS library.
   */
  function Library(libraryName) {
    var id = normalizeName(libraryName),
        name = libraryName,
        cdns = [],
        versions = [];
    
    /**
     * Returns a name with only its alphanumeric characters.
     */
    function normalizeName(libName) {
      return libName.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    
    /**
     * Adds the versions supported by a CDN to the array.
     *
     * @param cdn {String}
     * The name of the CDN that hosts this library.
     *
     * @param cdnLibrary {Object}
     * An object that represents the JSON response from a
     * jsDelivr API library query.
     */
    function addCDNInfo(cdnName, cdnLibrary) {
      if (cdns.indexOf(cdnName) === -1) {
        cdns[cdnName] = cdnLibrary.mainfile;
      }
      
      cdnLibrary.versions.forEach(function (version) {
        if (versions.indexOf(version) === -1) {
          versions.push(version);
        }
      });
      
      versions.sort();
    }
    
    /**
     * Determines if two libraries share the same name.
     */
    function matches(library) {
      return name === library.name;
    }
    
    return {
      matches: matches,
      addCDNInfo: addCDNInfo
    };
  }
  
  exports.Library = Library;
});