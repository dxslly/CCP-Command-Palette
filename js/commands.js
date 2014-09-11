var defaultCommands = [
  {
    'caption': 'Goto: Chrome Bookmarks',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://bookmarks/', 'isLocal': false }
  },
  {
    'caption': 'Goto: Chrome Downloads',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://downloads/', 'isLocal': false }
  },
  {
    'caption': 'Goto: Chrome Extensions',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://extensions/', 'isLocal': false }
  },
  {
    'caption': 'Goto: Chrome History',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://history/', 'isLocal': false }
  },
  {
    'caption': 'Preferences: CCP Settings',
    'command': 'OpenTab',
    'args': { 'url': 'settings.html', 'isLocal': true }
  },
  {
    'caption': 'Preferences: Chrome Settings',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://history/', 'isLocal': false }
  }
];

var commands = (function() {


  var OpenTab = (function() {
    function run(args) {
      if (args.isLocal) {
        args.url = chrome.extension.getURL(args.url);
      }
      var createProperties = {
        'url': args.url,
        'active': true
      };
      chrome.tabs.create(createProperties);
    }

    var exports = {
      'run': run
    };
    return exports;
  })();

  var exports = {
    'OpenTab': OpenTab
  };

  return exports;
})();