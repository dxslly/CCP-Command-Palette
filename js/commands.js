var defaultCommands = [
  {
    'caption': 'Preferences: CCP Settings',
    'command': 'OpenTab',
    'args': { 'url': 'settings.html', 'isLocal': true }
  },
  {
    'caption': 'Goto: Extensions',
    'command': 'OpenTab',
    'args': { 'url': 'chrome://extensions/', 'isLocal': false }
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