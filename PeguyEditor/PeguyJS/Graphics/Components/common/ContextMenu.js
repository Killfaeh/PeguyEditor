function ContextMenu($mouseX, $mouseY)
{
	///////////////
	// Attributs //
	///////////////

	var mouseX = $mouseX;
	var mouseY = $mouseY;

	var html = '<div class="contextMenu" >'
					+ '<ul id="children-list" class="root-children-list" >'
					+ '</ul>'
				+ '</div>';
				
	var component = new Component(html);
	
	var elementsList = [];
	
	//////////////
	// Méthodes //
	//////////////

	this.update = function()
	{
		// Gérer le cas où la liste sort de l'écran
		var panelWidth = component.getById('children-list').offsetWidth;
		var panelHeight = component.getById('children-list').offsetHeight;
		var panelPosition = component.getById('children-list').position();
		
		/*
		console.log(panelPosition);
		console.log("Panel height : " + panelHeight);
		console.log("Screen height : " + Screen.getHeight());
		//*/
		
		/*
		if (panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
			component.getById('children-list').setStyle("top", "10px");
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else if (panelPosition.y + panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("top", "unset");
			component.getById('children-list').setStyle("bottom", "10px");
		}
		else
		{
			component.getById('children-list').setStyle("height", "unset");
			component.getById('children-list').setStyle("top", panelPosition.y + "px");
			component.getById('children-list').setStyle("bottom", "unset");
			component.getById('children-list').setStyle("overflow", "unset");
		}
		//*/
		
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
			
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else
			component.getById('children-list').setStyle("overflow", "unset");
		
		if (panelHeight <= Screen.getHeight())
		{
			if (panelPosition.y + panelHeight > Screen.getHeight())
			{
				component.getById('children-list').setStyle("top", "unset");
				component.getById('children-list').setStyle("bottom", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("height", "unset");
				component.getById('children-list').setStyle("top", panelPosition.y + "px");
				component.getById('children-list').setStyle("bottom", "unset");
			}
		}
		
		if (panelWidth <= Screen.getWidth())
		{
			if (panelPosition.x + panelWidth > Screen.getWidth())
			{
				component.getById('children-list').setStyle("left", "unset");
				component.getById('children-list').setStyle("right", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("width", "unset");
				component.getById('children-list').setStyle("left", panelPosition.x + "px");
				component.getById('children-list').setStyle("right", "unset");
			}
		}
	};

	this.addElement = function($element)
	{
		elementsList.push($element);
		$element.setParent($this);
		component.getById('children-list').appendChild($element);
		$this.update();
	};
	
	this.insertElementInto = function($element, $index)
	{
		elementsList.splice($index, 0, $element);
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
		
		$element.setParent(null);
		
		return $element;
	};
	
	this.openAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].openAll))
				elementsList[i].openAll();
		}
	};
	
	this.closeAll = this.closeAllChildren = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};
	
	this.closeParent = function()
	{
		this.closeAll();
		document.getElementById('main').removeChild($this);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onCancel = function() {};

	this.onClick = function()
	{
		console.log($this);
		
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
		
		$this.onCancel();
	};
	
	component.getById('children-list').onClick = function() {};
	
	this.onContextMenu = function($event)
	{
		Events.preventDefault($event);
		
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
	};
	
	component.getById('children-list').onMouseOut = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].unlightAll();
		}
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getElementsList = function() { return elementsList; };
	this.getListNode = function() { return component.getById('children-list'); };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	document.getElementById('main').appendChild($this);
	var childrenList = component.getById('children-list');
	childrenList.style.left = mouseX + 'px';
	childrenList.style.top = mouseY + 'px';
	$this.update();
	
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("contextMenu");