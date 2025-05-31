function ListItem($label)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	var parent = null;

	var html = '<li class="listItem" >'
					+ '<div id="list-label" class="list-label" >'
						+ label
					+ '</div>'
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
		// Système de sélection
		$this.onSelect($this);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onSelect = function($element) {};

	component.onClick = function()
	{
		console.log("Select list item ! ");
		//Système de sélection
		$this.onSelect($this);
	};

	//// Déclenchement du drag & drop ////
	
	component.onMouseDown = function($event)
	{
		if (utils.isset(parent) && parent.isEditMode() === true && parent.getElementsList().length > 1)
		{
			if (!$event) // Cas IE 
				$event = window.event;
			
			if ($event.preventDefault) 
				$event.preventDefault(); 
			else
				$event.returnValue = false;
			
			if ($event.button === 0)
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
						ghost.setAttribute('class', 'ghost-list');
						
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						var ghostWidth = component.offsetWidth 
											- parseInt(ghost.getStyle('border-left-width').replace('px', '')) - parseInt(ghost.getStyle('padding-left').replace('px', ''))
											 - parseInt(ghost.getStyle('border-right-width').replace('px', '')) - parseInt(ghost.getStyle('padding-right').replace('px', ''));
											
						ghost.style.width = ghostWidth + "px";
						
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parent.removeChild(component);
						
						virtualItem = document.createElement('li');
						virtualItem.setAttribute('class', 'virtual-list');
						virtualItem.innerHTML = '<div class="virtual-list-border" ></div>';
						parent.insertAt(virtualItem, offsetIndex);
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
				
				var overLayer = $this.onDrag(x, y);
				
				if (utils.isset(parent))
				{
					if (y < parentPosition.y-ghost.offsetHeight/2)
						y = parentPosition.y-ghost.offsetHeight/2;
					else if(y > parentPosition.y+parentPosition.height-ghost.offsetHeight/2)
						y = parentPosition.y+parentPosition.height-ghost.offsetHeight/2;
				}
		
				ghost.style.left = x + 'px';
				ghost.style.top = y + 'px';
				
				if (utils.isset(parent))
				{
					ghost.style.left = (parentPosition.x
										+ parseInt(ghost.getStyle('border-left-width').replace('px', ''))
										+ parseInt(parent.getStyle('border-left-width').replace('px', ''))) + 'px';
				}
				
				// Si on survole un élément
				
				if (utils.isset(overLayer) && utils.isset(overLayer.getById) && utils.isset(overLayer.getById('list-label')) && overLayer !== $this)
				{
					overLayerPosition = overLayer.position();
					deltaX = x - overLayerPosition.x;
					deltaY = y - overLayerPosition.y;
					
					if (utils.isset(parent))
						parent.insertAfter(virtualItem, overLayer);
				}
				
				// Si on ne survole aucun élément 
				
				else if (utils.isset(parent) && ((utils.isset(overLayer) && overLayer.isClass('listBox')) || !utils.isset(overLayer)))
				{
					if (y <= parent.position().y+5)
					{
						if (parent.firstChild)
							parent.insertBefore(virtualItem, parent.firstChild);
						else
							parent.appendChild(virtualItem);
					}
					else
						parent.appendChild(virtualItem);
				}
				
				currentIndex = virtualItem.index();
			}

			moved = true;
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		var hasChanged = false;

		if (dragging === true && moved === true)
		{
			if (utils.isset(ghost) && utils.isset(ghost.parentNode))
			{
				document.getElementById('main').removeChild(ghost);
				ghost = null;
				moved = false;
			}
			
			if (utils.isset(parent))
			{
				if (utils.isset(virtualItem))
				{
					if (utils.isset(virtualItem.parentNode))
						virtualItem.parentNode.removeChild(virtualItem);
				
					$this.onRelease($this, currentIndex);
				}
				
				virtualItem = null;
				parentNode = null;
			}

			hasChanged = true;
		}

		dragging = false;
		moved = false;

		return hasChanged;
	};
	
	this.mouseUp = onMouseUp;
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		var hasChanged = false;

		if (dragging === true)
		{
			if ($event.keyCode === 27)
			{
				hasChanged = onMouseUp($event);
				console.log("Echappe ! ");
			}
		}

		return hasChanged;
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getParent = function() { return parent; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.position();
		
		if ($y >= position.y && $y <= position.y+component.offsetHeight)
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

	this.getLabel = function() { return label; };

	this.getJSON = function()
	{
		var jsonData = { "label": label };
		return jsonData;
	};
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
	};

	this.setParent = function($parent) { parent = $parent; };

	this.loadFromJSON = function($json)
	{
		label = $json.label;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("listItem");