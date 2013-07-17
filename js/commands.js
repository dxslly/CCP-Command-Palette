/*
Command Object:
	slug - String: A short string representation with no spaces
	name - String: A full string of the command's name
	description - String: A brief description of what the command does
	functionCall - Function: The function that is called when the command is run
*/

// DELETE CACHE
var deleteCache = {
	'package': 'Browsing Data',
	'name': 'Delecte Cache',
	'description': 'Removes all browsing ',
	'slug': 'deleteCache',
	'funcitonName': 'f_deleteCache'
}

function f_deleteCache() {
	chrome.browsingData.removeCache({});
}

// OPEN ABOUT PAGE
var about = {
	'package': 'Help',
	'name': 'About',
	'description': 'Opens a helpful window',
	'slug': 'about',
	'funcitonName': 'f_about'
}

function f_about() {
	chrome.tabs.create({'url': 'about.html'});
}

var print = {
	'package': 'Help',
	'name': 'Print',
	'description': 'Prints The Current Page',
	'slug': 'print',
	'funcitonName': 'f_print',
	'shortcut':'Super+P'
}

function f_print() {
	chrome.tabs.update(null, {url: 'javascript:window.print();'});
}

var pluginTab = {
	'package': 'Help',
	'name': 'Open WebCommand in Tab',
	'description': 'Opens the plugin in its own tab',
	'slug': 'pluginTab',
	'funcitonName': 'f_pluginTab'
}

function f_pluginTab() {
	chrome.tabs.create({'url': 'popup.html'});
}

var test = {
	'package': 'Help',
	'name': 'Test',
	'description': 'Prints to console',
	'slug': 'test',
	'funcitonName': 'f_reloadTab'
}

function testFunction() {
	console.log('Test funciton called');
}

var closeTab = {
	'package': 'Tab',
	'name': 'Close Current',
	'description': 'Closes the current tab',
	'slug': 'closeTab',
	'funcitonName': 'f_closeTab',
	'shortcut': 'Super+W'
}

function f_closeTab() {
	chrome.windows.getCurrent({populate: true}, function(window) {
		console.log(window);
		for (var i = window.tabs.length - 1; i >= 0; i--) {
			if (window.tabs[i].active) {
				chrome.tabs.remove(window.tabs[i].id);
			}
		};
	});
}

var duplicateTab = {
	'package': 'Tab',
	'name': 'Duplicate Current',
	'description': 'Duplicates the current tab',
	'slug': 'duplicateTab',
	'funcitonName': 'f_duplicateTab'
}

function f_duplicateTab() {
	chrome.tabs.getCurrent(function(tab) {
		chrome.tabs.duplicate(tab.id);
	});
}

var openNewTab = {
	'package': 'Tab',
	'name': 'Open New',
	'description': 'Opens and switches to a new tab',
	'slug': 'openNewTab',
	'funcitonName': 'f_openNewTab',
	'shortcut': 'Super+T'
}

function f_openNewTab(url) {
	chrome.tabs.create({});
}

var reloadTab = {
	'package': 'Tab',
	'name': 'Reload',
	'description': 'Reloads the current tab',
	'slug': 'reloadTab',
	'funcitonName': 'f_reloadTab',
	'shortcut': 'Super+R'
}

function f_reloadTab() {
	chrome.tabs.reload();
}

commands = [
	deleteCache,
	about,
	print,
	pluginTab,
	test,
	duplicateTab,
	closeTab,
	openNewTab,
	reloadTab
];
