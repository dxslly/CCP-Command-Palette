var _currentfuzzySearch;
var _currentSuggestions;
var _currentCallBack;

/*
 * ask(arrayOfSuggestions, callBack(inputvalue:string) - optional)
 */
function ask(suggestions, callBack) {
	var options = {
		keys: ['name', 'description']
	}
	_currentfuzzySearch = new Fuse(suggestions, options);
	_currentSuggestions = suggestions;
	_currentCallBack = callBack;
	populateSuggestions();
}

/*
 * Clears and then fills the suggestions with possible suggestions
 */
function populateSuggestions() {
	var suggestions = $('#suggestions');

	suggestions.empty();

	function createHTMLSuggestion(suggestionObject) {
		var suggestion = $('<a>');
		suggestion.addClass('suggestion');
		$(suggestion).data('callBack', suggestionObject.callBack);
		if (param)
			$(suggestion).data('param', suggestionObject.param);
		if (suggestionObject.image)
			$(suggestion).append($('<img>').attr(suggestionObject.image).addClass('icon'));
		suggestion.append($('<span>').addClass('name').text(suggestionObject.name));
		if (suggestionObject.description) 
			suggestion.append($('<span>').addClass('description').text(suggestionObject.description));
		if (suggestionObject.shortcut)
			suggestion.append($('<span>').addClass('shortcut').text(suggestionObject.shortcut));
		return suggestion;
	}

	if (_currentSuggestions.length > 0) {
		var commandFieldVal = $('#commandField').val();
		if (commandFieldVal == '') {
			for (var i = commands.length - 1; i >= 0; i--) {
				var suggestion = createHTMLSuggestion(commands[i]);
				suggestions.prepend(suggestion);
			}
		} else {
			var results = _commandsFuzzySearch.search(commandFieldVal);
			for (var j = results.length - 1; j >= 0; j--) {
				var suggestion = createHTMLSuggestion(results[j]);
				suggestions.prepend(suggestion);
			};
		}
		$('.suggestion').first().addClass('selected');
	}
}

/*
 * Runs the suggestion that is currently selected.
 */
function runSelectedSuggestion() {
	var callBack = $('.selected').data('callBack');
	for (var i = commands.length - 1; i >= 0; i--) {
		if (callBack == commands[i].callBack) {
			var params = [];
			callFunction(commands[i].funcitonName, params);
			break;
		}
	};
}

/*
 * Deselect any suggestions then selects the given suggestions.
 * Scrolls to show selection.
 */
function selectSuggestion(suggestion) {
	var selected =  $('.selected');
	$(selected).removeClass('selected');
	$(suggestion).addClass('selected');
	$('body').stop(true);
	$('body').animate({
		scrollTop: $(suggestion).offset().top - (140) // EVIL MAGIC!!
	}, 100); 
}


function onSubmit() {
	var selected = $('.selected');
	if (selected) {
		var callBack = $(selected).data('callBack');
		var params = $(selected).data('params');
		callFunctionFromStr(callBack, params);
	}
	if ()
	callFunctionFromStr

}


/*
 * Move focus to input on key down and repopulate suggestions
 */
$(document).ready(function(){
	// Vars
	var previousInputValue = $('#commandField').val();
	
	// Run at start
	$('#commandField').focus();
	populateSuggestions();
	
	// Events
	$(document).on('keydown', function(e) {
		$('#commandField').focus();
		var selected =  $('.selected');
		if (e.which == 40 || e.which == 9) { // if down arrow or tab
			var next = (selected).next('.suggestion');
			if (next.length != 0) {
				selectSuggestion(next);
			}
		} else if (e.which == 38) { // if up arrow
			var prev = (selected).prev('.suggestion');
			if (prev.length != 0) {
				selectSuggestion(prev);
			}
		} else if (e.which == 13) { // if enter
			runSelectedSuggestion();
		}
	});
	
	$(document).keypress(function(e) {
		currentInputValue = $('#commandField').val();
		if (previousInputValue != currentInputValue)
			previousInputValue = currentInputValue;
			populateSuggestions();
	});

	$(document).keyup(function(e) {
		if (e.which == 8) // if backspace
			populateSuggestions();
	})
	
	$('.suggestion').click(function(e) {
		$('.suggestion').removeClass('selected')
		$(this).closest('.suggestion').addClass('selected');
		runSelectedSuggestion();
	});
});

/*
 * UTILITY
 */

/*
 *Calls a function by a string and passes the params
 */
function callFunctionFromStr(functionName, params) {
	window[functionName]();
}