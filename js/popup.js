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

var DEFAULT_PLACEHOLDER = 'Search or Type a Command';

/* ==============================================================================
 *     VARIABLES
 * ==============================================================================
 */
var _currentFuzzySearch;
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
function suggestToUser(suggestions, placeholder) {
	_callBack = null;
	
	$('#commandField').val('');
	if (typeof placeholder === 'undefined')
		placeholder = DEFAULT_PLACEHOLDER;
	$('#commandField').attr('placeholder', placeholder);

	var options = {
		keys: ['caption']
	}
	_currentFuzzySearch = new Fuse(suggestions, options);
	_currentSuggestions = suggestions;

	populateSuggestions();
}


function askUser(placeholder, callBack) {
	_currentSuggestions = null;
	_currentFuzzySearch = null;

	$('#commandField').val('');
	$('#suggestions').empty();
	if (typeof placeholder === 'undefined')
		placeholder = DEFAULT_PLACEHOLDER;
	$('#commandField').attr('placeholder', placeholder);
	_currentCallBack = callBack;
}


/*
 * Called when the user chooses a suggestion or if not suggestions are given
 * when the user presses enter. 
 */
function onUserChoice() {
	var selected = $('.selected');

	if (_currentCallBack) {
		_currentCallBack($('#commandField').val());
	} else {
		var command = $(selected).data('command');
		var args = $(selected).data('args');
		callFunctionFromStr(command, args);
	}

	if ($(selected).data('closeOnComplete'))
		window.close();
}

/*
 * Clears and then fills the suggestions with possible suggestions
 */
function populateSuggestions() {
	if (_currentSuggestions) {
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

			// Data
			$(suggestion).data('command', suggestionObject.command);
			if (suggestionObject.args)
				$(suggestion).data('args', suggestionObject.args);
			if (suggestionObject.closeOnComplete)
				$(suggestion).data('closeOnComplete', suggestionObject.closeOnComplete)
			else
				$(suggestion).data('closeOnComplete', false)

			// Image
			if (suggestionObject.image) {
				var imgElement = $('<img>');
				$(imgElement).addClass('icon');
				$(imgElement).attr('src', suggestionObject.image);
				$(suggestion).append(imgElement);
			}

			// Caption
			suggestion.append($('<span>').addClass('caption').text(suggestionObject.caption));
			
			// Desciption
			if (suggestionObject.description) 
				suggestion.append($('<span>').addClass('description').text(suggestionObject.description));
			
			// Shortcut
			if (suggestionObject.shortcut) {
				var shortcutElement = $('<span>').addClass('shortcut');
				var shortcutKeys;
				switch(_os) {
					case OS.mac:
						shortcutKeys = suggestionObject.shortcut.mac;
						break;
					case OS.windows:
						shortcutKeys = suggestionObject.shortcut.windows;
						break;
					case OS.linux:
						shortcutKeys = suggestionObject.shortcut.linux; // @TODO: support linux shortcuts
						break;
					default:
						shortcutKeys = suggestionObject.shortcut.windows;
						break;
				}
				if (shortcutKeys) {
					for (var i = 0; i < shortcutKeys.length; i++) {
						$(shortcutElement).append($('<span>').text(shortcutKeys[i]).addClass('key'));
						// if (i != shortcutKeys.length - 1)
						// 	$(shortcutElement).append('+');
					};
					suggestion.append(shortcutElement);
				}
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
				selectSuggestion($('.suggestion').first());
		} else {
			// Fuzzy search for results Fill with results
			var results = _currentFuzzySearch.search(commandFieldVal);
			for (var i = results.length - 1; i >= 0; i--) {
				var suggestion = createHTMLSuggestion(results[i]);
				suggestionsElement.prepend(suggestion);
			};
			if (results.length > 0)
				selectSuggestion($('.suggestion').first());
		}
	}
}


/*
 * Deselect any current suggestions, selects a given suggestions.
 * and then scrolls to show selection.
 */
function selectSuggestion(suggestionElement) {
	$('.selected').removeClass('selected');
	$(suggestionElement).addClass('selected');
	
	/* Scroll suggestion into view */
	var offset = $(suggestionElement).position().top; // Suggestion's offset from parent
	var suggestionHeight = $(suggestionElement).outerHeight();
	var suggestionsHeight = $('#suggestions').height();
	var suggestionsScrollTop = $('#suggestions').scrollTop();
	if (offset + suggestionHeight > suggestionsHeight) { // If element is beneath view
		offset += suggestionsScrollTop - (suggestionsHeight - suggestionHeight);
		$('#suggestions').stop(true); // Stop any current animations
		$('#suggestions').animate({ scrollTop: offset }, 100);
	} else if (offset < 0) { // If element is above view
		offset += suggestionsScrollTop;
		$('#suggestions').stop(true); // Stop any current animations
		$('#suggestions').animate({ scrollTop: offset }, 100);
	}
}


/*
 *  DOM Ready
 */
$(document).ready(function(){

	// Bring focus to the input box, to make the user feel safe
	$('#commandField').focus();
	// Ask user about command suggestions 
	suggestToUser(getCommandSuggestions());
	
	$('#commandField').on('input', function() {
		populateSuggestions();
	})

	// On keydown
	$(document).on('keydown', function(e) {
		$('#commandField').focus();
		var selected =  $('.selected');
		if (selected) {
			if (e.which == 40 || e.which == 9) { // Down arrow and Tab Keycodes
				e.preventDefault();
				var next = (selected).next('.suggestion');
				if (next.length != 0) {
					selectSuggestion(next);
				} else {
					var first = $('.suggestion').first();
					if (first.length != 0)
						selectSuggestion(first);
				}
			} else if (e.which == 38) { // Up Arrow Keycode
				e.preventDefault();
				var prev = (selected).prev('.suggestion');
				if (prev.length != 0) {
					selectSuggestion(prev);
				} else {
					var last = $('.suggestion').last();
					if (last.length != 0)
						selectSuggestion(last);
				}
			} else if (e.which == 8) { // Backspace Keycode
				if ($('#commandField').val() == '') {
					suggestToUser(getCommandSuggestions());
				}
			}
		}
	});
	
	// On Click
	$('#suggestions').on('click', '.suggestion', function(e) {
		selectSuggestion($(this));
		onUserChoice();
	});

	// On keyup
	$('#commandField').keyup(function(e) {
		if (e.which == 13) { // Enter Keycode
			onUserChoice();
		}
	});
});


/* ==============================================================================
 *     UTILITY FUNCTIONS
 * ==============================================================================
 */

/*
 * Calls a function given the funciton's name
 */
function callFunctionFromStr(functionName, args) {
	window[functionName](args);
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