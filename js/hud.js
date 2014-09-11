var hud = (function($, Handlebars, Fuse) {
  /* Member Vars */
  var isCreated = false;
  var isVisable = false;
  var allSuggestions = [];
  var currentSuggestions = [];
  var selectedSuggestionIndex = 0;
  var fuse;

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
    allSuggestions = DEFAULT_SUGGESTIONS;
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
            chrome.runtime.sendMessage({'action': 'GetDefaultSuggestions'}, function(response) {
              presentSuggestions(response);
            });
          }
        }

        // Submit Command
        if (isVisable && (13 === event.which) && (currentSuggestions.length > 0)) {
          runCommand(currentSuggestions[0]);
          hide();
        }

      });
    });
  }

  function create() {
    if (isCreated) {
      return;
    }

    $(TEMPLATE_SOURCE_CCP_HUD).appendTo('body');

    ccpHUDDiv = $('#ccpHUD');
    suggestionsDiv = $('#suggestions', ccpHUDDiv);
    commandField = $('#commandField', ccpHUDDiv);

    // bind update suggestions on suggestions change 
    $(commandField).on('input', handleCommandFieldChanged);

    isCreated = true;
  }

  function handleCommandFieldChanged() {
    var fieldText = $(commandField).val();
    if (fieldText === '') {
      updateSuggestions(allSuggestions);
    } else {
      var results = fuse.search(fieldText);
      updateSuggestions(results);
    }
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
  }

  function presentSuggestions(suggestions) {
    console.log('presentSuggestions');
    console.log(suggestions);
    allSuggestions = suggestions;                  // Update the list of all suggestions
    var fuseOptions = { keys: ['caption'] };      // Use the caption as the fuzzy search key
    fuse = new Fuse(allSuggestions, fuseOptions); // Create a new fuse object of the new list of suggestions
    show();
    $(commandField).val('');
    updateSuggestions(allSuggestions);
  }

  function updateSuggestions(suggestions) {
    currentSuggestions = suggestions;
    selectedSuggestionIndex = 0;
    $(suggestionsDiv).empty();
    currentSuggestions.forEach(function(suggestion, index, array) {
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
    'presentSuggestions': presentSuggestions
  };

  return exports;
})($, Handlebars, Fuse);

$(document).ready(function() {
  hud.initialize();

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if ('PresentSuggestions' === message.action) {
      hud.presentSuggestions(message);
    }
  });

});