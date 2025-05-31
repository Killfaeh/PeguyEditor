
///////////////////////////////////////////////////
// Fonctions relatives au traitement des données //
///////////////////////////////////////////////////

var Debug = 
{
	mode: false,
	console: null,
	consoleKey: 'F6',
	onError: function($message, $source, $lineno, $colno, $error) {},
	
	callstack: function()
	{
		var stack = (new Error()).stack.replace(/\n/gi, '<br />');
		
		if (utils.isset(Debug.console))
			Debug.console.log(stack);
	},
	
	// Affiche les propriétés de l'objet passé en paramètre
	parseProperties: function($element)
	{
		console.log("Properties of ");
		console.log($element);
		console.log('');
		
		for (var name in $element)
		{
			console.log("Property " + name + " : ");
			console.log($element[name]);
			console.log('');
		}
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("debug");