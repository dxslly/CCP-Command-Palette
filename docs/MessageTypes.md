# Message Types

## GetCommandList
Requests an app to respond with a list of commands it can run.

{
	'action': 'GetCommandList',
}

The expected response is in the form
{
	'commands' : [
		{
			'caption': 'Bookmark',
			'appId': 'mmejmbfkbphlhaodnpejfnkdeekfnplc',
			'command': 'BookmarkCurrentTab',
			'shortcut': {'windows': ['Ctrl','Shift','J'], 'mac': ['⌘','⇧','J']}
		}
	]
}

## PopulateSuggestions
{
	'action': 'PopulateSuggestions',
	'suggestions' : [
		{
			'caption': 'Bookmark',
			'appId': 'mmejmbfkbphlhaodnpejfnkdeekfnplc',
			'command': 'BookmarkCurrentTab',
			'shortcut': ['⌘','⇧','J']
		}
	]
}

# Local Messages

## RunCommand
{
	'action': 'RunCommand',
	'command': {
			'caption': 'Bookmark',
			'appId': 'mmejmbfkbphlhaodnpejfnkdeekfnplc',
			'name': 'BookmarkCurrentTab',
			'shortcut': {'windows': ['Ctrl','Shift','J'], 'mac': ['⌘','⇧','J']}
	}
}