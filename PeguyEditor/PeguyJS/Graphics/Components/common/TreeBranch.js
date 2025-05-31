function TreeBranch($html, $ordered)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isBranch = true;
	
	var ordered = $ordered;
	// ▼
	// ►
	var deploy = true;
	var editMode = false;
	
	var html = '<li id="tree-branch" class="tree-branch" branch="branch" >'
					+ '<div id="element-label" class="element-label" >'
						+ '<span id="arrow" class="arrow">▼</span>'
						+ $html
					+ '</div>'
					+ '<ul id="leafs" class="leafs" ></ul>'
				+ '</li>';
				
	if (ordered === true)
	{
		html = '<li id="tree-branch" class="tree-branch" branch="branch" >'
					+ '<div id="element-label" class="element-label" >'
						+ '<span id="arrow" class="arrow">▼</span>'
						+ $html
					+ '</div>'
					+ '<ol id="leafs" class="leafs" ></ol>'
				+ '</li>';
	}

	var component = new Component(html);
	
	// Contenu
	
	var parentBranch = null;
	var elementsList = [];
	
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
	
	//// Tout désélectionner ////

	this.deselectAll = function()
	{
		component.removeAttribute('class');
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].deselectAll))
				elementsList[i].deselectAll();
			else if (utils.isset(elementsList[i].deselect))
				elementsList[i].deselect();
		}
	};
	
	//// Sélectionner l'élément ////
	
	this.select = function()
	{
		//$this.deselectAll();
		var selected = $this.onSelect($this);
		
		if (selected === true)
			component.setAttribute('class', 'selected');
	};
	
	//// Supprimer le style de survole à tout les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].dragOutAll))
				elementsList[i].dragOutAll();
			else if (utils.isset(elementsList[i].dragOut))
				elementsList[i].dragOut();
		}
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
	
	//// Afficher ou masquer la flêche de dépliage selon qu'il y a des enfants ou non ////
	
	this.updateArrow = function()
	{
		if (elementsList.length > 0)
			component.getById('arrow').style.display = 'inline';
		else
			component.getById('arrow').style.display = 'none';
	};
	
	//// Ajouter un élément enfant à la fin de la liste ////
	
	this.addElement = function($element)
	{
		elementsList.push($element);
		component.getById('leafs').appendChild($element);
		$element.setEditMode(editMode);
		$element.setParentBranch($this);
		$this.updateArrow();
	};
	
	//// Ajouter un élément à la position indiquée ////
	
	this.insertElementInto = function($element, $index)
	{
		elementsList.splice($index, 0, $element);
		component.getById('leafs').insertAt($element, $index);
		$element.setEditMode(editMode);
		$element.setParentBranch($this);
		$this.updateArrow();
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
		
		if (parent === component.getById('leafs'))
			component.getById('leafs').removeChild($element);
		
		$this.updateArrow();
		
		return $element;
	};

	//// Supprimer tous les éléments ////
	
	this.empty = function()
	{
		while (elementsList.length > 0)
			$this.removeElement(elementsList[0]);
	};
	
	//// Déplier l'élément s'il a des enfants ////
	
	this.open = function()
	{
		deploy = true;
		component.getById('arrow').innerHTML = "▼";
		component.getById('leafs').removeAttribute('style');
		$this.onOpen($this);
	};
	
	//// Déplier l'élément et tous ses enfants ////
	
	this.openAll = function()
	{
		deploy = true;
		component.getById('arrow').innerHTML = "▼";
		component.getById('leafs').removeAttribute('style');
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].openAll))
				elementsList[i].openAll();
		}
	};
	
	//// Replier l'élément et tous ses enfants ////
	
	this.closeAll = function()
	{
		deploy = false;
		component.getById('arrow').innerHTML = "►";
		component.getById('leafs').style.display = "none";
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};

	//// Refresh ////

	this.refresh = function()
	{
		if (deploy === true)
		{
			$this.onRefresh($this);

			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].refresh))
					elementsList[i].refresh();
			}
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onSelect = function($selectedElement) { return true; };
	this.onOpen = function($element) {};
	this.onChange = function() {};
	this.onRefresh = function($element) {};

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
	
	component.onClick = function() { $this.select(); };
	component.getById('element-label').onClick = function() { $this.select(); };
	
	//// En cliquant sur la flèche on plie ou déplie l'élément ////
	
	component.getById('arrow').onClick = function()
	{
		if (deploy === true)
		{
			deploy = false;
			component.getById('arrow').innerHTML = "►";
			component.getById('leafs').style.display = "none";
		}
		else
		{
			deploy = true;
			component.getById('arrow').innerHTML = "▼";
			component.getById('leafs').removeAttribute('style');
			$this.onOpen($this);
		}
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
	
	this.isDeployed = function() { return deploy; };
	this.isOpen = function() { return deploy; };

	this.hasChildrenOpen = function()
	{
		var hasChildrenOpen = false;

		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].isOpen) && elementsList[i].isOpen())
			{
				hasChildrenOpen = true;
				i = elementsList.length;
			}
		}

		return hasChildrenOpen;
	};

	this.isEditMode = function() { return editMode; };
	this.getParentBranch = function() { return parentBranch; };
	this.getElementsList = function() { return elementsList; };
	this.getBranches = function() { return elementsList; };
	this.getParentNode = function() { return parentNode; };
	
	//// Détecter si l'élement ou un de ses enfants est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		$this.dragOutAll();
		
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.getById('element-label').position();
		
		if ($y >= position.y && $y <= position.y+component.getById('element-label').offsetHeight)
			isMouseOver = true;
		
		if (isMouseOver === false)
		{
			if (deploy === true)
			{
				for (var i = 0; i < elementsList.length; i++)
				{
					//if (elementsList[i] !== $movingElement)
					{
						overLayer = elementsList[i].getOverLayer($x, $y);
						
						if (utils.isset(overLayer))
							i = elementsList.length;
					}
				}
			}
		}
		else
			overLayer = $this;
		
		return overLayer;
	};
	
	this.getListNode = function() { return component.getById('leafs'); };
	
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
		var jsonData = { "type": "branch", "ordered": ordered, "deploy": deploy, "label": $html, "elementsList": [] };

		for (var i = 0; i < elementsList.length; i++)
			jsonData.elementsList.push(elementsList[i].getJSON());

		return jsonData;
	};

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].setEditMode(editMode);
	};
	
	this.setParentBranch = function($parentBranch) { parentBranch = $parentBranch; };

	this.loadFromJSON = function($json)
	{
		ordered = $json.ordered;
		deploy = $json.deploy;

		for (var i = 0; i < $json.elementsList.length; i++)
		{
			var item = new TreeLeaf(json.elementsList[i].label);

			if ($json.type === "branch")
				item = new TreeBranch(json.elementsList[i].label, ordered);

			item.loadFromJSON($json.elementsList[i]);
			$this.select();
			$this.addElement(item);
		}
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	$this.updateArrow();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("treeBranch");

