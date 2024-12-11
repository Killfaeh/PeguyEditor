function MenuItem($label)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;

	var html = '<li class="menuItem" >'
					+ '<div id="menu-item-label" class="menu-item-label" >'
						+ label
						+ '<span id="arrow" class="arrow">►</span>'
					+ '</div>'
					+ '<ul id="children-list" class="children-list" ></ul>'
				+ '</li>';
				
	var component = new Component(html);
	
	var deploy = false;
	var updated = false;
	var disable = false;
	var parentMenu = null;
	var elementsList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	var initPosition = function()
	{
		if (parentMenu.isClass('menuBar'))
		{
			component.getById('children-list').setStyle("left", "0px");
			component.getById('children-list').setStyle("top", "100%");
		}
		else
		{
			component.getById('children-list').setStyle("left", "100%");
			component.getById('children-list').setStyle("top", "0px");
		}
		
		component.getById('children-list').setStyle("right", "unset");
		component.getById('children-list').setStyle("bottom", "unset");
		
		component.getById('children-list').setStyle("width", "unset");
		component.getById('children-list').setStyle("height", "unset");
		
		component.getById('children-list').setStyle("overflow", "unset");
	};

	this.update = function()
	{
		if (elementsList.length > 0)
		{
			if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar'))
				component.getById('arrow').style.display = 'inline';
			else
				component.getById('arrow').style.display = 'none';
			
			if (deploy === true && updated === false)
			{
				initPosition();
				
				// Gérer le cas où la liste sort de l'écran
				var parentWidth = parentMenu.offsetWidth;
				var parentHeight = parentMenu.offsetHeight;
				var parentPosition = parentMenu.position();
				var panelWidth = component.getById('children-list').offsetWidth;
				var panelHeight = component.getById('children-list').offsetHeight;
				var panelPosition = component.getById('children-list').position();
				
				//console.log(panelPosition);
				//console.log("Panel height : " + panelHeight);
				//console.log("Screen height : " + Screen.getHeight());
				
				// Si la hauteur ou la largeur est plus grande que celle de l'écran
				
				if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
				{
					if (panelHeight > Screen.getHeight())
					{
						component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
						component.getById('children-list').setStyle("top", "10px");
					}
					
					if (panelWidth > Screen.getWidth())
					{
						component.getById('children-list').setStyle("width", (Screen.getWidth()-20) + "px");
						component.getById('children-list').setStyle("left", "10px");
					}
				}
				else
					component.getById('children-list').setStyle("overflow", "unset");
				
				// Cas de la barre de menu
				if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
				{
					// Contrôle de la hauteur
					if (panelHeight <= Screen.getHeight())
					{
						// Si la hauteur dépasse de l'écran
						if (panelPosition.y + panelHeight > Screen.getHeight())
						{
							component.getById('children-list').setStyle("top", "unset");
							component.getById('children-list').setStyle("bottom", "100%");
						}
						else
						{
							component.getById('children-list').setStyle("height", "unset");
							component.getById('children-list').setStyle("top", "100%");
							component.getById('children-list').setStyle("bottom", "unset");
						}
						
						// Contrôle de la largeur
						if (panelWidth <= Screen.getWidth())
						{
							// Si la largeur dépasse de l'écran
							if (panelPosition.x + panelWidth > Screen.getWidth())
							{
								var rightCornerPosition = panelPosition.x + $this.offsetWidth;
								
								console.log(Screen.getWidth() + ', ' + panelPosition.x + ', ' + $this.offsetWidth + ', ' + rightCornerPosition);
								
								component.getById('children-list').setStyle("left", "unset");
								
								if (rightCornerPosition <= Screen.getWidth())
									component.getById('children-list').setStyle("right", "0px");
								else
									component.getById('children-list').setStyle("right", (rightCornerPosition-Screen.getWidth()) + "px");
							}
							else
							{
								component.getById('children-list').setStyle("width", "unset");
								component.getById('children-list').setStyle("right", "unset");
								component.getById('children-list').setStyle("left", "0px");
							}
						}
					}
				}
				// Mode contextuel
				else
				{
					// Contrôle de la hauteur
					if (panelHeight <= Screen.getHeight())
					{
						// Si la hauteur dépasse de l'écran
						if (panelPosition.y + panelHeight > Screen.getHeight())
						{
							component.getById('children-list').setStyle("top", "unset");
							component.getById('children-list').setStyle("bottom", (panelPosition.y+$this.offsetHeight-Screen.getHeight()) + "px");
						}
						else
						{
							component.getById('children-list').setStyle("height", "unset");
							component.getById('children-list').setStyle("top", "0px");
							component.getById('children-list').setStyle("bottom", "unset");
						}
					}
					
					// Contrôle de la largeur
					if (panelWidth <= Screen.getWidth())
					{
						// Si la largeur dépasse de l'écran
						if (panelPosition.x + panelWidth > Screen.getWidth())
							component.getById('children-list').setStyle("left", (-panelWidth) + "px");
						else
						{
							component.getById('children-list').setStyle("width", "unset");
							component.getById('children-list').setStyle("left", "100%");
						}
					}
				}
				
				updated = true;
			}
		}
		else
			component.getById('arrow').style.display = 'none';
	};

	this.addElement = function($element)
	{
		elementsList.push($element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').appendChild($element);
		$this.update();
	};
	
	this.insertElementInto = function($element, $index)
	{
		elementsList.splice($index, 0, $element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').insertAt($element, $index);
		$this.update();
	};
	
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		while (index >= 0)
		{
			if (index > -1)
				elementsList.splice(index, 1);
			
			index = elementsList.indexOf($element);
		}
		
		var parent = $element.parentNode;
		
		if (parent === component.getById('children-list'))
			component.getById('children-list').removeChild($element);
		
		$this.update();
		
		if (utils.isset($element.setParent))
			$element.setParent(null);
		
		return $element;
	};

	this.removeAllElements = function()
	{
		while (elementsList.length > 0)
			$this.removeElement(elementsList[0]);
	};
	
	this.open = function()
	{
		if (elementsList.length > 0 && deploy === false)
		{
			deploy = true;
			updated = false;
			$this.addClass('enlighted');
			component.getById('children-list').style.display = 'block';
			$this.update();
		}
	};
	
	this.openAll = function()
	{
		if (elementsList.length > 0)
		{
			deploy = true;
			updated = false;
			$this.addClass('enlighted');
			component.getById('children-list').style.display = 'block';
			$this.update();
			
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].openAll))
					elementsList[i].openAll();
			}
		}
	};
	
	this.close = function()
	{
		deploy = false;
		updated = false;
		$this.removeClass('enlighted');
		component.getById('children-list').style.display = 'none';
		$this.update();
	};
	
	this.closeAllChildren = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};
	
	this.closeAll = function()
	{
		deploy = false;
		updated = false;
		$this.removeClass('enlighted');
		component.getById('children-list').style.display = 'none';
		$this.update();
		$this.closeAllChildren();
	};
	
	this.closeParent = function()
	{
		if (utils.isset(parentMenu))
			parentMenu.closeParent();
	};
	
	this.unlightAll = function()
	{
		if (deploy === false)
			$this.removeClass('enlighted');
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].unlightAll))
				elementsList[i].unlightAll();
		}
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	var doNothing = function() {};
	this.onAction = doNothing;
	
	component.getById('menu-item-label').onClick = function($event)
	{
		if (disable === false && utils.isset($this.onAction) && $this.onAction !== doNothing && $event.button === 0)
		{
			$this.onAction($event);
			$this.closeParent();
		}
		else if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			if (deploy === true || elementsList.length <= 0)
			{
				parentMenu.setOpen(false);
				parentMenu.closeAllChildren();
			}
			else if (deploy === false)
			{
				parentMenu.closeAllChildren();
				parentMenu.setOpen(true);
				$this.open();
				$this.addClass('enlighted');
			}
		}
	};
	
	this.onClick = function($event)
	{
		if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			if (deploy === true || elementsList.length <= 0)
			{
				parentMenu.setOpen(false);
				parentMenu.closeAllChildren();
			}
			else if (deploy === false)
			{
				parentMenu.setOpen(true);
				parentMenu.closeAllChildren();
				$this.open();
				$this.addClass('enlighted');
			}
		}
	};
	
	this.onContextMenu = function($event) { Events.preventDefault($event); };
	
	this.onMouseOver = function()
	{
		if (utils.isset(parentMenu) 
				&& ((!parentMenu.isClass('menuBar') && deploy === false) 
					|| (parentMenu.isClass('menuBar') && parentMenu.isOpen() && deploy === false)))
		{
			parentMenu.closeAllChildren();
			
			if (utils.isset(parentMenu.setOpen))
				parentMenu.setOpen(true);
			
			$this.open();
			$this.addClass('enlighted');
		}
	};
	
	this.onMouseOut = function() {};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getLabel = function() { return label; };
	this.getElementsList = function() { return elementsList; };
	this.getListNode = function() { return component.getById('children-list'); };
	
	// SET
	
	this.setDisable = function($disable)
	{
		disable = $disable;

		if (disable === true)
			$this.addClass('disable');
		else
			$this.removeClass('disable');
	};

	this.setParent = function($parentMenu) { parentMenu = $parentMenu; }
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("menuItem");