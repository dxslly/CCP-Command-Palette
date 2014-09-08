/**
 *  External Messaging
 */
chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    switch(message.action) {
      case 'PresentSuggestions':
        return handlePresentSuggestions(message, sender, sendResponse);
      default:
        return;
    }
});


function handlePresentSuggestions(message, sender, sendResponse) {
  // Pass on the message to the current tab
  chrome.tabs.getSelected(function(tab) {
    chrome.tabs.sendMessage(tab.id, message);
  });
}


/**
 *  Internal Messaging
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Local Message Recieved: ");
  console.log(request);

  switch(request.action) {
    case 'GetDefaultSuggestions':
      return handleGetDefaultSuggestions(request, sender, sendResponse);
    case 'RunCommand':
      return handleRunCommand(request, sender, sendResponse);
    default:
      return;
  }
});

function handleGetDefaultSuggestions(message, sender, sendResponse)
{
  var suggestions = [];
  for (var suggestion in defaultCommands) {
    var s = defaultCommands[suggestion];
    s.appId = config.APP_ID;
    suggestions.push(s);
  }
  sendResponse(suggestions);
}

function handleRunCommand(message, sender, sendResponse) {
  if (!message.command) {
    return;
  }

  // Ensure we have the command they asked for
  if (!commands.hasOwnProperty(message.command)) {
    console.log('Unable to find command: ' + '"' + message.command + '"');
    return;
  }

  // Run the command with the given arguments
  commands[message.command].run(message.args);
}
