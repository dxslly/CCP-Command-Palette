/*
	Suggestion Object:
		caption - string
		command:string
		args:obj - optional
		image:string - optional
		description:string - optional
		shortcut:{windows:[string], mac:[string], linux:[string]} - optional
*/

// Suggestions

_suggestions = [
	{ 'caption': 'About', 'command': 'openNewTab', 'args': {'url': 'about.html'} },
	{ 'caption': 'Browser Data: Delecte Cache', 'command': 'deleteCache', 'shortcut': {'windows': ['Ctrl','Shift','Delete']} },
	{ 'caption': 'Debug: Open WebCommand in Tab', 'command': 'openNewTab', 'args': {'url': 'popup.hmtl'} },
	{ 'caption': 'Tab: Close Current', 'command': 'closeCurrentTab', 'shortcut': {'windows': ['Ctrl','W'], 'mac': ['⌘','W']} },
	{ 'caption': 'Tab: Duplicate Current', 'command': 'duplicateCurrentTab' },
	{ 'caption': 'Tab: Open New', 'command': 'openNewTab', 'shortcut': {'windows': ['Ctrl','T'], 'mac': ['⌘','T']} },
	{ 'caption': 'Tab: Reload Current',	'command': 'reloadCurrentTab', 'shortcut': {'windows': ['Ctrl','R'], 'mac': ['⌘','R']} },
	{ 'caption': 'Page: Print', 'command': 'printPage', 'shortcut': {'windows': ['Ctrl','P'], 'mac': ['⌘','P']} }
];

// Functions

function printPage() {
	chrome.tabs.update(null, {url: 'javascript:window.print();'});
}

function log(obj) {
	console.log('Test funciton called');
}

function closeCurrentTab() {
	chrome.windows.getCurrent({populate: true}, function(window) {
		console.log(window);
		for (var i = window.tabs.length - 1; i >= 0; i--) {
			if (window.tabs[i].active) {
				chrome.tabs.remove(window.tabs[i].id);
			}
		};
	});
}

function duplicateCurrentTab() {
	chrome.tabs.getCurrent(function(tab) {
		chrome.tabs.duplicate(tab.id);
	});
}

function reloadCurrentTab() {
	chrome.tabs.reload();
}

function deleteCache() {
	chrome.browsingData.removeCache({});
}


function openNewTab(obj) {
	chrome.tabs.create(obj);
}

function getCommandSuggestions() {
	return _suggestions;
}