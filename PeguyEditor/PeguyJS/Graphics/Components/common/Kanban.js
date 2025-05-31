function Kanban($sorted)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isKanban = true;
	
	var sorted = $sorted;
	var editMode = false;
	var columnsList = [];
	
	var html = '<div class="kanban" >'
					+ '<div id="columnsList" class="columnsList" ></div>'
					+ '<div id="addBlock" class="addBlock" >'
						+ '<div id="addButton" class="addButton" >'
							+ '<span id="addIcon" ></span>'
							+ KEYWORDS.addList
						+ '</div>'
						+ '<div id="addForm" class="addForm" >'
							+ '<div class="labelRow" ><input id="labelField" class="labelField" type="text" placeholder="' + KEYWORDS.listTitle  + '" /></div>'
							+ '<div class="buttonRow" >'
								+ '<input type="button" id="confirmAddButton" class="confirmAddButton" value="' + KEYWORDS.addTheList + '" />'
								+ '<span id="closeButton" class="closeButton" ></span>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
	component.getById('addIcon').appendChild(addIcon);
	
	var closeIcon = Loader.getSVG('icons', 'black-close-icon', 24, 24);
	component.getById('closeButton').appendChild(closeIcon);
	
	//////////////
	// Méthodes //
	//////////////
	
	//// Ajouter une colonne ////
	
	this.addColumn = function($column)
	{
		columnsList.push($column);
		component.getById('columnsList').appendChild($column);
		$column.setParent($this);
		$column.setSorted(sorted);
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est déplacé
		
		$column.onDrag = function($x, $y, $element)
		{
			var overLayer = null;
			
			if (editMode === true)
			{
				for (var i = 0; i < columnsList.length; i++)
				{
					overLayer = columnsList[i].getOverLayer($x, $y, $element);
					
					if (utils.isset(overLayer))
						i = columnsList.length;
				}
				
				if (!utils.isset(overLayer))
					overLayer = $this;
			}
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		$column.onRelease = function($element, $index)
		{
			if (editMode === true)
			{
				if ($element.isColumn === true)
				{
					$this.removeColumn($element);
					$this.insertColumnInto($element, $index);
					$element.setParent($this);
					onChange($element);
				}
				else if ($element.isCard === true)
				{
					var oldParent = $element.getParent();
					var newParent = $element.getParentNode().column;
					
					// Retirer l'élément déplacé de l'ancien parent
					if (utils.isset(oldParent.removeCard))
						oldParent.removeCard($element);
					
					// Ajouter l'élément déplacé au nouveau parent
					if (utils.isset(newParent.insertCardInto))
					{
						newParent.insertCardInto($element, $index);
						
						if (newParent.isSorted() === true)
							newParent.sortCards();
					}
					
					$element.setParent(newParent);
					
					//onChange($element);
				}
			}
		};
		
		// Quand l'élément est modifié
		
		$column.onChange = function($data) { onChange($data); };
		$column.setEditMode(editMode);
		
		onChange($column);
	};
	
	this.insertColumnInto = function($column, $index)
	{
		columnsList.splice($index, 0, $column);
		component.getById('columnsList').insertAt($column, $index);
		$column.setParent($this);
		$column.setSorted(sorted);
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est déplacé
		
		$column.onDrag = function($x, $y, $element)
		{
			var overLayer = null;
			
			if (editMode === true)
			{
				for (var i = 0; i < columnsList.length; i++)
				{
					overLayer = columnsList[i].getOverLayer($x, $y, $element);
					
					if (utils.isset(overLayer))
						i = columnsList.length;
				}
				
				if (!utils.isset(overLayer))
					overLayer = $this;
			}
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		$column.onRelease = function($element, $index)
		{
			if (editMode === true)
			{
				if ($element.isColumn === true)
				{
					$this.removeColumn($element);
					$this.insertColumnInto($element, $index);
					$element.setParent($this);
					onChange($element);
				}
				else if ($element.isCard === true)
				{
					var oldParent = $element.getParent();
					var newParent = $element.getParentNode().column;
					
					// Retirer l'élément déplacé de l'ancien parent
					if (utils.isset(oldParent.removeCard))
						oldParent.removeCard($element);
					
					// Ajouter l'élément déplacé au nouveau parent
					if (utils.isset(newParent.insertCardInto))
						newParent.insertCardInto($element, $index);
					
					$element.setParent(newParent);
					
					//onChange($element);
				}
			}
		};
		
		// Quand l'élément est modifié
		
		$column.onChange = function($data) { onChange($data); };
		$column.setEditMode(editMode);
		
		onChange($column);
	};
	
	//// Supprimer une colonne ////
	
	this.removeColumn = function($column)
	{
		var index = columnsList.indexOf($column);
		
		if (index > -1)
			columnsList.splice(index, 1);
		
		if ($column.parentNode)
			$column.parentNode.removeChild($column);
	};
	
	//// Supprimer tous les éléments ////
	
	this.empty = function()
	{
		while (columnsList.length > 0)
			$this.removeElement(columnsList[0]);
	};
	
	var onCloseAddForm = function($emitter)
	{
		if ($this.containsInChildren($emitter))
		{
			component.getById('addButton').style.display = 'block';
			component.getById('addForm').style.display = 'none';
		}
	};
	
	// A surcharger
	this.createColumn = function($label)
	{
		var newColumn = new KanbanColumn($label, sorted);
		return newColumn;
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	
	component.getById('addButton').onClick = function()
	{
		component.getById('addButton').style.display = 'none';
		component.getById('addForm').style.display = 'block';
		component.getById('labelField').value = '';
		component.getById('labelField').focus();
	};
	
	component.getById('closeButton').onClick = function()
	{
		component.getById('addButton').style.display = 'block';
		component.getById('addForm').style.display = 'none';
	};
	
	component.onClick = component.onMouseDown = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		component.getById('addButton').style.display = 'block';
		component.getById('addForm').style.display = 'none';
	};
	
	component.getById('confirmAddButton').onClick = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			var newColumn = $this.createColumn(newLabel);
			$this.addColumn(newColumn);
			component.getById('addButton').style.display = 'block';
			component.getById('addForm').style.display = 'none';
		}
	};
	
	var onMouseMove = function($event)
	{
		Events.emit('onHideKanbanEditIcon', []);
		
		if (editMode === true)
		{
			for (var i = 0; i < columnsList.length; i++)
			{
				if (utils.isset(columnsList[i].mouseMove))
					columnsList[i].mouseMove($event);
			}
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		Events.emit('onHideKanbanEditIcon', []);
		
		if (editMode === true)
		{
			for (var i = 0; i < columnsList.length; i++)
			{
				if (utils.isset(columnsList[i].mouseUp))
					columnsList[i].mouseUp($event);
			}
		}
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		for (var i = 0; i < columnsList.length; i++)
			columnsList[i].onKeyUp($event);
	};
	
	component.connect('onCloseKanbanAddForm', onCloseAddForm);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getColumnsList = function() { return columnsList; };

	this.getJSON = function()
	{
		var jsonData =
		{
			"sorted": sorted,
			"editMode": editMode,
			"columnsList": []
		};

		for (var i = 0; i < columnsList.length; i++)
			jsonData.columnsList.push(columnsList[i].getJSON());

		return jsonData;
	};

	// Ajouter une sortie de tout le kanban au format json
	// Ajouter une entrée pour charger tout le kanban à partir d'un json

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
		{
			component.getById('columnsList').addClass('edit-mode');
			component.getById('addBlock').style.display = 'inline-block';
		}
		else
		{
			component.getById('columnsList').removeClass('edit-mode');
			component.getById('addBlock').style.display = 'none';
		}
		
		for (var i = 0; i < columnsList.length; i++)
			columnsList[i].setEditMode(editMode);
	};

	this.loadFromJSON = function($json)
	{
		label = $json.label;
		sorted = $json.sorted;

		for (var i = 0; i < $json.columnsList.length; i++)
		{
			var column = new KanbanColumn($json.columnsList[i].label, sorted);
			column.loadFromJSON($json.columnsList[i]);
			$this.addColumn(column);
		}
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("kanban");