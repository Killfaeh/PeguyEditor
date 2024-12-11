function AutoComplete()
{
	///////////////
	// Attributs //
	///////////////
	
	var value = null;
	var selectedIndex = null;
	var list = [];
	var displayedLines = new Array();
	var enable = true;
	var open = false;
	//var enlighted = null;
	var searchDate = new Date();
	var freeze = false;
	
	var html = '<div class="autoComplete" >'
					+ '<p id="selectedElement" ></p>'
				+ '</div>';
				
	var component = new Component(html);
	
	var htmlPopup = '<div id="autoCompletePopup" class="autoCompletePopup" >'
						+ '<p class="selectedBlock" >'
							+ '<input type="text" id="selectedElement" name="selectedElement" autocomplete="off" />'
							+ '<div id="truncate" class="truncate"></div>'
						+ '</p>'
						+ '<div id="panel" class="panel" >'
							+ '<table id="list" ></table>'
						+ '</div>'
					+ '</div>';
	
	var popup;
	
	var selectedElement = new InputText("text", "", "", "");
	component.getById('selectedElement').appendChild(selectedElement);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.select = function($entry)
	{
		setTimeout(function()
		{
			if (utils.isset(popup))
			{
				selectedElement.setValue(popup.getById('selectedElement').value);
				$this.buildInterface($entry, false);
				//selectedIndex = 0;
				popup.hide();
			}
		}, 400);
	};
	
	this.buildInterface = function($entry, $load)
	{
		this.emptyDisplayedLines();
		
		// A compléter quand on aura besoin d'une auto-complétion ordinaire
	};
	
	//// Gestion des lignes du panneau de sélection. ////
	
	this.emptyDisplayedLines = function()
	{
		displayedLines = new Array();
		
		if (utils.isset(popup))
			popup.getById('list').removeAllChildren();
	};
	
	this.addDisplayedLine = function($line, $lineNode)
	{
		displayedLines.push($line);
		
		if (utils.isset(popup))
			popup.getById('list').appendChild($lineNode);
	};

	//// Gestion de l'affichage du panneau de sélection. ////
	
	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true && !utils.isset(popup))
		{
			$this.onOpen();
			
			popup = new Popup(htmlPopup); 
			popup.onHide = function() { $this.close(); };
			document.getElementById('screen').appendChild(popup);
			popup.getById('selectedElement').value = selectedElement.getValue();
			popup.getById('selectedElement').focus();
			
			popup.getById('selectedElement').addEvent('keyup', function($event)
			{
				Events.onTipText($event, function()
				{
					if (utils.isset(popup))
					{
						$this.buildInterface(popup.getById('selectedElement').value, true);
						$this.onResize();
						$this.onTyping(popup.getById('selectedElement').value);
					}
				});
			});
		
			//popup.getById('selectedElement').onchange = function()
			popup.getById('selectedElement').onChange = function()
			{
				if (utils.isset(popup))
				{
					$this.buildInterface(popup.getById('selectedElement').value, true);
					$this.onResize();
				}
			};
			
			$this.onResize();
			popup.onResize = $this.onResize;
			
			open = true;
		}
	};
	
	var openPopup = function()
	{
		if (enable === true && selectedElement.getValue() !== '')
		{
			searchDate = new Date();
			$this.open();
			$this.buildInterface(selectedElement.getValue(), false);
			$this.onResize();
		}
	};
	
	this.onClose = function() {};
	
	this.close = function()
	{
		$this.onClose();
		
		if (utils.isset(popup))
		{
			selectedElement.setValue(popup.getById('selectedElement').value);
			popup = null;
		}
		
		open = false;
	};
	
	/*
	this.remove = function()
	{
		selectedElement.remove();
	};
	//*/
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onChange = function($value) {};
	this.onTyping = function($value) {};
	
	var freezeOnDown = false;
	
	selectedElement.getById('input').addEvent('keydown', function(inEvenement)
	{
		if (freeze === true)
			freezeOnDown = true;
		else
			freezeOnDown = false;
		
		if (freeze === true || freezeOnDown === true)
			Events.preventDefault(inEvenement);
	});

	selectedElement.getById('input').addEvent('keyup', function($event)
	{
		if (freeze === true)
			$event.preventDefault();
		else
		{
			Events.onTipText($event, function()
			{
				openPopup();
				$this.onTyping(selectedElement.getById('input').value);
			});
		}
		
		freezeOnDown = false;
	});

	selectedElement.onFocus = function() { openPopup(); };
	selectedElement.onChange = function() { openPopup(); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getById = function($id)
	{
		var node = this.execSuper('getById', [$id]);

		if (!utils.isset(node) && utils.isset(popup))
			node = popup.getById($id);
			
		return node;
	};
	
	this.getElementsByClass = function($className)
	{
		var nodes = component.getElementsByClassName($className);

		if (nodes.length <= 0 && utils.isset(popup))
			nodes = popup.getElementsByClassName($className);
			
		return nodes;
	};
	
	this.getValue = function() { return selectedElement.getValue(); };
	this.getSelectedIndex = function() { return selectedIndex; };
	this.getList = function() { return list; };
	this.getDisplayedLine = function($index) { return displayedLines[$index]; };
	this.getDisplayedLines = function() { return displayedLines; };
	this.isEnable = function() { return enable; };
	this.isOpen = function() { return open; };
	this.getSearchDate = function() { return searchDate; };
	this.isFreeze = function() { return freeze; };
	
	// SET
	this.setValue = function($value)
	{
		selectedElement.setValue($value);
		
		if (utils.isset(popup))
			popup.getById('selectedElement').value = $value;
	};
	
	this.setSelectedIndex = function($index) { selectedIndex = $index; };
	
	this.setPlaceholder = function($placeholder)
	{
		selectedElement.setPlaceholder($placeholder);
		
		if (utils.isset(popup))
			popup.getById('selectedElement').setAttribute('placeholder', $placeholder);
	};
	
	this.setList = function($list) { list = $list; };
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
		{
			selectedElement.getById('input').removeAttribute('disabled');

			if (utils.isset(popup))
				popup.getById('selectedElement').removeAttribute('disabled');
		}
		else
		{
			selectedElement.getById('input').setAttribute('disabled', true);

			if (utils.isset(popup))
				popup.getById('selectedElement').setAttribute('disabled', true);
		}
	};
	
	this.setFreeze = function($freeze) { freeze = $freeze; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("autoComplete");