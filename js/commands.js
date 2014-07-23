/*
	Suggestion Object:
		caption - string
		command:string
		args:obj - optional
		image:string - optional
		description:string - optional
		shortcut:{windows:[string], mac:[string], linux:[string]} - optional
		closeOnComplete:bool - optional - Defaults to false
*/

// Suggestions

_suggestions = [
	{ 'caption': 'About', 'command': 'openNewTab', 'args': {'url': 'about.html'} },
	{ 'caption': 'Browser Data: Clear Cache', 'command': 'removeBrowsingData', 'args': {'dataToRemove': {'cache': true}, 'options': {} }, 'closeOnComplete': true, 'shortcut': {'windows': ['Ctrl','Shift','Delete']} },
	{ 'caption': 'Browser Data: Delete History', 'command': 'suggestHistory', 'shortcut': {'windows': ['Ctrl','Shift','Delete'], 'mac': ['⌘','⇧','⌫']} },
	{ 'caption': 'Goto: Downloads', 'command': 'openNewTab', 'args': {'url': 'chrome://downloads/'}, 'shortcut': {'windows': ['Ctrl','Shift','J'], 'mac': ['⌘','⇧','J']} },
	{ 'caption': 'Goto: Extentions', 'command': 'openNewTab', 'args': {'url': 'chrome://extensions/'} },
	{ 'caption': 'Goto: Bookmarks', 'command': 'openNewTab', 'args': {'url': 'chrome://bookmarks/'} },
	{ 'caption': 'Goto: History', 'command': 'openNewTab', 'args': {'url': 'chrome://history/'}, 'shortcut': {'windows': ['Ctrl','H'], 'mac': ['⌘','H']} },
	{ 'caption': 'Goto: Settings', 'command': 'openNewTab', 'args': {'url': 'chrome://settings/'} },
	{ 'caption': 'Goto: Keyboard Shortcuts Setting', 'command': 'openNewTab', 'args': {'url': 'chrome://extensions/configureCommands'} },
	{ 'caption': 'Page: Print', 'command': 'printPage', 'shortcut': {'windows': ['Ctrl','P'], 'mac': ['⌘','P']} },
	{ 'caption': 'Tab: Close Current', 'command': 'closeCurrentTab', 'shortcut': {'windows': ['Ctrl','W'], 'mac': ['⌘','W']} },
	{ 'caption': 'Tab: Close All Others', 'command': 'closeAllOtherTabs' },
	{ 'caption': 'Tab: Duplicate Current', 'command': 'duplicateCurrentTab' },
	{ 'caption': 'Tab: Open New', 'command': 'openNewTab', 'args': {}, 'shortcut': {'windows': ['Ctrl','T'], 'mac': ['⌘','T']} },
	{ 'caption': 'Tab: Reload Current',	'command': 'reloadCurrentTab', 'shortcut': {'windows': ['Ctrl','R'], 'mac': ['⌘','R']} },
	{ 'caption': 'Tab: Restore Closed',	'command': 'suggestClosedTab' },
	{ 'caption': 'Tab: Switch To', 'command': 'suggestTabs', 'closeOnComplete': false },
	{ 'caption': 'Tab: Toggle Pin',	'command': 'toggleTabPin' },
	{ 'caption': 'Window: Open New', 'command': 'createWindow', 'shortcut': {'windows': ['Ctrl','N'], 'mac': ['⌘','N']} },
	{ 'caption': 'Window: Open New Incognito', 'command': 'createWindow', 'args': {'incognito': true}, 'shortcut': {'windows': ['Ctrl','Shift','N'], 'mac': ['⌘','⇧','N']} }
];

// Suggest Functions. Pass object to suggestion's callBacks

function suggestClosedTab() {
	var suggestions = [];
}

function suggestHistory() {
	var date = new Date();
	var currentTime = date.getTime();
	var hour = 3600000;
	var day = 24 * hour;
	var week = 7 * day;
	var suggesitons = [
		{ 'caption': 'The past hour', 'command': 'removeBrowsingData', 'args': {'options' : {'since': currentTime - hour}, 'dataToRemove': {'history': true}}, 'closeOnComplete': true },
		{ 'caption': 'The past day', 'command': 'removeBrowsingData', 'args': {'options' : {'since': currentTime - day}, 'dataToRemove': {'history': true}}, 'closeOnComplete': true },
		{ 'caption': 'The past week', 'command': 'removeBrowsingData', 'args': {'options' : {'since': currentTime - week}, 'dataToRemove': {'history': true}}, 'closeOnComplete': true },
		{ 'caption': 'The last 4 weeks', 'command': 'removeBrowsingData', 'args': {'options' : {'since': currentTime - (4 * week)}, 'dataToRemove': {'history': true}}, 'closeOnComplete': true },
		{ 'caption': 'The beginning of time', 'command': 'removeBrowsingData', 'args': {'options' : {'since': 0}, 'dataToRemove': {'history': true}}, 'closeOnComplete': true }
	];
	suggestToUser(suggesitons, 'Choose a time frame');
}

function suggestTabs() {
	chrome.windows.getAll({ 'populate': true }, function(windows) {
		var suggestions = [];
		for (var i = windows.length - 1; i >= 0; i--) {
			for (var j = windows[i].tabs.length - 1; j >= 0; j--) {
				var suggestion = {};
				var currentTab = windows[i].tabs[j];
				suggestion.caption = currentTab.title + ' - ' + currentTab.url;
				suggestion.command = 'updateTab';
				suggestion.args = { 'tabId': currentTab.id, 'updateProperties': { 'active': true } };
				console.log(currentTab.favIconUrl);
				if (currentTab.favIconUrl == '' || currentTab.favIconUrl === undefined)
					suggestion.image = 'images/defaultFavicon.png';
				else
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

function closeAllOtherTabs() {
	chrome.windows.getCurrent({populate: true}, function(window) {
		var tabIDs = [];
		for (var i = window.tabs.length - 1; i >= 0; i--) {
			var currentTab = window.tabs[i];
			if (!currentTab.pinned && !currentTab.active)
				tabIDs.push(window.tabs[i].id);
		};
		chrome.tabs.remove(tabIDs);
	});
}

function getCurrentTab(callBack) {
	chrome.windows.getCurrent({populate: true}, function(window) {
		for (var i = window.tabs.length - 1; i >= 0; i--) {
			if (window.tabs[i].active)
				if (callBack)
					callBack(window.tabs[i]);
		};
	});
}

function closeCurrentTab() {
	getCurrentTab(function(tab) {
		chrome.tabs.remove(tab.id);
	});
}

function toggleTabPin() {
	getCurrentTab(function(tab) {
		if (tab.pinned)
			chrome.tabs.update(tab.id, { 'pinned': false });
		else
			chrome.tabs.update(tab.id, { 'pinned': true });
	});
}

function duplicateCurrentTab() {
	getCurrentTab(function(tab) {
		chrome.tabs.duplicate(tab.id);
	});
}

function reloadCurrentTab() {
	chrome.tabs.reload();
}

function createWindow(obj) {
	chrome.windows.create(obj);
}

function removeBrowsingData(obj) {
	chrome.browsingData.remove(obj.options, obj.dataToRemove);
}

function openNewTab(obj) {
	chrome.tabs.create(obj);
}

function getCommandSuggestions() {
	return _suggestions;
}
