/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  var HTMLUtils       = brackets.getModule('language/HTMLUtils'),
      DocumentManager = brackets.getModule('document/DocumentManager'),
      CDNLibrary      = require('modules/CDNLibrary');
  
  /**
   * Represents a CodeHintProvider
   *
   * @param {Array<Library}
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
    
    console.log(tagInfo);
    if (
      tagInfo.tagName === 'script' && 
      tagInfo.position.tokenType === 'attr.name' &&
      tagInfo.attr.name.length === 0
    ) {
      return true;
    }
    
    return false;
  }
  
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
        filter  = new RegExp(tagInfo.attr.name, 'i');

    var libraryNames = this.libraries
    .map(function (library) {
      return library.getName();
    })
    .filter(function (libraryName) { 
      return filter.test(libraryName);
    });
    
    if (tagInfo.attr.name.length === 0) {
      // Sort alphabetically
      libraryNames.sort();
    } else {
      // Sort based on the location of the current attribute
      libraryNames.sort(compareByStrPos);
    }

    /**
     * Compares two string based on the position of the
     * attribute name `tagInfo.attr.name` (RegExp `filter`).
     * This method uses a regular expression to for its
     * case-insensitivity flag.
     */
    function compareByStrPos(a, b) {
      var aIndex = filter.exec(a).index;
      var bIndex = filter.exec(b).index;

      if (aIndex < bIndex) {
        return -1;
      } else if (aIndex > bIndex) {
        return 1;
      } else {
        return 0;
      }
    }
    
    return {
      hints: libraryNames,
      match: tagInfo.attr.name,
      selectInitial: true,
      handleWideResults: false
    };
  }
  
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
    var document = this.editor.document,
        startPos = this.editor.getCursorPos(),
        library  = CDNLibrary.findByName(this.libraries, hint);
    
    var snippet = library.getLatestSnippet();
    startPos.ch = 0;
    
    var endPos = {
      line: startPos.line,
      ch: startPos.ch + snippet.length
    };
    
    document.replaceRange(snippet, startPos, endPos);
    
    return true;
  }

  exports.CDNHints = CDNHints;
});