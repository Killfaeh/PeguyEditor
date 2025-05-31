function UsePluginPopup($plugin)
{
	///////////////
	// Attributs //
	///////////////

	var plugin = $plugin;
	var outputCode = '';
	
	var html = '<h2>' + plugin.getName() + '</h2>'
				+ '<textarea  id="input" class="input" >' + JSON.stringify(plugin.defaultParam, null, 2) + '</textarea>'
				+ '<pre  id="output" class="output" ></pre>';

	var popup = new ConfirmPopup(html);

	popup.addClass('usePluginPopup');
	popup.setOkLabel('Insert into code');
	popup.getById('output').addClass(plugin.getType());

	var createButton = new Component('<input type="button" id="createCode" class="createCode" value="Create code" />');
	popup.getById('confirmButtons').insertAfter(createButton, popup.getById('cancel'));

	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	createButton.onClick = function()
	{
		outputCode = ''; 

		var jsonStr = popup.getById("input").value;
		jsonStr = jsonStr.replaceAll('\n', '').replaceAll('\t', '');

		var jsonData = {};

		try
		{
			jsonData = JSON.parse(jsonStr);
		}
		catch ($error)
		{
			jsonData = {"error":jsonStr};
		}

		outputCode = plugin.createCode(jsonData);

		popup.getById("output").innerHTML = outputCode.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
		hljs.highlightElement(popup.getById('output'));
	};

	popup.onOk = function()
	{
		var isOk = false;

		if (outputCode !== '')
		{
			isOk = true;
			viewManager.insertCode(outputCode);
		}
		else
		{
			var infoPopup = new InfoPopup('<p>No code has been generated.</p>');
			PEGUY.appendToScreen(infoPopup);
		}

		return isOk;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("usePluginPopup");