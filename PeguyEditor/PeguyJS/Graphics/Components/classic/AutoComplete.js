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
	var enlighted = null;
	var searchDate = new Date();
	var freeze = false;
	
	var emptyMessage = '';
	
	var html = '<div class="autoComplete" >'
					+ '<p class="selectedBlock" >'
						+ '<input type="text" id="selectedElement" name="selectedElement" autocomplete="off" />'
						+ '<div id="truncate" class="truncate"></div>'
					+ '</p>'
					+ '<div id="invisibleFreezeScreen" class="invisibleFreezeScreen" ></div>'
					+ '<div id="panel" class="panel autoCompletePanel" >'
						+ '<table id="list" ></table>'
					+ '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	//component.getById('invisibleFreezeScreen').style.display = "none";
	
	//var invisibleFreezeScreen = component.getById('invisibleFreezeScreen');
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	component.getById('invisibleFreezeScreen').appendChild(invisibleFreezeScreen);
	//var panel = component.getById('panel');
	//var listTable = component.getById('list');
	
	var panel = new Component(component.getById('panel'));
	var listTable = panel.getById('list' + component.getId());
	
	//////////////
	// Méthodes //
	//////////////
	
	this.select = function($entry)
	{
		//selectedIndex = $entry;
		$this.buildInterface($entry, false);
		//selectedIndex = 0;
		$this.close();
	};
	
	this.enlight = function($index)
	{
		if (displayedLines.length > 0 && utils.isset($index) && $index >= 0)
		{
			var lines = listTable.getElementsByTagName('tr');
			var line = null;
			
			for (var i = 0; i < lines.length; i++)
			{
				var index = parseInt(lines[i].getAttribute('displayNum'));
				
				if (parseInt($index) === index)
				{
					lines[i].addClass('selected');
					enlighted = index;
					line = lines[i];
				}
				else
					lines[i].removeClass('selected');
			}
			
			if (utils.isset(line))
			{
				var lineTop = parseInt(line.offsetTop);
				var lineHeight = parseInt(line.offsetHeight);
				var panelHeight = parseInt(panel.offsetHeight);
				var panelScroll = parseInt(panel.scrollTop);
				
				if (lineTop + lineHeight > panelScroll + panelHeight)
					panelScroll = lineTop - panelHeight + lineHeight;
				else if (lineTop < panelScroll)
					panelScroll = lineTop;
				
				if (utils.isset(panel.scrollTo))
					panel.scrollTo(0, panelScroll);
				else
					panel.scrollTop = panelScroll;
			}
		}
	};
	
	this.buildInterface = function($entry, $load)
	{
		this.emptyDisplayedLines();
		var displayNum = 0;
		var displayIndex = null;
		
		for (var i = 0; i < this.getList().length; i++)
		{
			var regex = RegExp($entry.removeAccents().toLowerCase());
			
			if ($entry === "" || regex.test(dataManager.encodeHTMLEntities(this.getList()[i]).removeAccents().toLowerCase()))
			{
				if (this.getList()[i] === value)
					displayIndex = displayNum;
				
				var rowHtml = '<tr row="' + i + '" displayNum="' + displayNum + '" >' 
									+ '<td>' + dataManager.encodeHTMLEntities(this.getList()[i]) + '</td>'
								+ '</tr>';
								
				var rowNode = component.stringToHtml(rowHtml);
				
				if (enable === true)
				{
					rowNode.onClick = function()
					{
						var rowIndex = this.get('row');
						
						selectedIndex = rowIndex;
						$this.select(rowIndex);
						this.style.backgroundColor = 'none';
					};
					
					rowNode.onMouseOver = function()
					{
						var rowIndex = this.get('displayNum');
						$this.enlight(rowIndex);
					};
				}
				
				this.addDisplayedLine(this.getList()[i], rowNode);
				displayNum++;
			}
		}
		
		if (this.getDisplayedLines().length <= 0)
		{
			var rowHtml = '<tr class="error" ><td>' + dataManager.encodeHTMLEntities(emptyMessage) + '</td></tr>';
			var rowNode = component.stringToHtml(rowHtml);
			listTable.appendChild(rowNode);
		}
		else if (utils.isset($this.enlight))
			$this.enlight(displayIndex);
		
		resize();
	};
	
	//// Gestion des lignes du panneau de sélection. ////
	
	this.emptyDisplayedLines = function()
	{
		displayedLines = new Array();
		listTable.removeAllChildren();
	};
	
	this.addDisplayedLine = function($line, $lineNode)
	{
		displayedLines.push($line);
		listTable.appendChild($lineNode);
	};

	//// Gestion de l'affichage du panneau de sélection. ////
	
	var resize = function()
	{
		//var componentPosition = $this.position();
		var componentPosition = component.getById('selectedElement').position();
		var componentWidth = component.getById('selectedElement').offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();
		
		invisibleFreezeScreen.resize(component.getById('selectedElement'));
		
		panel.style.zIndex = "10000000000";
		panel.style.minWidth = componentWidth + 'px';
		listTable.style.minWidth = componentWidth + 'px';
		panel.style.left = componentPosition.x + 'px';
		panel.style.top = (componentPosition.y+component.getById('selectedElement').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('selectedElement').offsetHeight + panelHeight > Screen.getHeight())
		{
			var delta = componentPosition.y + component.getById('selectedElement').offsetHeight + panelHeight - Screen.getHeight() - 25;
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.top = (componentPosition.y-delta) + "px";
		}
	};
	
	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true)
		{
			$this.onOpen();
			
			invisibleFreezeScreen.display(component.getById('selectedElement'));
			//invisibleFreezeScreen.style.display = "block";
			document.getElementById('main').appendChild(invisibleFreezeScreen);
			panel.style.display = "block";
			document.getElementById('main').appendChild(panel);
			
			resize();
			
			open = true;
		}
	};
	
	// Peut être redéfinie
	this.onClose = function()
	{
		if (open === true)
		{
			if (component.getById('selectedElement').value === '')
				selectedIndex = null;
			
			if (utils.isset(selectedIndex))
				$this.setValue(list[selectedIndex]);
			else
				$this.setValue("");
			
			if (utils.isset($this.enlight))
				$this.enlight(null);
		}
	};
	
	this.close = function()
	{
		$this.onClose();
		$this.truncateSelectedValue();
		invisibleFreezeScreen.hide();
		//invisibleFreezeScreen.style.display = "none";
		panel.style.display = "none";
		
		if (utils.isset(panel.parentNode))
			panel.parentNode.removeChild(panel);
		
		open = false;
	};
	
	this.truncateSelectedValue = function()
	{
		var textSize = utils.getInputTextSize(component.getById('selectedElement'));
		
		if (textSize.width > component.getById('selectedElement').offsetWidth-15)
			component.getById('truncate').style.display = 'block';
		else
			component.getById('truncate').style.display = 'none';
	};
	
	this.autoResize = function()
	{
		var autoCompleteSize = $this.offsetWidth;
		
		if (autoCompleteSize <= 0)
			setTimeout(function() { $this.autoResize(); }, 20);
		else
			$this.truncateSelectedValue();
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($value) {};
	this.onTyping = function($value) {};
	
	var openList = function()
	{
		if ($this.isEnable() === true)
		{
			$this.open();
			$this.buildInterface($this.getValue());
			$this.onResize();
		}
	};
	
	if (Loader.getMode() === 'classic')
	{
		component.getById('selectedElement').onClick = function() { openList(); };
		component.getById('selectedElement').onfocus = function() { openList(); };
	}
	else
	{
		component.getById('selectedElement').firstChild.onFocus = function() { openList(); };
		component.getById('selectedElement').firstChild.onChange = function() { openList(); };
	}
	
	var freezeOnDown = false;
	
	component.getById('selectedElement').addEvent('keydown', function($event)
	{
		if (freeze === true)
			freezeOnDown = true;
		else
			freezeOnDown = false;
		
		if (freeze === true || $event.keyCode === 38 || $event.keyCode === 40)
			Events.preventDefault($event);
	});
	
	component.getById('selectedElement').addEvent('keyup', function($event)
	{
		if (freeze === true || freezeOnDown === true)
			Events.preventDefault($event);
		else
		{
			//console.log("POUET ! ");
			
			if ($event.keyCode === 38 || $event.keyCode === 40)
				Events.preventDefault($event);
	
			if (enable === true)
			{
				Events.onTipText($event, function()
				{
					searchDate = new Date();
					$this.buildInterface(component.getById('selectedElement').value, true);
					$this.open();
					$this.onTyping(component.getById('selectedElement').value);
				});
			}
		}
		
		freezeOnDown = false;
	});
	
	this.onKeyDown = function($event)
	{
		if (open === true)
		{
			if ($event.keyCode === 13)
				$this.select(displayedLines[enlighted].index);
			else if ($event.keyCode === 38)
			{
				if (utils.isset(enlighted))
				{
					enlighted--;

					if (enlighted < 0)
						enlighted = 0;
				}
				else
					enlighted = displayedLines.length-1;

				$this.enlight(enlighted);
			}
			else if ($event.keyCode === 40)
			{
				if (utils.isset(enlighted))
				{
					enlighted++;

					if (enlighted >= displayedLines.length)
						enlighted = displayedLines.length-1;
				}
				else
					enlighted = 0;

				$this.enlight(enlighted);
			}
		}
	};
	
	this.onResize = function()
	{
		$this.truncateSelectedValue();
		
		if (open === true)
			resize();
	};
	
	component.onClick = function() {}; // Pour empêcher la fermeture quand on clique en dehors des boutons
	//document.getElementById('main').onClick.push(this.close);
	
	invisibleFreezeScreen.onClick = function() { $this.close(); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getById = function($id)
	{
		var node = this.execSuper('getById', [$id]);

		if (!utils.isset(node) && utils.isset(panel))
			node = panel.getById($id + component.getId());
			
		return node;
	};
	
	this.getValue = function() { return component.getById('selectedElement').get('value'); };
	this.getSelectedIndex = function() { return selectedIndex; };
	this.getList = function() { return list; };
	this.getDisplayedLine = function($index) { return displayedLines[$index]; };
	this.getDisplayedLines = function() { return displayedLines; };
	//this.getListTable = function() { return listTable; };
	this.isEnable = function() { return enable; };
	this.isOpen = function() { return open; };
	this.getEnlighted = function() { return enlighted; };
	this.getSearchDate = function() { return searchDate; };
	this.getEmptyMessage = function() { return emptyMessage; };
	this.isFreeze = function() { return freeze; };
	
	// SET
	this.setValue = function ($value)
	{
		var value = $value;
		component.getById('selectedElement').value = $value;
		$this.truncateSelectedValue();
		$this.buildInterface($value, true);
	};
	
	this.setSelectedIndex = function($index) { selectedIndex = $index; };
	
	this.setPlaceholder = function($placeholder) { component.getById('selectedElement').setAttribute('placeholder', $placeholder); };
	this.setList = function($list) { list = $list; };
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
			component.getById('selectedElement').removeAttribute('disabled');
		else
			component.getById('selectedElement').setAttribute('disabled', true);
	};
	
	this.setEmptyMessage = function($emptyMessage) { emptyMessage = $emptyMessage; };
	
	this.setFreeze = function($freeze) { freeze = $freeze; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	setTimeout(function() { $this.autoResize(); }, 20);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("autoComplete");