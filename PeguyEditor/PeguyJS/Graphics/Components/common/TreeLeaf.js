function TreeLeaf($html)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isLeaf = true;
	
	var editMode = false;
	
	var html = '<li id="tree-leaf" class="tree-leaf" >'
					+ '<div id="element-label" class="element-label" branch="branch" >'
						+ $html
					+ '</div>'
				+ '</li>';

	var component = new Component(html);
	
	var parentBranch = null;
	
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

	//// Désélectionner l'élément ////

	this.deselect = function()
	{
		component.removeAttribute('class');
	};

	//// Sélectionner l'élément ////
	
	this.select = function()
	{
		//$this.deselectAll();
		var selected = $this.onSelect($this);
		
		if (selected === true)
			component.setAttribute('class', 'selected');
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

	this.onSelect = function($selectedElement) { return true; };
	//this.onChange = function() {};

	component.onclick = function($event)
	{
		Events.preventDefault($event);
		Events.stopPropagation($event);
	};

	component.ondblclick = function($event)
	{
		Events.preventDefault($event);
		Events.stopPropagation($event);
	};
	
	component.onClick = function()
	{
		$this.select();
	};
	
	//// Déclenchement du drag & drop ////
	
	component.onMouseDown = function($event)
	{
		if (editMode === true)
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

		return false;
	};
	
	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($element, $index) {};
	
	//// Déplacement de l'élément ////
	
	var onMouseMove = function($event)
	{
		if (editMode === true)
		{
			if (dragging === true)
			{
				//moved = true;
				
				Events.preventDefault($event);
	
				var mouseX = $event.clientX;
				var mouseY = $event.clientY;
				
				// Création de l'élément fantôme s'il n'existe pas encore
				
				if (!utils.isset(ghost))
				{
					mouseX = $event.clientX + component.parentNode.scrollLeft;
					mouseY = $event.clientY + component.parentNode.scrollTop;
					
					var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
					
					if (moveDistance > 10)
					{
						moved = true;
						
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-item');
						//ghost.style.width = component.offsetWidth + "px";
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						parentNode = component.parentNode;
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parentNode.removeChild(component);
						
						virtualItem = document.createElement('li');
						virtualItem.setAttribute('class', 'virtual-item');
						virtualItem.innerHTML = '<div class="virtual-item-border" ></div>';
						parentNode.insertAt(virtualItem, offsetIndex);
					}
				}
				
				// Si le fantôme existe
				
				if (utils.isset(ghost))
				{
					mouseX = $event.clientX + parentNode.scrollLeft;
					mouseY = $event.clientY + parentNode.scrollTop;
					var x = mouseX - offsetX;
					var y = mouseY - offsetY;
		
					ghost.style.left = x + 'px';
					ghost.style.top = y + 'px';
					
					var overLayer = $this.onDrag(mouseX, mouseY);
					
					// Si on survole un élément
					
					if (utils.isset(overLayer) && utils.isset(overLayer.getById('element-label')) && overLayer !== $this)
					{
						overLayerPosition = overLayer.position();
						deltaX = mouseX-overLayerPosition.x;
						deltaY = mouseY-overLayerPosition.y;
						var halfHeight = overLayer.getById('element-label').offsetHeight/2.0;
						var threeQuartersHeight = overLayer.getById('element-label').offsetHeight*3.0/4.0;
						
						if (overLayer.isClass('tree'))
						{
							parentNode = overLayer;
							
							if (virtualItem.parentNode !== parentNode)
							{
								if (deltaY < 0)
									parentNode.insertAt(virtualItem, 0);
								else
									parentNode.appendChild(virtualItem);
							}
						}
						else
						{
							if (overLayer.isBranch === true)
							{
								if (overLayer.isDeployed() === true)
								{
									parentNode = overLayer.getById('leafs');
									parentNode.insertAt(virtualItem, 0);
								}
								else
								{
									if (deltaY <= halfHeight)
									{
										overLayer.addClass('drag-over');
										parentNode = overLayer.getById('leafs');
										parentNode.appendChild(virtualItem);
									}
									else if (overLayer.isLast() !== true || deltaY <= threeQuartersHeight)
									{
										parentNode = overLayer.parentNode;
										parentNode.insertAfter(virtualItem, overLayer);
									}
									else
									{
										var overLayerParentBranch = overLayer.getParentBranch();
										parentNode = overLayerParentBranch.parentNode;
										parentNode.insertAfter(virtualItem, overLayerParentBranch);
									}
								}
							}
							else
							{
								parentNode = overLayer.parentNode;
								parentNode.insertAfter(virtualItem, overLayer);
							}
						}
					}
					
					// Si on ne survole aucun élément 
					
					else if (utils.isset(overLayer) && overLayer.isTree === true)
					{
						parentNode = overLayer;
						
						if (y <= parentNode.position().y)
							parentNode.insertAt(virtualItem, 0);
						else
							parentNode.appendChild(virtualItem);
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
						virtualItem.parentNode.removeChild(virtualItem);
					
					// Mettre à jour les données internes de l'ancien et du nouveau parent
					$this.onRelease($this, currentIndex);
					
					virtualItem = null;
					parentNode = null;
				}
			}
		}
	};
	
	this.mouseUp = onMouseUp;
	
	//document.getElementById('main').onMouseUp.push(onMouseUp);
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		if (utils.isset(ghost) && utils.isset(ghost.parentNode))
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
	this.getParentBranch = function() { return parentBranch; };
	this.getParentNode = function() { return parentNode; };
	
	//// Détecter si l'élement ou un de ses enfants est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.getById('element-label').position();
		
		if ($y >= position.y && $y <= position.y+component.getById('element-label').offsetHeight)
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
			var branch = previousSibling.getAttribute('branch');
			
			if (branch === 'branch')
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
			if (parentBranch.getElementsList()[parentBranch.getElementsList().length-1] === $this)
				isLast = true;
			else if (parentBranch.getElementsList()[parentBranch.getElementsList().length-2] === $this && parentBranch.getElementsList()[parentBranch.getElementsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };

	this.getJSON = function()
	{
		var jsonData = { "type": "leaf", "label": $html };
		return jsonData;
	};

	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };
	this.setParentBranch = function($parentBranch) { parentBranch = $parentBranch; };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("treeLeaf");
