WebCommand
==========

WebCommand is a chrome extention that allows you to use a fuzzy searching command pallete to accomplish almost any task
using only your keyboard.  Chrome has many shortcuts, but remembering them all can be difficult.  Use WebCommand to
do these tasks without memorize every shortcut.

1) Open WebCommand by pressing Ctrl+Shift+P

2) Begin typing what you would like to do.

Don't worry about typing everything perfectly.  WebCommand uses fuzzy searching so using only a few character is often
enough to find the command you are looking for.

ie. Say you would like to clear your web cache.  Press Ctrl+Shift+P to open WebCommand then type "cache" and press enter.


Commands can be easily added to WebCommand, and in the future I would like to add the ability to add cross-extention
commands.


If you are interested in helping with WebCommand please send me a message.


Suggestion Object:
	Name - string
	image - string - optional
	description - string - optional
	shortcut - {windows - string, mac - string, linux - string} - optional
	callBack - function
	param - string - optional