var Components =
{
	/////////////////////////////////////
	// Gestion générale des composents //
	/////////////////////////////////////
		
	nbComponents:		0,
	componentsList:		[],
	
	getById: function($id)
	{
		var output = null;
		
		for (var i = 0; i < Components.componentsList.length; i++)
		{
			output = Components.componentsList[i].getById($id);
			
			if (utils.isset(output))
				i = Components.componentsList.length;
		}
		
		return output;
	},
	
	getComponentById: function($id)
	{
		var output = null;
		
		for (var i = 0; i < Components.componentsList.length; i++)
		{
			if (Components.componentsList[i].getId() === $id)
			{
				output = Components.componentsList[i];
				i = Components.componentsList.length;
			}
		}
		
		return output;
	},
	
	//////////////////////////
	// Gestion des fenêtres //
	//////////////////////////
	
	nbFrames: 0,
	framesList: [],
	
	addFrame: function($frame)
	{
		for (var i = 0; i < Components.framesList.length; i++)
			Components.framesList[i].onBlurFrame();
		
		Components.nbFrames++;
		Components.framesList.push($frame);
		Components.focusFrame($frame);
	},
	
	removeFrame: function($frame)
	{
		var index = Components.framesList.indexOf($frame);
		
		if (index >= 0)
		{
			Components.nbFrames--;
			Components.framesList.splice(index, 1);
		}
	}, 
	
	removeAllFrames: function()
	{
		var tmpList = [];
		
		for (var i = 0; i < Components.framesList.length; i++)
			tmpList.push(Components.framesList[i]);
		
		for (var i = 0; i < tmpList.length; i++)
			tmpList[i].hide();
		
		Components.framesList = [];
		Components.nbFrames = 0;
	},
	
	focusFrame: function($frame)
	{
		var index = Components.framesList.indexOf($frame);
		
		if (index >= 0)
			Components.framesList.splice(index, 1);
		else
			Components.nbFrames++;
		
		Components.framesList.push($frame);
		
		var parentNode = $frame.parentNode;
		
		/*
		if (utils.isset(parentNode))
			parentNode.appendChild($frame);
		else
			document.getElementById('main').appendChild($frame);
		//*/
		
		if (Components.framesList.length > 0)
		{
			var zIndexMin = parseInt(Components.framesList[0].getStyle('z-index'));
			
			for (var i = 0; i < Components.framesList.length; i++)
				Components.framesList[i].style.zIndex = zIndexMin + i;
		}
		
		for (var i = 0; i < Components.framesList.length; i++)
			Components.framesList[i].onBlurFrame();
		
		$frame.onFocusFrame();
		$frame.focus();
	},
	
	focusLastFrame: function()
	{
		if (Components.framesList.length > 0)
			Components.focusFrame(Components.framesList[Components.framesList.length-1]);
	},
	
	////////////////////////
	// Gestion des popups //
	////////////////////////
	
	nbPopups: 0,
	popupsList: [],
	
	addPopup: function($popup)
	{
		Components.nbPopups++;
		Components.popupsList.push($popup);
	},
	
	removePopup: function($popup)
	{
		var index = Components.popupsList.indexOf($popup);
		
		if (index >= 0)
		{
			Components.nbPopups--;
			Components.popupsList.splice(index, 1);
		}
	},
	
	removeAllPopups: function()
	{
		var tmpList = [];
		
		for (var i = 0; i < Components.popupsList.length; i++)
			tmpList.push(Components.popupsList[i]);
		
		for (var i = 0; i < tmpList.length; i++)
			tmpList[i].hide();
		
		Components.popupsList = [];
		Components.nbPopups = 0;
	},
	
	////////////////////////////
	// Gestion des input text //
	////////////////////////////
	
	nbInputText: 0,
	inputTextList: [],
	
	addInputText: function($inputText)
	{
		Components.nbInputText++;
		Components.inputTextList.push($inputText);
	},
	
	removeInputText: function($inputText)
	{
		var index = Components.inputTextList.indexOf($inputText);
		
		if (index >= 0)
		{
			Components.nbInputText--;
			Components.inputTextList.splice(index, 1);
		}
	},
	
	focusAllInputText: function()
	{
		for (var i = 0; i < Components.inputTextList.length; i++)
			Components.inputTextList[i].focus();
	},
	
	blurAllInputText: function()
	{
		for (var i = 0; i < Components.inputTextList.length; i++)
			Components.inputTextList[i].blur();
	},
	
	//////////////////////////
	// Gestion des tooltips //
	//////////////////////////
	
	toolTipsList: [],
	
	addToolTip: function($tooltip)
	{
		for (var i = 0; i < Components.toolTipsList.length; i++)
		{
			//document.getElementById('main').removeChild(Components.toolTipsList[i]);
			Components.toolTipsList[i].endFadeOut();
		}
		
		Components.toolTipsList = [];
		Components.toolTipsList.push($tooltip);
	},
	
	removeToolTip: function($toolTip)
	{
		if (utils.isset($toolTip.parentNode))
			$toolTip.parentNode.removeChild($toolTip);
		
		var index = Components.toolTipsList.indexOf($toolTip);
		
		if (index >= 0)
			Components.toolTipsList.splice(index, 1);
	},
	
	/////////////////////////////////////////////////////
	// Gestion de l'envoie de fichiers par des iframes //
	/////////////////////////////////////////////////////
	
	iframeOnload: {},
	
	iframeOnLoadExec: function($id)
	{
		if (utils.isset(Components.iframeOnload[$id]))
			Components.iframeOnload[$id]();
	},
	
	//////////////////////
	// Gestion du focus //
	//////////////////////
	
	focusList: [],
	
	addFocus: function($component)
	{
		Components.removeFocus($component);
		Components.focusList.push($component);
	},
	
	removeFocus: function($component)
	{
		var index = Components.focusList.indexOf($component);
		
		if (index >= 0)
			Components.focusList.splice(index, 1);
	},
	
	////////////////////////////////////////////////////////////
	// Diffuser certains événements au travers des composents //
	////////////////////////////////////////////////////////////
	
	onResize: function()
	{
		for (var i = 0; i < Components.componentsList.length; i++)
			Components.componentsList[i].onResize();
	},
	
	onEndResize: function()
	{
		for (var i = 0; i < Components.componentsList.length; i++)
			Components.componentsList[i].onEndResize();
	},
	
	onKeyDown: function($event)
	{
		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onKeyDown($event);
	},
	
	onKeyUp: function($event)
	{
		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onKeyUp($event);
	},

	onGamepadConnected: function($event)
	{
		console.log('Connect gamepad');

		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onGamepadConnected($event);
	},

	onGamepadDisconnected: function($event)
	{
		console.log('Disconnect gamepad');

		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onGamepadDisconnected($event);
	},

	onGamepadButtonDown: function($event)
	{
		console.log('BUTTON DOWN: ' + $event.buttonCode);

		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onGamepadButtonDown($event);
	},

	onGamepadButtonUp: function($event)
	{
		console.log('BUTTON UP: ' + $event.buttonCode);

		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onGamepadButtonUp($event);
	},

	onGamepadAxisChange: function($event)
	{
		//console.log('AXIS CHANGE: ' + $event.axisCode + ', ' + $event.value);
		// Va de -1 à 1

		if (Components.focusList.length > 0)
			Components.focusList[Components.focusList.length-1].onGamepadAxisChange($event);
	},
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("components");