var options = {
	keys: ['package', 'name']
}
var commandsFuzzySearch = new Fuse(commands, options);

/*
 *Calls a function by a string and passes the params
 */
function callFunction(functionName, params) {
	window[functionName]();
}


/*
 * Clears and then fills the suggestions with possible suggestions
 */
function populateSuggestions() {
	var suggestions = $('#suggestions');

	suggestions.empty();

	function createSuggestion(command) {
		var suggestion = $('<a>');
		suggestion.addClass('suggestion');
		$(suggestion).data('slug', command.slug);
		suggestion.append($('<span>').addClass('command').text(command.package + ': '));
		suggestion.append($('<span>').addClass('description').text(command.name));
		if (command.shortcut)
			suggestion.append($('<span>').addClass('shortcut').text(command.shortcut));
		return suggestion;
	}

	var commandFieldVal = $('#commandField').val();
	if (commandFieldVal == '') {
		for (var i = commands.length - 1; i >= 0; i--) {
			var suggestion = createSuggestion(commands[i]);
			suggestions.prepend(suggestion);
		}
	} else {
		var results = commandsFuzzySearch.search(commandFieldVal);
		for (var j = results.length - 1; j >= 0; j--) {
			var suggestion = createSuggestion(results[j]);
			suggestions.prepend(suggestion);
		};
	}
	$('.suggestion').first().addClass('selected');
}

/*
 * Runs the suggestion that is currently selected.  This defaults to the first.
 */
function runSelectedSuggestion() {
	var slug = $('.selected').data('slug');
	for (var i = commands.length - 1; i >= 0; i--) {
		if (slug == commands[i].slug) {
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
		scrollTop: $(suggestion).offset().top - (140)
	}, 100);
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