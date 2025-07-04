var PEGUY = 
{
	version: '20250117-1', 
	url: window.location.href,
	mode: 'classic',
	language: navigator.language || navigator.userLanguage,
	userAgent: navigator.userAgent,
	platform: navigator.platform,
	glPrecision: 7,

	appendToMain: function($node)
	{
		document.getElementById('main').appendChild($node);
	},

	appendToScreen: function($node)
	{
		document.getElementById('screen').appendChild($node);
	},

	emptyScreen: function()
	{
		document.getElementById('screen').empty();
	},

	mousePosition: function($event)
	{
		return document.getElementById('main').mousePosition($event);
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("peguy");