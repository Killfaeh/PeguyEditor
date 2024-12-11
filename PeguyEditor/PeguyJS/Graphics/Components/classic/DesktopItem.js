function DesktopItem($label, $icon)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	var icon = $icon;
	
	var parent = null;
	
	var html = '<li class="desktopItem" >'
					+ '<div id="icon" class="desktopItemIcon" ></div>'
					+ '<br />'
					+ '<div id="label" class="desktopItemLabel" >' + label + '</div>'
				+ '</li>';

	var component = new Component(html);
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	
	var ghost = null;
	var virtualItem = null;
	var parentNode = null;
	var offsetIndex = 0;
	var currentIndex = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.select = function()
	{
		component.addClass('selected');
		//Events.emit('onSelectDesktopItem', [$this]);
	};
	
	this.unselect = function()
	{
		component.removeClass('selected');
		//Events.emit('onSelectDesktopItem', [$this]);
	};
	
	var updateIcon = function()
	{
		component.getById('icon').removeAllChildren();
		
		if (utils.isset(icon))
			component.getById('icon').appendChild(icon);
		
		component.getById('icon').appendChild(new Component('<div class="wall" ></div>'));
	};
	
	var isVertexInRect = function($x, $y, $rect)
	{
		var isInRect = false;
		
		var rectPosition = $rect.position();
		var rectWidth = parseInt($rect.offsetWidth);
		var rectHeight = parseInt($rect.offsetHeight);
		
		if ($x >= rectPosition.x && $x <= rectPosition.x + rectWidth && $y >= rectPosition.y && $y <= rectPosition.y + rectHeight)
			isInRect = true;
		
		return isInRect;
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onAction = function($event) {};
	
	component.getById('icon').onClick = component.getById('label').onClick = function($event)
	{
		/*
		if (moved === false)
		{
			if (Events.keyPressTable['shift'] !== true)
				parent.unselectAll();
			else
				Events.preventDefault($event);
			
			$this.select();
		}
		//*/
	};
	
	this.onDblClick = function($event)
	{
		$this.select();
		$this.onAction($event);
	};
	
	//// Déclenchement du drag & drop ////
	
	var onMouseDown = function($event)
	{
		if ($this.isSelected() === true)
		{
			dragging = true;
		
			var x = $event.clientX + component.parentNode.scrollLeft;
			var y = $event.clientY + component.parentNode.scrollTop;
			var componentInitPosition = component.position();
			//console.log("Mouse position : " + x + ", " + y);
			//console.log(componentInitPosition);
			var componentInitX = componentInitPosition.x;
			var componentInitY = componentInitPosition.y;
			startX = x;
			startY = y;
			offsetX = startX-componentInitX;
			offsetY = startY-componentInitY;
			
			$this.focus();
		}
	};
	
	component.getById('icon').onMouseDown = component.getById('label').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		
		if ($this.isSelected() !== true)
		{
			if (Events.keyPressTable['shift'] !== true)
				parent.unselectAll();
			
			$this.select();
		}
		
		//if (utils.isset(parent) && parent.isEditMode() === true && parent.getElementsList().length > 1)
		if (utils.isset(parent) && parent.isEditMode() === true)
		{
			if ($event.button === 0)
			{
				//dragging = true;
				
				/*
				var x = $event.clientX + component.parentNode.scrollLeft;
				var y = $event.clientY + component.parentNode.scrollTop;
				var componentInitPosition = component.position();
				//console.log("Mouse position : " + x + ", " + y);
				//console.log(componentInitPosition);
				var componentInitX = componentInitPosition.x;
				var componentInitY = componentInitPosition.y;
				startX = x;
				startY = y;
				offsetX = startX-componentInitX;
				offsetY = startY-componentInitY;
				//*/
				
				Events.emit('onMouseDownOnDesktopItem', [$event]);
				
				//$this.focus();
			}
		}
		
		return false;
	};
	
	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($list, $index) {};
	
	//// Déplacement de l'élément ////
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			Events.preventDefault($event);
	
			var mouseX = $event.clientX;
			var mouseY = $event.clientY;
			
			// Création de l'élément fantôme s'il n'existe pas encore
			
			if (!utils.isset(ghost))
			{
				if (utils.isset(parent))
				{
					mouseX = $event.clientX + parent.scrollLeft;
					mouseY = $event.clientY + parent.scrollTop;
				
					var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
					
					if (moveDistance > 10)
					{
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-desktopItem');
						//ghost.style.width = component.offsetWidth + "px";
						//component.getById('label').style.display = 'inline-block';
						ghost.innerHTML = component.innerHTML;
						//ghost.style.width = currentWidth + 'px';
						
						document.getElementById('main').appendChild(ghost);
						
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						//parent.getById('listIcons').removeChild(component);
						
						/*
						virtualItem = document.createElement('li');
						virtualItem.setAttribute('class', 'virtual-desktopItem');
						virtualItem.style.width = currentWidth + 'px';
						//virtualItem.innerHTML = '<div class="virtual-dockItem-border" ></div>';
						parent.getById('listIcons').insertAt(virtualItem, offsetIndex);
						//*/
					}
				}
			}
			
			// Si le fantôme existe
			
			if (utils.isset(ghost))
			{
				var parentPosition = { x: 0, y: 0, width: 0, height: 0 };
				
				if (utils.isset(parent))
				{
					parentPosition = parent.position();
					parentPosition.width = parent.offsetWidth;
					parentPosition.height = parent.offsetHeight;
					mouseX = $event.clientX + parent.scrollLeft;
					mouseY = $event.clientY + parent.scrollTop;
				}
				
				var x = mouseX - offsetX;
				var y = mouseY - offsetY;
				
				//var overLayer = $this.onDrag(x, y);
				
				// Revoir les effets de bord
				
				if (x < 0)
					x = 0;
				else if (x > parentPosition.width)
					x = parentPosition.width;
				
				if (y < 0)
					y = 0;
				else if (y > parentPosition.height)
					y = parentPosition.height;
		
				ghost.style.left = x + 'px';
				ghost.style.top = y + 'px';
				
				// Si on survole un élément
				/*
				if (utils.isset(overLayer) && utils.isset(overLayer.getById) && utils.isset(overLayer.getById('label')) && overLayer !== $this)
				{
					overLayerPosition = overLayer.position();
					deltaX = x - overLayerPosition.x;
					deltaY = mouseY - overLayerPosition.y;
					
					if (utils.isset(parent))
						parent.getById('listIcons').insertAfter(virtualItem, overLayer);
				}
				//*/
				
				// Si on ne survole aucun élément 
				/*
				else if (utils.isset(parent) && ((utils.isset(overLayer) && overLayer.isClass('listIcons')) || !utils.isset(overLayer)))
				{
					if (x <= parent.getById('listIcons').position().x+5)
					{
						if (parent.getById('listIcons').firstChild)
							parent.getById('listIcons').insertBefore(virtualItem, parent.getById('listIcons').firstChild);
						else
							parent.getById('listIcons').appendChild(virtualItem);
					}
					else
						parent.getById('listIcons').appendChild(virtualItem);
				}
				//*/
				
				//currentIndex = virtualItem.index();
			}
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		if (dragging === true)
		{
			if (utils.isset(ghost) && utils.isset(ghost.parentNode))
			{
				document.getElementById('main').removeChild(ghost);
				ghost = null;
				moved = false;
			}
			
			/*
			if (utils.isset(parent))
			{
				if (utils.isset(virtualItem))
				{
					Events.preventDefault($event);
			
					var mousePosition = $this.mousePosition($event);
					var parentPosition = parent.parentNode.position();
					var parentHeight = parent.parentNode.offsetHeight;
					
					if (utils.isset(virtualItem.parentNode))
						virtualItem.parentNode.removeChild(virtualItem);
					
					$this.onRelease($this, currentIndex);
					
					if ((mousePosition.y - parentPosition.y)/parentHeight < 0.5)
						parent.removeElement($this);
					
					parent.reduce();
				}
				
				virtualItem = null;
				parentNode = null;
			}
			//*/
			
			// Déclencher les interactions avec les autres composents
			/*
			var mousePosition = $this.mousePosition($event);
			
			var flyingElement = document.elementFromPoint(mousePosition.x, mousePosition.y);
			var flyingElements = document.elementsFromPoint(mousePosition.x, mousePosition.y);
			
			for (var i = 0; i < flyingElements.length; i++)
			{
				if (utils.isset(flyingElements[i].onDrop))
				{
					if (Array.isArray(flyingElements[i].onDrop))
					{
						for (var j = 0; j < flyingElements[i].onDrop.length; j++)
							flyingElements[i].onDrop[j]($event);
					}
					else
						flyingElements[i].onDrop($event);
					
					i = flyingElements.length;
				}
			}
			//*/
			
			//dragging = false;
		}
	};
	
	this.mouseUp = onMouseUp;
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		if (dragging === true)
		{
			if ($event.keyCode === 27)
			{
				onMouseUp($event);
				console.log("Echappe ! ");
			}
		}
	};
	
	component.connect('onMouseDownOnDesktopItem', onMouseDown);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getLabel = function() { return label; };
	this.getIcon = function() { return icon; };
	this.getParent = function() { return parent; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.position();
		
		if ($x >= position.x && $x <= position.x+component.offsetWidth)
			isMouseOver = true;
		
		if (isMouseOver === true)
			overLayer = $this;
		
		return overLayer;
	};
	
	//// Récupérer la position courante de l'élément ////
	
	this.index = function()
	{
		var i = 0;
		var previousSibling = $this.previousSibling;
		
		while (utils.isset(previousSibling))
		{
			i++;
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parentBranch))
		{
			if (parent.getTabList()[parent.getTabList().length-1] === $this)
				isLast = true;
			else if (parent.getTabList()[parent.getTabList().length-2] === $this && parent.getTabList()[parent.getTabList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };
	
	this.isInSelectRect = function($selectRect)
	{
		var isInSelectRect = false;
		
		var iconPosition = component.getById('icon').position();
		var iconWidth = parseInt(component.getById('icon').offsetWidth);
		var iconHeight = parseInt(component.getById('icon').offsetHeight);
		
		var iconVertex1 = { x: iconPosition.x, y: iconPosition.y };
		var iconVertex2 = { x: iconPosition.x+iconWidth, y: iconPosition.y };
		var iconVertex3 = { x: iconPosition.x+iconWidth, y: iconPosition.y+iconHeight };
		var iconVertex4 = { x: iconPosition.x, y: iconPosition.y+iconHeight };
		
		if (isVertexInRect(iconVertex1.x, iconVertex1.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(iconVertex2.x, iconVertex2.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(iconVertex3.x, iconVertex3.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(iconVertex4.x, iconVertex4.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isInSelectRect !== true)
		{
			var labelPosition = component.getById('label').position();
			var labelWidth = parseInt(component.getById('label').offsetWidth);
			var labelHeight = parseInt(component.getById('label').offsetHeight);
			
			var labelVertex1 = { x: labelPosition.x, y: labelPosition.y };
			var labelVertex2 = { x: labelPosition.x+labelWidth, y: labelPosition.y };
			var labelVertex3 = { x: labelPosition.x+labelWidth, y: labelPosition.y+labelHeight };
			var labelVertex4 = { x: labelPosition.x, y: labelPosition.y+labelHeight };
		}
		
		return isInSelectRect;
	};
	
	this.isSelected = function() { return component.isClass('selected'); };

	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('label').innerHTML = label;
	};
	
	this.setIcon = function($icon)
	{
		icon = $icon;
		updateIcon();
	};
	
	this.setParent = function($parent) { parent = $parent; };
	this.setDragging = function($dragging) { dragging = $dragging; };
	
	updateIcon();
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("desktopItem");