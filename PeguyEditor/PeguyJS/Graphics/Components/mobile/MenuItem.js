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
					+ '<ul id="children-list" class="children-list" >'
						+ '<li id="backItem" class="menuItem backItem" >'
							+ '<div id="menu-item-label" class="menu-item-label" >'
								+ '<span id="backArrow" class="backArrow">◄</span>'
								+ "Back"
							+ '</div>'
						+ '</li>'
					+ '</ul>'
				+ '</li>';
				
	var component = new Component(html);
	
	var deploy = false;
	var updated = false;
	var disable = false;
	var parentMenu = null;
	var elementsList = [];
	
	var backItem = component.getById('backItem');
	backItem.style.display = 'none';
	
	//////////////
	// Méthodes //
	//////////////
	
	var initPosition = function()
	{
		component.getById('children-list').style.height = "unset";
	};

	this.update = function()
	{
		if (elementsList.length > 0)
		{
			if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar'))
				component.getById('arrow').style.display = 'inline';
			else
				component.getById('arrow').style.display = 'none';
			
			backItem.style.display = 'block';
			
			if (deploy === true)
			{
				initPosition();
				var panelPosition = component.getById('children-list').position();
				
				var top = parseInt(component.getById('children-list').getStyle('top').replace('px', ''));
				
				if (top !== -1)
				{
					var borderTopWidth = parseInt(component.getById('children-list').getStyle('border-top-width').replace('px', ''));
					var borderBottomWidth = parseInt(component.getById('children-list').getStyle('border-bottom-width').replace('px', ''));
					var marginTop = parseInt(component.getById('children-list').getStyle('margin-top').replace('px', ''));
					var marginBottom = parseInt(component.getById('children-list').getStyle('margin-bottom').replace('px', ''));
					var paddingTop = parseInt(component.getById('children-list').getStyle('padding-top').replace('px', ''));
					var paddingBottom = parseInt(component.getById('children-list').getStyle('padding-bottom').replace('px', ''));
					
					console.log("Screen height : " + Screen.getHeight());
					console.log("Panel position Y : " + panelPosition.y);
					
					component.getById('children-list').style.height = (Screen.getHeight() - panelPosition.y + top
																		- borderTopWidth - borderBottomWidth - marginTop - marginBottom - paddingTop - paddingBottom) 
																		+ 'px';
				}
				
				updated = true;
			}
		}
		else
		{
			component.getById('arrow').style.display = 'none';
			backItem.style.display = 'none';
		}
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
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].unlightAll();
		}
	};
	
	this.display = function()
	{
		if (deploy === true)
		{
			component.getById('children-list').style.display = 'block';
			$this.update();
		}
	};
	
	this.hide = function()
	{
		component.getById('children-list').style.display = 'none';
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
		else if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar') && deploy === false)
		{
			parentMenu.closeAllChildren();
			$this.open();
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
				parentMenu.setOpen(true);
				parentMenu.closeAllChildren();
				$this.open();
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
			}
		}
	};
	
	this.onContextMenu = function($event) { Events.preventDefault($event); };
	
	this.onMouseOut = function() {};
	backItem.onClick = function() { $this.close(); };
	
	component.getById('children-list').onClick = component.getById('children-list').onContextMenu = function($event)
	{
		$this.closeParent();
	};
	
	this.onResize = function() { $this.update(); };

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