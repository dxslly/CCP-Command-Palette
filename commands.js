/*
Command Object:
	slug - String: A short string representation with no spaces
	name - String: A full string of the command's name
	description - String: A brief description of what the command does
	functionCall - Function: The function that is called when the command is run
*/

var about = {
	'slug': 'about',
	'package': 'Help',
	'name': 'About',
	'description': 'Opens a helpful window',
	'funcitonName': 'f_about'
}

function f_about() {
	chrome.tabs.create({'url': 'about.html'});
}

var openNewTab = {
	'slug': 'openNewTab',
	'package': 'Tab',
	'name': 'Open New',
	'description': 'Opens and switches to a new tab',
	'funcitonName': 'f_openNewTab'
}

function f_openNewTab(url) {
	chrome.tabs.create({});
}

var reloadTab = {
	'slug': 'reloadTab',
	'package': 'Tab',
	'name': 'Reload',
	'description': 'Reloads the current tab',
	'funcitonName': 'f_reloadTab'
}

function f_reloadTab() {
	chrome.tabs.reload();
}

commands = [about,openNewTab,reloadTab];

function testFunction() {
	console.log('Test funciton called');
}