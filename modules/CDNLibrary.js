/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';

  var CDNs = JSON.parse(require('text!modules/CDNs.json'));
  var TAGS = {
    SCRIPT: '<script src="{url}"></script>',
    CSS:    '<link rel="stylesheet" href="{url}" />'
  };

  /**
   * Represents a JS/CSS library.
   */
  function Library(libraryName) {
    var id          = normalizeName(libraryName),
        name        = libraryName,
        tag         = '',
        libraryType = '',
        cdns        = [],
        versions    = [];

    /**
     * Returns a name with only its alphanumeric characters
     * converted to lowercase.
     * Essential because each CDN could have a slightly different
     * name for the same library, for example:
     * angular.js, angularjs, AngularJS, Angular JS
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
      if (cdns.length === 0) {
        libraryType = parseLibraryType(cdnLibrary.mainfile || cdnLibrary.name);
        tag = libraryType === 'script' ? TAGS.SCRIPT : TAGS.CSS;
      }
      
      cdns.push(new CDNInfo(
        cdnName,
        cdnLibrary.name,
        cdnLibrary.mainfile, 
        cdnLibrary.versions
      ));
      
      cdnLibrary.versions.forEach(function (version) {
        if (versions.indexOf(version) === -1) {
          versions.push(version);
        }
      });
      
      versions.sort(compareVersions);
    }

    /**
     * Compares version numbers for sorting.
     */
    function compareVersions(a, b) {
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    }

    /**
     * Determines if two libraries share the same name.
     */
    function matches(libraryName) {
      return id === normalizeName(libraryName);
    }

    /**
     * Returns the HTML snippet associated with the
     * specified version number.
     */
    function getSnippet(version, https) {
      https = https || false;
      var url     = getURL(version),
          snippet = tag.replace('{url}', url);
      
      if (https) {
        snippet = snippet.replace(/(href|src)="/, '$&https:');
      }
      
      return snippet;
    }

    /**
     * Generates the URL for a specific version number.
     */
    function getURL(version) {
      for (var i = 0; i < cdns.length; i++) {
        var cdn = cdns[i];
        if (cdn.versions.indexOf(version) !== -1) {
          return getCDNLink(cdn.cdnName) + 
                 cdn.name + '/' + 
                 version + '/' + 
                 cdn.mainfile;
        }
      }
    }

    /**
     * Returns the URL to the CDN specified.
     */
    function getCDNLink(cdnName) {
      for (var i = 0; i < CDNs.length; i++) {
        var cdn = CDNs[i];
        if (cdn.name === cdnName) {
          return cdn.url;
        }
      }
      return null;
    }
    
    /**
     * Determines the type of the library.
     */
    function parseLibraryType(fileName) {
      if (fileName.indexOf('.css') === (fileName.length - 4)) {
        return 'link';
      } else {
        return 'script';
      }
    }

    /**
     * Returns the name of the library.
     */
    function getName() {
      return name;
    }

    /**
     * Returns the id of the library.
     */
    function getId() {
      return id;
    }

    /**
     * Returns an array of hosted versions of the library.
     */
    function getVersions() {
      return versions;
    }
    
    /**
     * Return the type associated with the library's main file.
     * e.g. script, css
     */
    function getLibraryType() {
      return libraryType;
    }

    /**
     * Represents information about a CDN specific to
     * the library.
     */
    function CDNInfo(cdnName, name, mainfile, versions) {
      this.cdnName  = cdnName;
      this.name     = name;
      this.mainfile = mainfile;
      this.versions = versions;
    }

    return {
      addCDNInfo: addCDNInfo,
      getId: getId,
      getName: getName,
      getLibraryType: getLibraryType,
      getSnippet: getSnippet,
      getVersions: getVersions,
      matches: matches,
    };
  }

  /**
   * Compares ids for sorting.
   */
  Library.compareIds = function(a, b) {
    return a.getId().localeCompare(b.getId());
  };

  exports.Library = Library;
});