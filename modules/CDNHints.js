/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var HTMLUtils  = brackets.getModule('language/HTMLUtils'),
      CDNLibrary = require('modules/CDNLibrary');
  
  /**
   * Represents a CodeHintProvider
   *
   * @param {Array<Library>}
   * An array of Library objects.
   */
  function CDNHints(cdnLibraries) {
    this.libraries = cdnLibraries;
  }
  
  /**
   * Determines whether hints can be offered given the
   * current editor context.
   *
   * @param {Editor} editor
   * A non-null editor object for the active window.
   *
   * @param {string} implicitChar
   * Null if the hinting request was explicit,
   * otherwise a single character that represents the last 
   * insertion and that indicates an implicit hinting request.
   *
   * @return {boolean} 
   * True if hints can be provided, otherwise false.
   */
  CDNHints.prototype.hasHints = function (editor, implicitChar) {
    this.editor = editor;
    
    var pos     = editor.getCursorPos(),
        tagInfo = HTMLUtils.getTagInfo(editor, pos);
    
    if (this.hasLibraryHints(tagInfo) || this.hasVersionHints(tagInfo)) {
      return true;
    } else {
      return false;
    }
  };
  
  /**
   * Determines if library hints are available for the current
   * editor context.
   */
  CDNHints.prototype.hasLibraryHints = function (tagInfo) {
    return tagInfo.tagName === 'script' && 
           tagInfo.position.tokenType === 'attr.name' &&
           tagInfo.attr.name.length === 0;
  };
  
  /**
   * Determines if version hints are available for the current
   * editor context.
   */
  CDNHints.prototype.hasVersionHints = function (tagInfo) {
    return CDNLibrary.findById(this.libraries, tagInfo.attr.name) !== null;
  };
  
  /**
   * Returns a list of available hints for the current editor
   * context.
   *
   * @param {string} implicitChar
   * Null, if the request to update the hint list was a result
   * of navigation, otherwise a single character that represents
   * the last insertion.
   *
   * @return {object}
   * {jQuery.Deferred|{
   *    hints: Array.<string|jQueryObject>,
   *    match: string,
   *    selectInitial: boolean,
   *    handleWideResults: boolean
   * }}
   */
  CDNHints.prototype.getHints = function (implicitChar) {
    var pos     = this.editor.getCursorPos(),
        tagInfo = HTMLUtils.getTagInfo(this.editor, pos),
        library = CDNLibrary.findById(this.libraries, tagInfo.attr.name);

    if (library === null) {
      return this.getLibraryHints(tagInfo);
    } else {
      return this.getVersionHints(library);
    }
  };
  
  /**
   * Returns a list of library hints for the current editor 
   * context.
   */
  CDNHints.prototype.getLibraryHints = function (tagInfo) {
    var filter = new RegExp(tagInfo.attr.name, 'i');
    
    var libraryNames = this.libraries
    .map(function (library) {
      return library.getName();
    })
    .filter(function (libraryName) { 
      return filter.test(libraryName);
    });
    
    if (tagInfo.attr.name.length === 0) {
      // Sort alphabetically
      libraryNames.sort(compareAlphabetically);
    } else {
      // Sort based on the location of the current attribute
      libraryNames.sort(compareByStrPos);
    }
    
    /**
     * Compares two strings based on their character positions.
     */
    function compareAlphabetically(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }

    /**
     * Compares two string based on the position of the
     * attribute name `tagInfo.attr.name` (RegExp `filter`).
     * This method uses a regular expression to for its
     * case-insensitivity flag.
     */
    function compareByStrPos(a, b) {
      var difference = filter.exec(a).index - filter.exec(b).index
      
      if (difference === 0) {
        return a.localeCompare(b);
      } else {
        return difference;
      }
    }
    
    return {
      hints: libraryNames,
      match: tagInfo.attr.name,
      selectInitial: true,
      handleWideResults: false
    };
  };
  
  /**
   * Returns a list of version hints for the library in the 
   * current editor context.
   */
  CDNHints.prototype.getVersionHints = function (library) {
    if (library === null) {
      return null;
    }
    
    return {
      hints: library.getVersions(),
      match: null,
      selectInitial: true,
      handleWideResults: false
    };
  };
  
  /**
   * Inserts a hint into the current editor context.
   *
   * @param {string} hint
   * The hint selected by the user.
   *
   * @return {boolean}
   * Indicates whether the manager should follow hint 
   * insertion with an explicit hint request.
   */
  CDNHints.prototype.insertHint = function (hint) {
    var pos     = this.editor.getCursorPos(),
        tagInfo = HTMLUtils.getTagInfo(this.editor, pos),
        library = CDNLibrary.findById(this.libraries, tagInfo.attr.name);

    if (library === null) {
      this.insertLibraryId(hint);
      return true;
    } else {
      this.insertLibrarySnippet(hint);
      return false;
    }
  }  
  
  /**
   * Inserts the selected library ID.
   */
  CDNHints.prototype.insertLibraryId = function (hint) {
    var document = this.editor.document,
        startPos = this.editor.getCursorPos(),
        tagInfo  = HTMLUtils.getTagInfo(this.editor, this.editor.getCursorPos()),
        library  = CDNLibrary.findByName(this.libraries, hint),
        snippet  = library.getId();
    
    // Account for the user having typed part of 
    // the library name
    startPos.ch -= tagInfo.attr.name.length;
    
    // Add an end position to overwrite the
    // typed characters
    var endPos = {
      line: startPos.line,
      ch: startPos.ch + snippet.length
    };
    
    document.replaceRange(snippet, startPos, endPos);
  };
  
  /**
   * Inserts the HTML snippet for the selected library and
   * version
   */
  CDNHints.prototype.insertLibrarySnippet = function (hint) {
    var document = this.editor.document,
        startPos = this.editor.getCursorPos(),
        tagInfo  = HTMLUtils.getTagInfo(this.editor, this.editor.getCursorPos()),
        library  = CDNLibrary.findById(this.libraries, tagInfo.attr.name),
        snippet  = library.getSnippet(hint);
    
    startPos.ch = 0;
    
    // Add an end position to overwrite the
    // entire line
    var endPos = {
      line: startPos.line,
      ch: startPos.ch + snippet.length
    };
    
    document.replaceRange(snippet, startPos, endPos);
  };

  exports.CDNHints = CDNHints;
});