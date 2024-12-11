function FolderItem($html, $sorted)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isFolder = true;
	
	var sorted = $sorted;
	// ▼
	// ►
	var open = false;
	var editMode = false;
	
	var html = '<li id="fileSystem-folder" class="fileSystem-folder" folder="folder" >'
					+ '<div id="element-label" class="element-label" >'
						+ '<div id="unselectIcon" class="icon unselectIcon" ></div>'
						+ '<div id="selectIcon" class="icon selectIcon" ></div>'
						+ '<div>'
							+ $html
						+ '</div>'
						+ '<div class="arrow" >'
							+ '<span id="arrow" >►</span>'
							+ '<div class="wall" ></div>'
						+ '</div>'
					+ '</div>'
				+ '</li>';

	var component = new Component(html);
	
	var listPanel = new Component('<div class="column" ><ul id="list" ></ul></div>');
	
	var unselectIcon = Loader.getSVG('icons', 'folder-icon', 18, 18);
	component.getById('unselectIcon').appendChild(unselectIcon);
	var selectIcon = Loader.getSVG('icons', 'white-folder-icon', 18, 18);
	component.getById('selectIcon').appendChild(selectIcon);
	
	// Contenu
	
	var parentFolder = null;
	var elementsList = [];
	
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
	
	this.deselect = function()
	{
		open = false;
		component.removeAttribute('class');
		listPanel.style.display = 'none';
		
		$this.deselectAll();
	};
	
	//// Tout désélectionner ////

	this.deselectAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			elementsList[i].deselect();
			
			if (utils.isset(elementsList[i].deselectAll))
				elementsList[i].deselectAll();
		}
	};
	
	//// Sélectionner l'élément ////
	
	this.select = function()
	{
		if (utils.isset(parentFolder))
			parentFolder.deselectAll();
		
		component.setAttribute('class', 'selected');
		listPanel.style.display = 'inline-block';
		open = true;
		$this.onSelect($this);
	};
	
	//// Supprimer le style de survole à tous les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		
		if (utils.isset(component.parentNode) && utils.isset(component.parentNode.parentNode))
			component.parentNode.parentNode.removeClass('drag-over');
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].dragOutAll))
				elementsList[i].dragOutAll();
		}
	};
	
	//// Ajouter le style de survole ////
	
	this.dragOver = function()
	{
		component.addClass('drag-over');
		
		if (utils.isset(component.parentNode) && utils.isset(component.parentNode.parentNode))
			component.parentNode.parentNode.addClass('drag-over');
	};
	
	//// Supprimer le style de survole ////
	
	this.dragOut = function()
	{
		component.removeClass('drag-over');
		
		if (utils.isset(component.parentNode) && utils.isset(component.parentNode.parentNode))
			component.parentNode.parentNode.removeClass('drag-over');
	};
	
	//// Ajouter un élément enfant à la fin de la liste ////
	
	this.addElement = function($element)
	{
		elementsList.push($element);
		listPanel.getById('list').appendChild($element);
		$element.setEditMode(editMode);
		$element.setParentFolder($this);
		
		if (utils.isset($element.setSorted))
			$element.setSorted(sorted);
	};
	
	//// Ajouter un élément à la position indiquée ////
	
	this.insertElementInto = function($element, $index)
	{
		elementsList.splice($index, 0, $element);
		listPanel.getById('list').insertAt($element, $index);
		$element.setEditMode(editMode);
		$element.setParentFolder($this);
		
		if (utils.isset($element.setSorted))
			$element.setSorted(sorted);
	};
	
	//// Supprimer un élément enfant ////
	
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
		
		if (parent === listPanel)
			listPanel.getById('list').removeChild($element);
		
		return $element;
	};
	
	//// Déplier l'élément s'il a des enfants ////
	
	this.open = function()
	{
		open = true;
		listPanel.style.display = 'inline-block';
	};
	
	//// Replier l'élément et tous ses enfants ////
	
	this.closeAll = function()
	{
		open = false;
		listPanel.style.display = "none";
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onSelect = function($selectedElement) { return true; };
	//this.onChange = function() {};
	
	component.onClick = function() { $this.select(); };
	listPanel.onClick = function() { $this.deselectAll(); };
	
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
				lastMoveDate = new Date();
				//moved = true;
				
				Events.preventDefault($event);
	
				var mousePosition = component.mousePosition($event);
				var mouseX = mousePosition.x;
				var mouseY = mousePosition.y;
				
				// Création de l'élément fantôme s'il n'existe pas encore
				//*
				if (!utils.isset(ghost))
				{
					var moveDistance = Math.sqrt((mouseX-startX)*(mouseX-startX) + (mouseY-startY)*(mouseY-startY));
					
					if (moveDistance > 10)
					{
						moved = true;
						
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-fileSystemItem');
						ghost.style.width = component.offsetWidth + "px";
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						parentNode = component.parentNode;
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parentNode.removeChild(component);
						
						virtualItem = document.createElement('li');
						virtualItem.setAttribute('class', 'virtual-fileSystemItem');
						virtualItem.innerHTML = component.innerHTML;
						parentNode.insertAt(virtualItem, offsetIndex);
					}
				}
				//*/
				
				// Si le fantôme existe
				//*
				if (utils.isset(ghost))
				{
					var x = mouseX - offsetX;
					var y = mouseY - offsetY;
		
					ghost.style.left = x + 'px';
					ghost.style.top = y + 'px';
					
					var overLayer = $this.onDrag(mouseX, mouseY);
					
					// Si on survole un élément
					
					if (utils.isset(overLayer) && overLayer !== $this)
					{
						overLayerPosition = overLayer.position();
						deltaX = mouseX-overLayerPosition.x;
						deltaY = mouseY-overLayerPosition.y;
						
						if (overLayer.isClass('fileSystem'))
						{
							parentNode = overLayer.firstChild.firstChild;
							parentNode.appendChild(virtualItem);
						}
						else
						{
							if (overLayer.isFolder === true || overLayer.isFile === true)
							{
								if (overLayer.isFolder === true && overLayer.isOpen() === false)
								{
									setTimeout(function()
									{
										var currentDate = new Date();
										
										if (dragging === true && currentDate.getTime()-lastMoveDate.getTime() > 500)
											overLayer.select();
										
									}, 500);
								}
								
								console.log(overLayer);
								
								parentNode = overLayer.parentNode;
								
								console.log(parentNode);
								
								if (sorted === true)
									parentNode.appendChild(virtualItem);
								else
								{
									if (overLayer.isLast() === true)
										parentNode.appendChild(virtualItem);
									else
										parentNode.insertAfter(virtualItem, overLayer);
								}
							}
							else if (utils.isset(overLayer.getById))
							{
								parentNode = overLayer.getById('list');
								parentNode.appendChild(virtualItem);
							}
							else
							{
								parentNode = overLayer.firstChild;
								parentNode.appendChild(virtualItem);
							}
						}
					}
					
					currentIndex = virtualItem.index();
				}
				//*/
			}
			else
			{
				for (var i = 0; i < elementsList.length; i++)
					elementsList[i].mouseMove($event);
			}
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//document.getElementById('main').onMouseMove.push(onMouseMove);
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		if (editMode === true)
		{
			if (dragging === true)
			{
				dragging = false;
				
				//*
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
				//*/
			}
			else
			{
				for (var i = 0; i < elementsList.length; i++)
					elementsList[i].mouseUp($event);
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
		else
		{
			for (var i = 0; i < elementsList.length; i++)
				elementsList[i].onKeyUp($event);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isOpen = function() { return open; };
	this.isEditMode = function() { return editMode; };
	this.getParentFolder = function() { return parentFolder; };
	this.getElementsList = function() { return elementsList; };
	this.getFolders = function() { return elementsList; };
	this.getParentNode = function() { return parentNode; };
	
	this.getListPanel = function() { return listPanel; };
	
	//// Détecter si l'élement ou un de ses enfants est survolé ////
	//*
	this.getOverLayer = function($x, $y, $movingElement)
	{
		$this.dragOutAll();
		
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.position();
		
		//console.log($x + ', ' + $y);
		//console.log(position);
		
		if ($y >= position.y && $y <= position.y+component.offsetHeight
			&& $x >= position.x && $x <= position.x+component.offsetWidth)
		{
			isMouseOver = true;
			overLayer = $this;
			listPanel.getById('list').folder = $this;
		}
		
		if (isMouseOver === false)
		{
			if (open === true)
			{
				for (var i = 0; i < elementsList.length; i++)
				{
					if (elementsList[i] !== $movingElement)
					{
						overLayer = elementsList[i].getOverLayer($x, $y, $movingElement);
						
						if (utils.isset(overLayer))
						{
							i = elementsList.length;
							isMouseOver = true;
						}
					}
				}
			}
		}
		
		if (isMouseOver === false)
		{
			position = listPanel.position();
			
			if ($y >= position.y && $y <= position.y+listPanel.offsetHeight
			&& $x >= position.x && $x <= position.x+listPanel.offsetWidth)
			{
				isMouseOver = true;
				overLayer = listPanel;
				listPanel.getById('list').folder = $this;
			}
		}
		
		return overLayer;
	};
	//*/
	
	this.getListNode = function() { return listPanel.getById('list'); };
	
	//// Récupérer la position courante de l'élément ////
	
	this.index = function()
	{
		var i = 0;
		var previousSibling = $this.previousSibling;
		
		while (utils.isset(previousSibling))
		{
			var folder = previousSibling.getAttribute('folder');
			
			if (folder === 'folder')
				i++;
			
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parentFolder))
		{
			if (parentFolder.getElementsList()[parentFolder.getElementsList().length-1] === $this)
				isLast = true;
			else if (parentFolder.getElementsList()[parentFolder.getElementsList().length-2] === $this && parentFolder.getElementsList()[parentFolder.getElementsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].setEditMode(editMode);
	};
	
	this.setSorted = function($sorted) { sorted = $sorted; };
	
	this.setParentFolder = function($parentFolder) { parentFolder = $parentFolder; };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	listPanel.getById('list').folder = $this;
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("folderItem");