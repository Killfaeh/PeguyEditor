function KanbanCard($label, $sorted)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isCard = true;
	
	var label = $label;
	var sorted = $sorted;
	var editMode = false;
	var editing = false;
	
	var html = '<li class="kanbanCard" card="card" >'
					+ '<p id="label" class="label" >' + label + '</p>'
					+ '<textarea id="labelField" class="labelField" placeholder="' + KEYWORDS.cardTitle + '" >' + label + '</textarea>'
					+ '<span id="editIcon" class="editIcon" ></span>'
				+ '</li>';

	var component = new Component(html);
	
	var editIcon = Loader.getSVG('icons', 'edit-icon', 14, 14);
	component.getById('editIcon').appendChild(editIcon);
	
	var parent = null;
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var lastMoveDate = new Date();
	
	var ghost = null;
	var virtualItem = null;
	var parentNode = null;
	var offsetIndex = 0;
	var currentIndex = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var onCloseEditForm = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			component.getById('label').innerHTML = newLabel;
		}
		
		//component.getById('editIcon').style.display = 'none';
		component.getById('label').style.display = 'block';
		component.getById('labelField').style.display = 'none';
		component.getById('labelField').blur();
		editing = false;
	};
	
	var onHideEditIcon = function()
	{
		component.getById('editIcon').style.display = 'none';
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	
	component.onMouseMove = function()
	{
		Events.emit('onHideKanbanEditIcon', []);
		
		if (editMode === true && editing === false)
			component.getById('editIcon').style.display = 'block';
	};
	
	component.getById('editIcon').onMouseDown = function() {};
	
	component.getById('editIcon').onClick = component.getById('editIcon').onMouseUp = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		
		setTimeout(function()
		{
			component.getById('editIcon').style.display = 'none';
			component.getById('label').style.display = 'none';
			component.getById('labelField').style.display = 'block';
			component.getById('labelField').focus();
			
			var valueLength = component.getById('labelField').value.length;
			
			component.getById('labelField').focus();
			component.getById('labelField').setSelectionRange(valueLength, valueLength);
		}, 100);
		
		editing = true;
	};
	
	//// Déclenchement du drag & drop ////
	
	component.onMouseDown = function($event)
	{
		//Events.emit('onCloseKanbanAddForm', [$this]);
		
		if (editMode === true)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				dragging = true;
				
				var x = $event.clientX + component.parentNode.scrollLeft;
				var y = $event.clientY + component.parentNode.scrollTop;
				var componentInitPosition = component.position();
				console.log("Mouse position : " + x + ", " + y);
				console.log(componentInitPosition);
				var componentInitX = componentInitPosition.x;
				var componentInitY = componentInitPosition.y;
				startX = x;
				startY = y;
				offsetX = startX-componentInitX;
				offsetY = startY-componentInitY;
				
				$this.focus();
			}
		}
		
		Events.emit('onCloseKanbanAddForm', [$this]);

		return false;
	};
	
	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($column, $index) {};
	
	//// Déplacement de l'élément ////
	
	var onMouseMove = function($event)
	{
		if (editMode === true)
		{
			if (dragging === true)
			{
				Events.preventDefault($event);
	
				var mousePosition = component.mousePosition($event);
				var mouseX = mousePosition.x;
				var mouseY = mousePosition.y;
				
				// Création de l'élément fantôme s'il n'existe pas encore
				
				if (!utils.isset(ghost))
				{
					var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
					
					if (moveDistance > 10)
					{
						Events.emit('onCloseKanbanAddForm', [$this]);
						
						moved = true;
						
						var marginLeft = parseInt(component.getStyle('margin-left').replace('px', ''));
						var marginRight = parseInt(component.getStyle('margin-right').replace('px', ''));
						var marginTop = parseInt(component.getStyle('margin-top').replace('px', ''));
						var marginBottom = parseInt(component.getStyle('margin-bottom').replace('px', ''));
						
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-kanbanCard');
						ghost.style.width = component.offsetWidth + "px";
						ghost.style.height = (component.offsetHeight-marginTop-marginBottom) + "px";
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						parentNode = component.parentNode;
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parentNode.removeChild(component);
						
						virtualItem = document.createElement('div');
						virtualItem.style.height = (ghost.offsetHeight) + "px";
						virtualItem.setAttribute('class', 'virtual-kanbanCard');
						parentNode.insertAt(virtualItem, offsetIndex);
					}
				}
				
				// Si le fantôme existe
				
				if (utils.isset(ghost))
				{
					var x = mouseX - offsetX;
					var y = mouseY - offsetY;
		
					ghost.style.left = x + 'px';
					ghost.style.top = y + 'px';
					
					var overLayer = $this.onDrag(mouseX, y, $this);
					
					// Si on survole un élément
					
					//console.log(overLayer);
					
					if (utils.isset(overLayer) && overLayer !== $this)
					{
						overLayerPosition = overLayer.position();
						deltaX = mouseX-overLayerPosition.x;
						deltaY = mouseY-overLayerPosition.y;
						
						if (overLayer.isCard === true)
						{
							parentNode = overLayer.parentNode;
							
							if (sorted === true)
								parentNode.appendChild(virtualItem);
							else
								parentNode.insertAfter(virtualItem, overLayer);
						}
						else if (overLayer.isColumn === true)
						{
							parentNode = overLayer.getById('list');
							parentNode.column = overLayer;
							
							if (sorted !== true && deltaY < 0 && utils.isset(overLayer.getById('list').firstChild))
								parentNode.insertBefore(virtualItem, overLayer.getById('list').firstChild);
							else
								parentNode.appendChild(virtualItem);
						}
					}
					
					currentIndex = virtualItem.index();
				}
			}
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		if (editMode === true)
		{
			if (dragging === true)
			{
				dragging = false;
				
				if (utils.isset(ghost) && utils.isset(ghost.parentNode))
				{
					document.getElementById('main').removeChild(ghost);
					ghost = null;
					moved = false;
				}
				
				if (utils.isset(parentNode))
				{
					if (utils.isset(virtualItem) && utils.isset(virtualItem.parentNode))
					{
						parentNode = virtualItem.parentNode;
						parentNode.column = parentNode.parentNode.parentNode.parentNode;
						virtualItem.parentNode.removeChild(virtualItem);
					}
					
					// Mettre à jour les données internes de l'ancien et du nouveau parent
					$this.onRelease($this, currentIndex);
					
					virtualItem = null;
					parentNode = null;
				}
				
				Events.emit('onCloseKanbanAddForm', [$this]);
			}
		}
	};
	
	this.mouseUp = onMouseUp;
	
	component.connect('onCloseKanbanAddForm', onCloseEditForm);
	component.connect('onHideKanbanEditIcon', onHideEditIcon);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getLabel = function() { return label; };
	this.getParent = function() { return parent; };
	this.getParentNode = function() { return parentNode; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.position();
		
		//console.log($x + ', ' + $y);
		//console.log(position);
		
		var marginLeft = parseInt(component.getStyle('margin-left').replace('px', ''));
		var marginRight = parseInt(component.getStyle('margin-right').replace('px', ''));
		var marginTop = parseInt(component.getStyle('margin-top').replace('px', ''));
		var marginBottom = parseInt(component.getStyle('margin-bottom').replace('px', ''));
		
		//if ($y >= position.y-marginTop && $y <= position.y + component.offsetHeight + marginRight
		//	&& $x >= position.x-marginLeft && $x <= position.x + component.offsetWidth + marginBottom)
		if ($y >= position.y-marginTop && $y <= position.y + component.offsetHeight + marginBottom)
		{
			isMouseOver = true;
			overLayer = $this;
		}
		
		//console.log(overLayer);
		
		return overLayer;
	};
	
	//// Récupérer la position courante de l'élément ////
	
	this.index = function()
	{
		var i = 0;
		var previousSibling = $this.previousSibling;
		
		while (utils.isset(previousSibling))
		{
			var card = previousSibling.getAttribute('card');
			
			if (card === 'card')
				i++;
			
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parent))
		{
			if (parent.getCardsList()[parent.getCardsList().length-1] === $this)
				isLast = true;
			else if (parent.getCardsList()[parent.getCardsList().length-2] === $this && parent.getCardsList()[parent.getCardsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };

	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };
	this.setSorted = function($sorted) { sorted = $sorted; };
	this.setParent = function($parent) { parent = $parent; };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("kanbanCard");