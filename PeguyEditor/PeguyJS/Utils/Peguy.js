var PEGUY = 
{
	version: '20241206-1', 
	url: window.location.href,
	mode: 'classic',
	language: navigator.language || navigator.userLanguage,
	userAgent: navigator.userAgent,
	platform: navigator.platform
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("peguy");