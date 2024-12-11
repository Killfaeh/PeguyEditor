function MenuBar()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="menuBar" >'
					+ '<div id="background-screen" class="background-screen" ></div>'
					+ '<ul id="children-list" class="root-children-list" >'
					+ '</ul>'
				+ '</div>';
				
	var component = new Component(html);
	
	var elementsList = [];
	var isOpen = false;
	
	var menuIcon = Loader.getSVG('icons', 'menu-icon', 25, 25);
	var mobileItem = new MenuItem("");
	mobileItem.getById('menu-item-label').insertAt(menuIcon, 0);
	mobileItem.style.padding = "3px";
	mobileItem.addClass('rootMenuItem');
	
	var classicWidth = 0;
	var mode = 'classic';
	
	//////////////
	// Méthodes //
	//////////////

	this.addElement = function($element, $noresize)
	{
		elementsList.push($element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').appendChild($element);
		
		if (utils.isset($element.update))
			$element.update();
		
		if ($noresize !== true)
			$this.onResize();
	};
	
	this.insertElementInto = function($element, $index, $noresize)
	{
		elementsList.splice($index, 0, $element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').insertAt($element, $index);
		
		if (utils.isset($element.update))
			$element.update();
		
		if ($noresize !== true)
			$this.onResize();
	};
	
	this.removeElement = function($element, $noresize)
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
		
		if (utils.isset($element.setParent))
			$element.setParent(null);
		
		if ($noresize !== true)
			$this.onResize();
		
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
		$this.setOpen(false);
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};
	
	this.closeParent = function()
	{
		this.closeAll();
		$this.setOpen(false);
		//document.getElementById('main').removeChild($this);
	};
	
	var computeClassicWidth = function()
	{
		//Debug.callstack();
		
		var width = 0;
		
		for (var i = 0; i < elementsList.length; i++)
			width = width + elementsList[i].offsetWidth;
		
		//console.log("Computed width : " + width);
		
		return width;
	};
	
	var toMobile = function()
	{
		var elementsToMove = [];
		
		for (var i = 0; i < elementsList.length; i++)
			elementsToMove.push(elementsList[i]);
		
		for (var i = 0; i < elementsToMove.length; i++)
		{
			var element = elementsToMove[i];
			$this.removeElement(element, true);
			mobileItem.addElement(element);
			
			if (utils.isset(element.update))
				element.update();
		}
		
		$this.addElement(mobileItem, true);
		
		mode = 'mobile';
	};
	
	var toClassic = function()
	{
		var elementsToMove = [];
		
		for (var i = 0; i < mobileItem.getElementsList().length; i++)
			elementsToMove.push(mobileItem.getElementsList()[i]);
		
		$this.removeElement(mobileItem, true);
		
		for (var i = 0; i < elementsToMove.length; i++)
		{
			var element = elementsToMove[i];
			mobileItem.removeElement(element);
			$this.addElement(element, true);
			
			if (utils.isset(element.update))
				element.update();
		}
		
		mode = 'classic';
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onCancel = function() {};

	this.onClick = component.getById('children-list').onClick = component.getById('background-screen').onClick = function()
	{
		//document.getElementById('main').removeChild($this);
		$this.onCancel();
		$this.setOpen(false);
		$this.closeAllChildren();
	};
	
	//component.getById('children-list').onClick = function() {};
	
	this.onContextMenu = component.getById('children-list').onContextMenu = component.getById('background-screen').onContextMenu = function($event)
	{
		Events.preventDefault($event);
		//document.getElementById('main').removeChild($this);
		$this.onCancel();
		$this.setOpen(false);
		$this.closeAllChildren();
	};
	
	component.getById('children-list').onMouseOut = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].unlightAll))
				elementsList[i].unlightAll();
		}
	};
	
	this.onResize = function()
	{
		if (classicWidth === 0 || mode === 'classic')
			classicWidth = computeClassicWidth();
		
		var parentNode = $this.parentNode;
		
		if (utils.isset(parentNode))
		{
			//console.log("Redimensionnement de la fenêtre : " + mode + ', ' + classicWidth + ', ' + parentNode.offsetWidth);
			//console.log(parentNode);
			
			if (mode === 'classic' && classicWidth > parentNode.offsetWidth)
				toMobile();
			else if (mode === 'mobile' && classicWidth <= parentNode.offsetWidth)
				toClassic();
		}
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isOpen = function() { return isOpen; };
	this.getElementsList = function() { return elementsList; };
	this.getListNode = function() { return component.getById('root-children-list'); };
	
	// SET
	
	this.setOpen = function($isOpen)
	{
		isOpen = $isOpen;
		
		if (isOpen === true)
		{
			var parentNode = $this.parentNode;
			
			if (utils.isset(parentNode))
			{
				var menuHeight = $this.offsetHeight;
				var parentWidth = parentNode.offsetWidth;
				var parentHeight = parentNode.offsetHeight;
				
				if (Loader.getMode() === 'classic')
				{
					component.getById('background-screen').style.display = 'block';
					component.getById('background-screen').style.width = parentWidth + 'px';
					component.getById('background-screen').style.height = (parentHeight - menuHeight) + 'px';
				}
			}
		}
		else
			component.getById('background-screen').style.display = 'none';
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("menuBar");