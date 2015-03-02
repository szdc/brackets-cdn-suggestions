/*jslint vars: true */
/*global define, $, brackets, window, console */

define(function (require, exports, module) {
  'use strict';
  
  // Brackets modules
  var CodeHintManager = brackets.getModule('editor/CodeHintManager'),
      ExtensionUtils  = brackets.getModule('utils/ExtensionUtils'),
      CommandManager  = brackets.getModule('command/CommandManager'),
      Menus           = brackets.getModule('command/Menus'),
      PreferencesManager = brackets.getModule('preferences/PreferencesManager');
  
  // Extension modules
  var CDNHintProvider = require('modules/CDNHintProvider').CDNHintProvider,
      LibraryList     = require('modules/CDNLibraryList').LibraryList,
      API             = require('modules/jsdelivrAPI'),
      CDNs            = JSON.parse(require('text!modules/CDNs.json')),
      CDNStrings      = require('modules/strings'),
      CDNCommands     = require('modules/commands'),
      CDNPrefs        = require('modules/prefs');
  
  // Preferences
  var prefs = PreferencesManager.getExtensionPrefs('cdn-suggestions'),
      stateManager = PreferencesManager.stateManager.getPrefixedSystem('cdn-suggestions');
  
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
    var cdnHintProvider = new CDNHintProvider(libraryList);
    CodeHintManager.registerHintProvider(cdnHintProvider, ['html'], 10);
  }
  
  /**
   * Registers commands for the extension.
   */
  function registerCommands() {
    CommandManager.register(
      CDNStrings.CMD_USE_HTTPS, 
      CDNCommands.USE_HTTPS,
      function () {
        var id       = CDNPrefs.USE_HTTPS.id,
            useHTTPS = !prefs.get(id);
        prefs.set(id, useHTTPS);
        prefs.save();
      }
    )
  }
  
  /**
   * Registers a preference for the extension
   *
   * @param {Object} pref
   * An object with the keys: id, type, initial
   */
  function registerPreference(pref) {
    var prefObj = prefs.definePreference(pref.id, pref.type, pref.initial);
    prefs.save();
    return prefObj;
  }
  
  /**
   * Adds menu items.
   */
  function setupMenus() {
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(CDNCommands.USE_HTTPS);
  }
  
  /**
   * Toggles the checked state of a menu item.
   *
   * @param {String} command
   * The command linked to the menu item.
   *
   * @param {String} prefId
   * The id of the preference to lookup.
   */
  function toggleMenuItem(command, prefId) {
    var value = prefs.get(prefId);
    CommandManager.get(command).setChecked(value);
  }
  
  registerCommands();
  registerPreference(CDNPrefs.USE_HTTPS).on('change', function () {
    toggleMenuItem(CDNCommands.USE_HTTPS, CDNPrefs.USE_HTTPS.id)
  });
  setupMenus();
  downloadLibraries(CDNs, registerHintProvider);
});