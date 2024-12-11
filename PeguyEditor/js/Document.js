function Document($type)
{
	///////////////
	// Attributs //
	///////////////

	var type = $type;

	if (!utils.isset(type))
		type = 'javascript';

	var filePath = "";
	var saved = true;

	var html = '<div class="document" ></div>';

    var component = new Component(html);

	var codeEditor = new CodeEditor(type);
	component.appendChild(codeEditor);

	//////////////
	// Méthodes //
	//////////////

	this.focusCodeEditor = function()
	{

	};

	this.insertCode = function($code)
	{
		codeEditor.insertCode('\n\r' + $code.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>') + '\n\r');
		$this.setSaved(false);
	};

	this.restoreScroll = function() { codeEditor.restoreScroll(); };

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	codeEditor.onChange = function($code) { $this.setSaved(false); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };
	this.getCode = function() { return codeEditor.getCode(); };
	
	// SET

	this.setFilePath = function($filePath) { filePath = $filePath; };

	this.setSaved = function($saved)
	{
		saved = $saved;
		viewManager.updateSavedStatus(saved);

		if (saved === false)
			window.electronAPI.setNotSavedFiles(true);
	};

	this.setLanguage = function($language)
	{
		codeEditor.setLanguage($language);
	};

	this.setCode = function($code)
	{
		//codeEditor.setCode($code.replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
		codeEditor.setCode($code);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("document");