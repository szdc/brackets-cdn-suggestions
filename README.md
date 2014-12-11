Brackets Extension: CDN Suggestions
=========================

Provides JavaScript library suggestions for libraries hosted on [Google's CDN](https://developers.google.com/speed/libraries/devguide) (e.g. AngularJS, jQuery).  Thanks to [ByteBlast](https://github.com/ByteBlast) for the idea!

## Usage
1. Start typing a script tag as you normally would: `<script `
2. Hit space after the tag name and you'll be prompted with a selection of libraries.
3. Hit enter on your desired library and you'll be prompted with a selection of versions.
4. Hit enter on your desired version and the HTML snippet will be inserted.

**Protip**: Double-tap enter on your desired library to insert the latest version.

### Preview
![CDN Suggestions Preview](http://i.imgur.com/noV7YHF.gif)

## Installation
In Brackets, choose File > Extension Manager and click on the Available tab.  Then search for `cdn suggestions`.

## Roadmap
The next step is to support a broader range of CDN services (e.g. [CDNJS](https://cdnjs.com/)) using the API by [jsDelivr](https://github.com/jsdelivr/api) - development is taking place in [branch v2](https://github.com/szdc/brackets-cdn-suggestions/tree/v2).