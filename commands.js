/*
Command Object:
	slug - String: A short string representation with no spaces
	name - String: A full string of the command's name
	description - String: A brief description of what the command does
	functionCall - Function: The function that is called when the command is run
*/

var newTab = {
	'slug': 'newtab',
	'name': 'New Tab',
	'description': 'Opens and switches to a new tab',
	'functionCall':  'newTabFunc'
}

commands = [newTab];

function newTabFunc(url) {
	var createProperties = {}
	if (url)
		createProperties.url = url;
	chrome.tabs.create(createProperties);
}