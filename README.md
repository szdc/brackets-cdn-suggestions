Brackets Extension: CDN Suggestions
=========================

Provides JavaScript & CSS library suggestions for libraries hosted on the CDNs by [Google](https://developers.google.com/speed/libraries/devguide), [jsDelivr](http://www.jsdelivr.com/) and [CDNJS](https://cdnjs.com/).  Thanks to [ByteBlast](https://github.com/ByteBlast) for the idea!

This extension uses the [jsDelivr API](https://github.com/jsdelivr/api) to find libraries hosted from the aforementioned CDNs.

## Usage
1. Start typing a script tag as you normally would: `<script `
2. Hit space after the tag name and you'll be prompted with a selection of libraries.
3. Hit enter on your desired library and you'll be prompted with a selection of versions.
4. Hit enter on your desired version and the HTML snippet will be inserted.

**Protip**: Double-tap enter on your desired library to insert the latest version.

### Preview
![CDN Suggestions Preview](http://i.imgur.com/l1Nf6UO.gif)

## Installation
In Brackets, choose File > Extension Manager and click on the Available tab.  Then search for `cdn suggestions`.

## Roadmap
Development is currently focused on fixing existing [issues and planned enhancements](https://github.com/szdc/brackets-cdn-suggestions/issues).
A future feature might include a preference to select a CDN after choosing a version.