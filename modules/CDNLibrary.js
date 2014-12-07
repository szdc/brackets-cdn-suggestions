/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  /**
   * Represents a JavaScript library hosted by Google.
   */
  function Library(name, snippet, versions) {
    if (name === null || snippet === null || versions === null || versions.length < 1) {
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
    
    return {
      getLatestSnippet: getLatestSnippet,
      getSnippets:      getSnippets
    };
  }
  
  /*
   * Creates a Library instance from an HTML element
   * from Google's Hosted Library webpage.
   */
  Library.fromElement = function (element) {
    var name      = element.id,
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
    
    return new Library(name, snippet, versions);
  }
  
  exports.fromElement = Library.fromElement;
});