/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  /**
   * Represents a JavaScript library hosted by Google.
   *
   * @param {String} id
   * The id of the library element, e.g. angularjs
   *
   * @param {String} name
   * The name of the library, e.g. Angular JS
   *
   * @param {String} snippet
   * The latest version's HTML snippet for the library
   * e.g. <script src="..."></script>
   *
   * @param {Array<String>} versions
   * An array of hosted version numbers of the library
   * e.g. [1.3.5, 1.3.4, 1.3.2]
   *
   * @return {Object}
   * An object containing public methods exposed by
   * the class.
   */
  function Library(id, name, snippet, versions) {
    if (arguments.length !== 4 || versions.length < 1) {
      return null;
    }
    
    var snippets = [];
    versions.forEach(function (element) {
      snippets.push(snippet.replace(new RegExp(versions[0], 'g'), element));
    });
    
    function getLatestSnippet() {
      return snippet;
    }
    
    function getSnippets() {
      return snippets;
    }
    
    function getName() {
      return name;
    }
    
    function getId() {
      return id;
    }
    
    return {
      getLatestSnippet: getLatestSnippet,
      getSnippets:      getSnippets,
      getName:          getName,
      getId:            getId
    };
  }
  
  /*
   * Creates a Library instance from an HTML element
   * from Google's Hosted Library webpage.
   */
  Library.fromElement = function (element) {
    var id        = element.id,
        name      = element.querySelector('dt').textContent,
        snippet   = element.querySelector('.snippet').textContent || '',
        versions  = element.querySelector('span.versions').innerHTML;
    
    // Remove the new line (and any extra spaces)
    // that appear after the tag name
    snippet = snippet.replace(/\s{2,}(?=\w)/g, ' ');
    
    // Move the second tag to be on the line below 
    // and in-line with the first tag (where applicable)
    snippet = snippet.replace(/\s{2,}/g, '\n');
    
    // Remove any spaces or new lines
    versions = versions.replace(/\s+/g, '');
    versions = versions.split(',');
    
    return new Library(id, name, snippet, versions);
  };
  
  /**
   * Returns the library with the name specified given
   * the array of libraries supplied,or null if none 
   * was found.
   *
   * @param {Array<Library>} libraries
   * The array of Library objects to search.
   *
   * @param {String} name
   * The name of the library to search for.
   */
  Library.findByName = function (libraries, name) {
    for (var i = 0; i < libraries.length; i++) {
      var library = libraries[i];
      if (library.getName() === name) {
        return library;
      }
    }
    return null;
  };
  
  exports.fromElement = Library.fromElement;
  exports.findByName  = Library.findByName;
});