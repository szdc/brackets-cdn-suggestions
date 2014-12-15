/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var URL = 'http://api.jsdelivr.com/v1/{cdn}/libraries?fields=name,mainfile,versions';
  
  /**
   * Downloads the libraries hosted by the specified CDN.
   *
   * @param {String}
   * The name of the CDN to download libraries from,
   * as specified in the CDN variable.
   *
   * @param {Function} 
   * A callback that handles the response.
   */
  function downloadLibraries(cdn, callback) {
    var req = new XMLHttpRequest();
    req.onload = callback;
    req.open('get', URL.replace('{cdn}', cdn));
    req.send();
  }

  /**
   * Gets the libraries hosted by the specified CDN.
   */
  function getLibraries(cdn, callback) {
    /**
     * Checks the status code of the response before
     * parsing the libaries.
     */
    function onDownloadComplete() {
      if (this.status !== 200) {
        callback('Error (Status ' + this.status + '): Invalid library?');
        return;
      }

      var libraries = JSON.parse(this.responseText);
      callback(null, libraries);
    }
    
    downloadLibraries(cdn, onDownloadComplete);
  }

  exports.getLibraries = getLibraries;
});