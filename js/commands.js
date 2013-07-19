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
	{ 'caption': 'Browser Data: Delete Cache', 'command': 'deleteCache', 'shortcut': {'windows': ['Ctrl','Shift','Delete']} },
	{ 'caption': "Debug: Echo Value", 'command': 'askForEchoValue'},
	{ 'caption': 'Debug: Open WebCommand in Tab', 'command': 'openNewTab', 'args': {'url': 'popup.html'} },
	{ 'caption': 'Goto: Downloads', 'command': 'openNewTab', 'args': {'url': 'chrome://downloads/'}, 'shortcut': {'windows': ['Ctrl','Shift','J'], 'mac': ['⌘','Shift','J']} },
	{ 'caption': 'Goto: Extentions', 'command': 'openNewTab', 'args': {'url': 'chrome://extensions/'} },
	{ 'caption': 'Goto: History', 'command': 'openNewTab', 'args': {'url': 'chrome://history/'}, 'shortcut': {'windows': ['Ctrl','H'], 'mac': ['⌘','H']}},
	{ 'caption': 'Goto: Settings', 'command': 'openNewTab', 'args': {'url': 'chrome://settings/'} },
	{ 'caption': 'Page: Print', 'command': 'printPage', 'shortcut': {'windows': ['Ctrl','P'], 'mac': ['⌘','P']} },
	{ 'caption': 'Tab: Switch To', 'command': 'suggestTabs' },
	{ 'caption': 'Tab: Close Current', 'command': 'closeCurrentTab', 'shortcut': {'windows': ['Ctrl','W'], 'mac': ['⌘','W']} },
	{ 'caption': 'Tab: Duplicate Current', 'command': 'duplicateCurrentTab' },
	{ 'caption': 'Tab: Open New', 'command': 'openNewTab', 'shortcut': {'windows': ['Ctrl','T'], 'mac': ['⌘','T']} },
	{ 'caption': 'Tab: Reload Current',	'command': 'reloadCurrentTab', 'shortcut': {'windows': ['Ctrl','R'], 'mac': ['⌘','R']} },
	{ 'caption': 'Window: Open New', 'command': 'createWindow', 'shortcut': {'windows': ['Ctrl','N'], 'mac': ['⌘','N']} }
];

// Suggest Functions. Pass object to suggestion's callBacks

function suggestTabs() {
	chrome.windows.getAll({ 'populate': true }, function(windows) {
		var suggestions = [];
		for (var i = windows.length - 1; i >= 0; i--) {
			for (var j = windows[i].tabs.length - 1; j >= 0; j--) {
				var suggestion = {};
				var currentTab = windows[i].tabs[j];
				suggestion.caption = currentTab.url;
				suggestion.command = 'updateTab';
				suggestion.args = { 'tabId': currentTab.id, 'updateProperties': { 'active': true } };
				suggestion.image = currentTab.favIconUrl;
				suggestions.push(suggestion);
			};
		};
		suggestToUser(suggestions, 'Search or Type a Tab');
	});
}

// Ask Functions. Pass string to callBack

function askForEchoValue() {
	askUser('Type a value to echo', function(str) {
		alert(str);
	});
}

// Normies

function updateTab(obj) {
	chrome.tabs.update(obj.tabId, obj.updateProperties);
}

function printPage() {
	chrome.tabs.update(null, {url: 'javascript:window.print();'});
}

function log(obj) {
	console.log(obj);
}

function closeCurrentTab() {
	chrome.windows.getCurrent({populate: true}, function(window) {
		console.log(window);
		for (var i = window.tabs.length - 1; i >= 0; i--) {
			if (window.tabs[i].active)
				chrome.tabs.remove(window.tabs[i].id);
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

function createWindow(obj) {
	chrome.window.create(obj);
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