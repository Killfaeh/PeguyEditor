function Tab($label, $content)
{
	///////////////
	// Attributs //
	///////////////

	var editMode = false;
	var label = $label;
	var content = $content;
	
	var parent = null;

	var html = '<li class="tab" >'
					+ '<div id="unselectMargin" class="unselectMargin" ></div>'
					+ '<label id="tab-label" >'
						+ label
					+ '</label>'
					+ '<span id="closeIcon" class="closeIcon" >'
						+ '<div class="wall" ></div>'
					+ '</span>'
				+ '</li>';

	var component = new Component(html);
	
	var closeIcon = Loader.getSVG('icons', 'grey-close-icon', 10, 10);
	component.getById('closeIcon').appendChild(closeIcon);
	
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
		if (utils.isset(parent))
			parent.unselectAll();
		
		if (utils.isset(parent))
		{
			parent.addToHistory($this);
			
			if (utils.isset($this.parentNode) && $this.parentNode.isClass('hiddenTabs'))
				parent.updateTabs();
			
			parent.setSelected($this);
			parent.appendContent(content);
			parent.hideHiddenTabs();
		}
		
		$this.addClass('selected');
		$this.onSelect($this);
	};
	
	this.unselect = function()
	{
		$this.removeClass('selected');
		
		if (utils.isset(parent) && parent.getContent() === content)
			parent.getById('content').removeAllChildren();
	};
	
	//// Ajouter le style de survole ////
	
	this.dragOver = function()
	{
		component.addClass('drag-over');
	};
	
	//// Supprimer le style de survole ////
	
	this.dragOut = function()
	{
		component.removeClass('drag-over');
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onSelect = function($tab) {};
	
	this.onClick = function() { $this.select(); };
	
	this.onClose = function() { return true; };
	
	var onClose = function()
	{
		if ($this.onClose() === true && utils.isset(parent))
			parent.removeTab($this);
	};
	
	closeIcon.onClick = function() { onClose(); };
	
	//// Déclenchement du drag & drop ////
	
	component.onMouseDown = function($event)
	{
		if (editMode === true && utils.isset(parent) && parent.getHiddenTabs().childNodes.length <= 0)
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
	this.onRelease = function($tab, $index) {};
	
	//// Déplacement de l'élément ////
	
	var onMouseMove = function($event)
	{
		if (editMode === true && dragging === true)
		{
			Events.preventDefault($event);
	
			var mouseX = $event.clientX;
			var mouseY = $event.clientY;
			
			// Création de l'élément fantôme s'il n'existe pas encore
			
			if (!utils.isset(ghost))
			{
				if (utils.isset(parent))
				{
					mouseX = $event.clientX + parent.getById('tabs').scrollLeft;
					mouseY = $event.clientY + parent.getById('tabs').scrollTop;
				
					var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
					
					if (moveDistance > 10)
					{
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-tab');
						//ghost.style.width = component.offsetWidth + "px";
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parent.getById('tabs').removeChild(component);
						
						virtualItem = document.createElement('li');
						virtualItem.setAttribute('class', 'virtual-tab');
						virtualItem.innerHTML = '<div class="virtual-tab-border" ></div>';
						parent.getById('tabs').insertAt(virtualItem, offsetIndex);
					}
				}
			}
			
			// Si le fantôme existe
			
			if (utils.isset(ghost))
			{
				var parentPosition = { x: 0, y: 0, width: 0, height: 0 };
				
				if (utils.isset(parent))
				{
					parentPosition = parent.getById('tabs').position();
					parentPosition.width = parent.getById('tabs').offsetWidth;
					parentPosition.height = parent.getById('tabs').offsetHeight;
					mouseX = $event.clientX + parent.getById('tabs').scrollLeft;
					mouseY = $event.clientY + parent.getById('tabs').scrollTop;
				}
				
				var x = mouseX - offsetX;
				var y = mouseY - offsetY;
				
				var overLayer = $this.onDrag(x, y);
				
				if (utils.isset(parent))
				{
					if (x < parentPosition.x)
						x = parentPosition.x;
					else if(x > parentPosition.x+parentPosition.width-ghost.offsetWidth)
						x = parentPosition.x+parentPosition.width-ghost.offsetWidth;
				}
		
				ghost.style.left = x + 'px';
				ghost.style.top = y + 'px';
				
				if (utils.isset(parent))
				{
					ghost.style.top = (parentPosition.y
										+ parseInt(ghost.getStyle('border-top-width').replace('px', ''))
										+ parseInt(parent.getById('tabs').getStyle('border-top-width').replace('px', ''))) + 'px';
				}
				
				// Si on survole un élément
				
				if (utils.isset(overLayer) && utils.isset(overLayer.getById) && utils.isset(overLayer.getById('tab-label')) && overLayer !== $this)
				{
					overLayerPosition = overLayer.position();
					deltaX = x - overLayerPosition.x;
					deltaY = mouseY - overLayerPosition.y;
					
					if (utils.isset(parent))
						parent.getById('tabs').insertAfter(virtualItem, overLayer);
				}
				
				// Si on ne survole aucun élément 
				
				else if (utils.isset(parent) && ((utils.isset(overLayer) && overLayer.isClass('tabs')) || !utils.isset(overLayer)))
				{
					if (x <= parent.getById('tabs').position().x+5)
					{
						if (parent.getById('tabs').firstChild)
							parent.getById('tabs').insertBefore(virtualItem, parent.getById('tabs').firstChild);
						else
							parent.getById('tabs').appendChild(virtualItem);
					}
					else
						parent.getById('tabs').appendChild(virtualItem);
				}
				
				currentIndex = virtualItem.index();
			}
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		if (editMode === true && dragging === true)
		{
			dragging = false;
			
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
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };
	this.getLabel = function() { return label; };
	this.getContent = function() { return content; };
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
	
	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };

	this.setLabel = function($label)
	{
		label = $label;
		component.getById('tab-label').innerHTML = label;
	};

	this.setContent = function($content) { content = $content; };
	this.setParent = function($parent) { parent = $parent; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("tab");