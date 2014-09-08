var hud = (function($, Handlebars) {
  /* Member Vars */
  var isCreated = false;
  var isVisable = false;
  var defaultSuggestions = [];

  /* Cached Divs */
  var ccpHUDDiv;
  var suggestionsDiv;
  var commandFieldDiv;
  
  /* Templates */
  var TEMPLATE_SOURCE_CCP_HUD = '<div id="ccpHUD"><div id="commandBar"><input type="text" id="commandField" autocomplete="off" placeholder="Search or Type a Commmand"></div><div id="suggestions"></div></div>';
  var TEMPLATE_SOURCE_SUGGESTIONS = '<div class="suggestion"><span class="caption">{{this.caption}}</span></div>';
  var templateSuggestion;

  /* Consts */
  var DEFAULT_SUGGESTIONS = [{
    'caption': 'Package Control: Install',
    'appId': config.APP_ID,
    'command': 'Test'
  }];

  function initialize() {
    defaultSuggestions = DEFAULT_SUGGESTIONS;
    templateSuggestion = Handlebars.compile(TEMPLATE_SOURCE_SUGGESTIONS);

    $(document).ready(function() {
      $(document).on('keydown', function(event) {
        // Hide and Show
        if ((80 === event.which) && event.metaKey)
        {
          event.preventDefault();
          if (isVisable) {
            hide();
          } else {
            show();
          }
        }

        // Submit Command
        if (13 === event.which && isVisable) {
          runCommand(defaultSuggestions[0]);
          hide();
        }
      });
    });
  }

  function setDefaultSuggestions(suggestions) {
    defaultSuggestions = suggestions;
  }

  function create() {
    if (isCreated) {
      return;
    }

    $(TEMPLATE_SOURCE_CCP_HUD).appendTo('body');

    ccpHUDDiv = $('#ccpHUD');
    suggestionsDiv = $('#suggestions', ccpHUDDiv);
    commandField = $('#commandField', ccpHUDDiv);

    isCreated = true;
  }

  function hide() {
    if (!isVisable) {
      return;
    }

    $(ccpHUDDiv).hide();
    $(suggestionsDiv).empty();
    $(commandField).val('');
    isVisable = false;
  }

  function show() {
    if (isVisable) {
      return;
    }

    if (!isCreated) {
      create();
    }
    
    $(ccpHUDDiv).show();
    isVisable = true;
    $(commandField).focus();
    presentSuggestions(defaultSuggestions);
  }

  function presentSuggestions(suggestions) {
    suggestions = suggestions || defaultSuggestions || [];

    suggestions.forEach(function(suggestion, index, array) {
      var suggestionString = templateSuggestion(suggestion);
      $(suggestionsDiv).append(suggestionString);
    });
  }

  function runCommand(suggestion) {
    var runCommandMessage = {
      'action': 'RunCommand',
      'command': suggestion.command,
      'args': suggestion.args
    };

    if (suggestion.appId === config.APP_ID) {
      chrome.runtime.sendMessage(runCommandMessage);
    } else {
      chrome.runtime.sendMessage(suggestion.appId, runCommandMessage);
    }
  }

  var exports = {
    'initialize': initialize,
    'setDefaultSuggestions': setDefaultSuggestions,
    'presentSuggestions': presentSuggestions
  };

  return exports;
})($, Handlebars);


$(document).ready(function() {
  hud.initialize();

  chrome.runtime.sendMessage({'action': 'GetDefaultSuggestions'}, function(response) {
    hud.setDefaultSuggestions(response);
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if ('PresentSuggestions' === message.action) {
      hud.presentSuggestions(message);
    }
  });

});