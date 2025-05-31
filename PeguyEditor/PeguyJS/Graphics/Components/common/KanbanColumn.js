function KanbanColumn($label, $sorted)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isColumn = true;
	
	var label = $label;
	var sorted = $sorted;
	var editMode = false;
	var cardsList = [];
	
	var html = '<div class="kanbanColumn" column="column" >'
					+ '<div id="innerColumn" class="innerColumn" >'
						+ '<h3 id="label" class="label" >' + label + '</h3>'
						+ '<div id="editLabelBlock" class="editLabelBlock" >'
							+ '<input type="text" id="editLabelInput" value="' + label + '" />'
							+ '<span id="closeLabelIcon" class="closeLabelIcon" ></span>'
						+ '</div>'
						+ '<div id="list-canvas" class="list" >'
							+ '<ul id="list" ></ul>'
						+ '</div>'
						+ '<div id="addBlock" class="addBlock" >'
							+ '<div id="buttons" class="buttons" >'
								+ '<a id="addCardButton" >'
									+ '<span id="addIcon" ></span>'
									+ KEYWORDS.addCard
								+ '</a>'
							+ '</div>'
							+ '<div id="addForm" class="addForm" >'
								+ '<div class="labelRow" ><textarea id="labelField" class="labelField" placeholder="' + KEYWORDS.cardTitle + '" ></textarea></div>'
								+ '<div class="buttonRow" >'
									+ '<input type="button" id="confirmAddButton" class="confirmAddButton" value="' + KEYWORDS.addTheCard + '" />'
									+ '<span id="closeButton" class="closeButton" ></span>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	var closeLabelIcon = Loader.getSVG('icons', 'black-close-icon', 16, 16);
	component.getById('closeLabelIcon').appendChild(closeLabelIcon);
	
	var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
	component.getById('addIcon').appendChild(addIcon);
	
	var closeIcon = Loader.getSVG('icons', 'black-close-icon', 24, 24);
	component.getById('closeButton').appendChild(closeIcon);
	
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
	
	//// Ajouter une carte ////
	
	this.addCard = function($card)
	{
		cardsList.push($card);
		component.getById('list').appendChild($card);
		$card.setParent($this);
		$card.setSorted(sorted);
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est déplacé
		
		$card.onDrag = function($x, $y, $card2)
		{
			var overLayer = null;
			
			if (editMode === true)
				overLayer = $this.onDrag($x, $y, $card2);
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		$card.onRelease = function($card2, $index)
		{
			if (editMode === true)
				$this.onRelease($card2, $index);
		};
		
		// Quand l'élément est modifié
		
		$card.onChange = function($data) { onChange($data); };
		$card.setEditMode(editMode);
		
		$this.autoResize();
		onChange($card);
	};
	
	//// Ajouter une carte à la position indiquée ////
	
	this.insertCardInto = function($card, $index)
	{
		cardsList.splice($index, 0, $card);
		component.getById('list').insertAt($card, $index);
		$card.setEditMode(editMode);
		$card.setParent($this);
		$card.setSorted(sorted);
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est déplacé
		
		$card.onDrag = function($x, $y, $card2)
		{
			var overLayer = null;
			
			if (editMode === true)
				overLayer = $this.onDrag($x, $y, $card2);
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		$card.onRelease = function($card2, $index)
		{
			if (editMode === true)
				$this.onRelease($card2, $index);
		};
		
		// Quand l'élément est modifié
		
		$card.onChange = function($data) { onChange($data); };
		$card.setEditMode(editMode);
		
		$this.autoResize();
		onChange($card);
	};
	
	//// Supprimer une carte ////
	
	this.removeCard = function($card)
	{
		var index = cardsList.indexOf($card);
		
		if (index > -1)
			cardsList.splice(index, 1);
		
		if ($card.parentNode)
			$card.parentNode.removeChild($card);
		
		$this.autoResize();
	};
	
	//// Supprimer tous les éléments ////
	
	this.empty = function()
	{
		while (cardsList.length > 0)
			$this.removeElement(cardsList[0]);
		
		$this.autoResize();
	};
	
	var resize = function()
	{
		//console.log(component.getById('list-canvas').scrollHeight + ', ' + component.getById('list-canvas').offsetHeight);
		
		if (component.getById('list-canvas').scrollHeight > component.getById('list-canvas').offsetHeight)
		{
			//component.getById('list-canvas').style.paddingRight = '6px';
			component.getById('list-canvas').style.overflowY = 'scroll';
		}
		else
			component.getById('list-canvas').removeAttribute('style');
	};
	
	this.autoResize = function()
	{
		var width = component.offsetWidth;
		
		if (width > 0)
			resize();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	var onCloseAddForm = function($emitter)
	{
		//if (parent.containsInChildren($emitter))
		{
			component.getById('innerColumn').removeClass("adding-card");
			label = component.getById('editLabelInput').value;
			component.getById('label').innerHTML = label;
			component.getById('editLabelBlock').style.display = 'none';
			component.getById('label').style.display = 'block';
		}
	};
	
	// A surcharger
	this.createCard = function($label)
	{
		var newCard = new KanbanCard($label, sorted);
		return newCard;
	};
	
	// A surcharger
	this.sortCards = function()
	{
		for (var i = 0; i < cardsList.length; i++)
		{
			for (j = i; j < cardsList.length; j++)
			{
				if (cardsList[i].getLabel() > cardsList[j].getLabel())
				{
					var tmp = cardsList[j];
					cardsList[j] = cardsList[i];
					cardsList[i] = tmp;
				}
			}
		}
		
		for (var i = 0; i < cardsList.length; i++)
			component.getById('list').appendChild(cardsList[i]);
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	
	component.getById('label').onClick = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		
		if (editMode === true)
		{
			component.getById('label').style.display = 'none';
			component.getById('editLabelBlock').style.display = 'block';
			component.getById('editLabelInput').focus();
			
			if (utils.isset(component.getById('editLabelInput').select))
				component.getById('editLabelInput').select();
			else
				component.getById('editLabelInput').setSelectionRange(0, component.getById('editLabelInput').length);
		}
	};
	
	component.getById('closeLabelIcon').onClick = component.getById('closeLabelIcon').onMouseDown = function()
	{
		label = component.getById('editLabelInput').value;
		component.getById('label').innerHTML = label;
		component.getById('label').style.display = 'block';
		component.getById('editLabelBlock').style.display = 'none';
	};
	
	component.getById('addForm').onMouseDown = function() {};
	component.getById('addForm').onMouseUp = function() {};
	component.getById('addForm').onClick = function() {};
	
	component.getById('addCardButton').onClick = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		component.getById('innerColumn').addClass("adding-card");
		
		if (utils.isset(component.getById('list-canvas').scrollTo))
			component.getById('list-canvas').scrollTo(0, component.getById('list-canvas').scrollHeight);
		else
			component.getById('list-canvas').scrollTop = component.getById('list-canvas').scrollHeight;
		
		component.getById('labelField').value = '';
		component.getById('labelField').focus();
	};
	
	component.getById('closeButton').onClick = function()
	{
		component.getById('innerColumn').removeClass("adding-card");
		Events.emit('onCloseKanbanAddForm', [$this]);
	};
	
	component.getById('confirmAddButton').onClick = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			var newCard = $this.createCard(newLabel);
			$this.addCard(newCard);
			component.getById('innerColumn').removeClass("adding-card");
			
			if (utils.isset(component.getById('list-canvas').scrollTo))
				component.getById('list-canvas').scrollTo(0, component.getById('list-canvas').scrollHeight);
			else
				component.getById('list-canvas').scrollTop = component.getById('list-canvas').scrollHeight;
		}
	};
	
	//// Déclenchement du drag & drop ////
	
	component.onMouseDown = function($event)
	{
		if (editMode === true)
		{
			Events.preventDefault($event);
			
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
		
		Events.emit('onCloseKanbanAddForm', [$this]);

		return false;
	};
	
	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($column, $index) {};
	//this.onDragCard = function($x, $y) { return null; };
	//this.onReleaseCard = function($card, $index) {};
	
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
						
						ghost = document.createElement('div');
						ghost.setAttribute('class', 'ghost-kanbanColumn');
						ghost.style.height = component.offsetHeight + "px";
						ghost.innerHTML = component.innerHTML;
						
						document.getElementById('main').appendChild(ghost);
						
						parentNode = component.parentNode;
						offsetIndex = component.index();
						currentIndex = offsetIndex;
						parentNode.removeChild(component);
						
						virtualItem = document.createElement('div');
						virtualItem.setAttribute('class', 'virtual-kanbanColumn');
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
					
					var overLayer = $this.onDrag(mouseX, mouseY, $this);
					
					// Si on survole un élément
					
					//console.log(overLayer);
					
					if (utils.isset(overLayer) && overLayer !== $this)
					{
						overLayerPosition = overLayer.position();
						deltaX = mouseX-overLayerPosition.x;
						deltaY = mouseY-overLayerPosition.y;
						
						if (overLayer.isClass('kanban'))
						{
							parentNode = overLayer.getById('columnsList');
							parentNode.appendChild(virtualItem);
						}
						else
						{
							if (overLayer.isColumn === true)
							{
								parentNode = overLayer.parentNode;
								parentNode.insertBefore(virtualItem, overLayer);
							}
						}
					}
					
					currentIndex = virtualItem.index();
				}
			}
			else
			{
				for (var i = 0; i < cardsList.length; i++)
					cardsList[i].mouseMove($event);
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
				
				Events.emit('onCloseKanbanAddForm', [$this]);
			}
			else
			{
				for (var i = 0; i < cardsList.length; i++)
					cardsList[i].mouseUp($event);
			}
		}
	};
	
	this.mouseUp = onMouseUp;
	
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
			for (var i = 0; i < cardsList.length; i++)
				cardsList[i].onKeyUp($event);
		}
	};
	
	this.onResize = function() { resize(); };
	
	component.connect('onCloseKanbanAddForm', onCloseAddForm);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getCardsList = function() { return cardsList; };

	this.getJSON = function()
	{
		var jsonData  = { "label": label, "sorted": sorted, "editMode": editMode, "cardsList": [] };

		for (var i = 0; i < cardsList.length; i++)
			jsonData.cardsList.push(cardsList[i].getLabel());

		return jsonData;
	};
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var nodeToCheck = component;
		
		if ($movingElement === $this && utils.isset(virtualItem))
			nodeToCheck = virtualItem;
		
		var position = nodeToCheck.position();
		
		//console.log($x + ', ' + $y);
		//console.log(position);
		
		var marginLeft = parseInt(component.getStyle('margin-left').replace('px', ''));
		var marginRight = parseInt(component.getStyle('margin-right').replace('px', ''));
		var marginTop = parseInt(component.getStyle('margin-top').replace('px', ''));
		var marginBottom = parseInt(component.getStyle('margin-bottom').replace('px', ''));
		
		//if ($x >= position.x-marginLeft && $x <= position.x + nodeToCheck.offsetWidth+marginRight)
		if ($x >= position.x && $x <= position.x + nodeToCheck.offsetWidth)
		{
			isMouseOver = true;
			overLayer = $this;
		}
		
		if (isMouseOver === true && $movingElement.isCard === true)
		{
			isMouseOver = false;
			
			for (var i = 0; i < cardsList.length; i++)
			{
				overLayer = cardsList[i].getOverLayer($x, $y, $movingElement);
				
				if (utils.isset(overLayer))
				{
					isMouseOver = true;
					i = cardsList.length;
				}
			}
		}
		
		//if (isMouseOver !== true && $x >= position.x-marginLeft && $x <= position.x + nodeToCheck.offsetWidth+marginRight)
		if (isMouseOver !== true && $x >= position.x && $x <= position.x + nodeToCheck.offsetWidth)
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
			var column = previousSibling.getAttribute('column');
			
			if (column === 'column')
				i++;
			
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isSorted = function() { return sorted; };
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parent))
		{
			if (parent.getColumnsList()[parent.getColumnsList().length-1] === $this)
				isLast = true;
			else if (parent.getColumnsList()[parent.getColumnsList().length-2] === $this && parent.getColumnsList()[parent.getColumnsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };

	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('label').innerHTML = label;
		component.getById('editLabelInput').value = label;
	};
	
	this.setSorted = function($sorted) { sorted = $sorted; };
	this.setParent = function($parent) { parent = $parent; };
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
			component.getById('innerColumn').addClass('edit-mode');
		else
			component.getById('innerColumn').addClass('edit-mode');
		
		for (var i = 0; i < cardsList.length; i++)
			cardsList[i].setEditMode(editMode);
	};

	this.loadFromJSON = function($json)
	{
		label = $json.label;
		sorted = $json.sorted;
		editMode = $json.editMode;

		for (var i = 0; i < $json.cardsList.length; i++)
			$this.addCard(new KanbanCard($json.cardsList[i], sorted));
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	this.autoResize();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("kanbanColumn");