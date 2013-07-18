/* ==============================================================================
 *     CONSTANTS
 * ==============================================================================
 */
 var OS = {
	'unknown': 0,
	'mac': 1,
	'windows': 2,
	'linux': 3
}

/* ==============================================================================
 *     VARIABLES
 * ==============================================================================
 */
var _currentfuzzySearch;
var _currentSuggestions;
var _currentCallBack;
var _os = detectOS();

/* ==============================================================================
 *     FUNCTIONS
 * ==============================================================================
 */

/*
 * Repopulates the suggestions with 
 * ask(arrayOfSuggestions, callBack(inputvalue:string) - optional)
 */
function askUser(suggestions, prompt, callBack) {
	var options = {
		keys: ['caption']
	}
	_currentfuzzySearch = new Fuse(suggestions, options);
	_currentSuggestions = suggestions;
	// @TODO: add prompt code and html
	_currentCallBack = callBack || null;
	populateSuggestions();
}

/*
 * Called when the user chooses a suggestion or if not suggestions are given
 * when the user presses enter. 
 */
function onUserChoice() {
	var selected = $('.selected');
	if (selected) {
		var command = $(selected).data('command');
		var params = $(selected).data('params');
		callFunctionFromStr(command, params);
	}
	if (_currentCallBack)
		_currentCallBack($('#commandField').val());
}

/*
 * Clears and then fills the suggestions with possible suggestions
 */
function populateSuggestions() {
	var suggestionsElement = $('#suggestions');

	suggestionsElement.empty();

	/*
	 * Creates a HTML element given a suggestion
	 *
	 * params:
	 *   suggestionObject - suggestion
	 * return:
	 *   element - A suggestion HTML element 
	 */
	function createHTMLSuggestion(suggestionObject) {
		var suggestion = $('<a>');
		suggestion.addClass('suggestion');
		$(suggestion).data('command', suggestionObject.command);
		if (suggestionObject.args)
			$(suggestion).data('args', suggestionObject.args);
		if (suggestionObject.image)
			$(suggestion).append($('<img>').attr(suggestionObject.image).addClass('icon'));
		suggestion.append($('<span>').addClass('caption').text(suggestionObject.caption));
		if (suggestionObject.description) 
			suggestion.append($('<span>').addClass('description').text(suggestionObject.description));
		if (suggestionObject.shortcut) {
			var shortcutElement = $('<span>').addClass('shortcut');
			var shortcutKeys;
			switch(_os) {
				case OS.mac:
					shortcutKeys = suggestionObject.shortcut.windows;
				case OS.windows:
					shortcutKeys = suggestionObject.shortcut.windows;
				case OS.linux:
					shortcutKeys = suggestionObject.shortcut.windows;
				default:
					shortcutKeys = suggestionObject.shortcut.windows;
			}
			for (var i = 0; i < shortcutKeys.length; i++) {
				$(shortcutElement).append($('<span>').text(shortcutKeys[i]).addClass('key'));
				if (i != shortcutKeys.length - 1)
					$(shortcutElement).append('+');
			};
			suggestion.append(shortcutElement);
		}
		return suggestion;
	}

	// The value of the input ignoring bad characters
	var commandFieldVal = $('#commandField').val().replace(/\W/g, '');
	// If the input field is empty
	if (commandFieldVal == '') {
		// Fill with every suggestion
		for (var i = _currentSuggestions.length - 1; i >= 0; i--) {
			var suggestion = createHTMLSuggestion(_currentSuggestions[i]);
			suggestionsElement.prepend(suggestion);
		}
		if (_currentSuggestions.length > 0)
			$('.suggestion').first().addClass('selected');
	} else {
		// Fuzzy search for results Fill with results
		var results = _currentfuzzySearch.search(commandFieldVal);
		for (var i = results.length - 1; i >= 0; i--) {
			var suggestion = createHTMLSuggestion(results[i]);
			suggestionsElement.prepend(suggestion);
		};
		if (results.length > 0)
			$('.suggestion').first().addClass('selected');
	}
}


/*
 * Deselect any current suggestions, selects a given suggestions.
 * and then scrolls to show selection.
 */
function selectSuggestion(suggestionElement) {
	var selected =  $('.selected');
	$(selected).removeClass('selected');
	$(suggestionElement).addClass('selected');
	$('body').stop(true);
	$('body').animate({
		scrollTop: $(suggestionElement).offset().top - (140) // EVIL MAGIC!!
	}, 100); 
}


/*
 *  DOM Ready
 */
$(document).ready(function(){

	// Bring focus to the input box, to make the user feel safe
	$('#commandField').focus();
	// Ask user about command suggestions 
	askUser(getCommandSuggestions());
	
	$('#commandField').on('input', function() {
		populateSuggestions();
	})

	// On keydown
	$(document).on('keydown', function(e) {
		$('#commandField').focus();
		var selected =  $('.selected');
		if (e.which == 40 || e.which == 9) { // if down arrow or tab
			e.preventDefault();
			var next = (selected).next('.suggestion');
			if (next.length != 0) {
				selectSuggestion(next);
			} else {
				var first = $('.suggestion').first();
				if (first)
					selectSuggestion(first);
			}
		} else if (e.which == 38) { // if up arrow
			e.preventDefault();
			var prev = (selected).prev('.suggestion');
			if (prev.length != 0) {
				selectSuggestion(prev);
			} else {
				var last = $('.suggestion').last();
				if (last)
					selectSuggestion(last);
			}
		} else if (e.which == 13) { // if enter
			onUserChoice();
		}
	});
	
	// On Click
	$('.suggestion').click(function(e) {
		$('.suggestion').removeClass('selected')
		$(this).closest('.suggestion').addClass('selected');
		onUserChoice();
	});
});

/* ==============================================================================
 *     UTILITY FUNCTIONS
 * ==============================================================================
 */

/*
 * Calls a function given the funciton's name
 */
function callFunctionFromStr(functionName, params) {
	params = params || {};
	window[functionName](params);
}

/*
 * Returns the believed Operating System of the user
 */
function detectOS() {
	if (navigator.appVersion.indexOf("Win")!=-1) return OS.windows;
	if (navigator.appVersion.indexOf("Mac")!=-1) return OS.mac;
	if (navigator.appVersion.indexOf("X11")!=-1) return OS.linux;
	if (navigator.appVersion.indexOf("Linux")!=-1) return OS.linux;
	return OS.unknown;
}