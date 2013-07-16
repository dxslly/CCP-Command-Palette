/*
	Calls a function by a string and passes the params
*/
function callFunction(functionName, params) {

}


var suggestionID = 'commandSuggestion';

function populateSuggestions() {
	var suggestions = $('#commandSuggestions');

	suggestions.empty();

	function createSuggestion(command) {
		var suggestion = $('<a>');
		suggestion.addClass('suggestion');
		suggestion.data('command', command.slug);
		suggestion.append($('<span>').addClass('command').text(command.name));
		suggestion.append($('<span>').addClass('description').text(command.description));
		return suggestion;
	}

	for (var i = commands.length - 1; i >= 0; i--) {
		var suggestion = createSuggestion(commands[i]);
		suggestions.append(suggestion);
	};
}