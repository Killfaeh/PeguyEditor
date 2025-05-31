function Tree($ordered)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isTree = true;
	
	var ordered = $ordered;
	var editMode = false;
	var elementsList = [];
	var selectedElement = null;
	
	var html = '<ul id="tree" class="tree" ><div class="mask" ></div></ul>';
	
	if (ordered === true)
		html = '<ol id="tree" class="tree" ><div class="mask" ></div></ol>';

	var component = new Component(html);

	//////////////
	// Méthodes //
	//////////////
	
	//// Désélectionner tout ////

	var deselectAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].deselectAll))
				elementsList[i].deselectAll();
			else if (utils.isset(elementsList[i].deselect))
				elementsList[i].deselect();
		}
		
		selectedElement = null;
	};
	
	this.deselectAll = function() { deselectAll(); };
	
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
	
	//// Ajouter un élément ////
	
	this.addElement = function($element)
	{
		// Si un élément est déjà sélectionné on ajoute le nouvel élément à celui déjà sélectionné
		if (utils.isset(selectedElement))
		{
			// Si l'élément sélectionné est une brache, on lui ajoute le nouvel élément
			if (utils.isset(selectedElement.addElement))
			{
				selectedElement.addElement($element);
				$element.setParentBranch(selectedElement);
			}
			// Sinon on l'ajoute au parent
			else
			{
				var parentBranch = selectedElement.getParentBranch();

				if (parentBranch === $this)
				{
					elementsList.push($element);
					$this.appendChild($element);
					$element.setParentBranch($this);
					$element.setEditMode(editMode);
				}
				else
				{
					parentBranch.addElement($element);
					$element.setParentBranch(parentBranch);
				}
			}
		}
		// Sinon on l'ajoute à la racine
		else
		{
			elementsList.push($element);
			$this.appendChild($element);
			$element.setParentBranch($this);
			$element.setEditMode(editMode);
		}
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est sélectionné

		$element.onSelect = function($selectedElement)
		{
			deselectAll();
			selectedElement = $selectedElement;
			$this.onSelect(selectedElement);

			return true;
		};
		
		$element.onChange = function($element2) { onChange($element2); };
		
		// Quand l'élément est déplacé
		// On vérifie si on passe au dessus d'un autre élément et si oui on déclenche la fonction de survole
		
		$element.onDrag = function($x, $y)
		{
			var overLayer = null;
			
			if (editMode === true)
			{
				$this.dragOutAll();
				
				for (var i = 0; i < elementsList.length; i++)
				{
					if (elementsList[i] !== $element)
					{
						overLayer = elementsList[i].getOverLayer($x, $y, $element);
						
						if (utils.isset(overLayer))
						{
							i = elementsList.length;
							//overLayer.dragOver();
						}
					}
				}
				
				if (!utils.isset(overLayer))
					overLayer = $this;
			}
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		
		$element.onRelease = function($element2, $index)
		{
			if (editMode === true)
			{
				var oldParentBranch = $element2.getParentBranch();
				var newParentBranch = $element2.getParentNode().parentNode;
				
				if (newParentBranch.tagName.toLowerCase() !== 'li')
					newParentBranch = $this;
				
				// Retirer l'élément déplacé de l'ancien parent
				
				if (utils.isset(oldParentBranch.setParentBranch))
					oldParentBranch.removeElement($element2);
				else
				{
					$this.removeElement($element2);

					/*
					var index = elementsList.indexOf($element2);
					
					if (index > -1)
						elementsList.splice(index, 1);
					//*/
				}
				
				// Ajouter l'élément déplacé au nouveau parent
				
				if (utils.isset(newParentBranch.insertElementInto))
					newParentBranch.insertElementInto($element2, $index);
				else
				{
					//elementsList.push($element2);
					console.log($index);
					elementsList.splice($index-1, 0, $element2);
					console.log(elementsList);
					$this.insertAt($element2, $index);
				}
				
				$element2.setParentBranch(newParentBranch);
				
				$this.dragOutAll();
				
				onChange($element2);
			}
		};
		
		// Quand l'élément est modifié
		
		$element.onChange = function($data) { onChange($data); };
		
		$element.setEditMode(editMode);
		
		$element.select();

		onChange();
	};
	
	//// Supprimer un élément ////
	
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index > -1)
			elementsList.splice(index, 1);
		
		var parent = $element.parentNode;
		
		if (parent === component.getById('tree'))
			component.getById('tree').removeChild($element);
		
		onChange();
	};
	
	//// Supprimer tous les éléments ////
	
	this.empty = function()
	{
		while (elementsList.length > 0)
			$this.removeElement(elementsList[0]);
		
		onChange();
	};

	//// Supprimer tous les éléments d'une branche ////
	
	this.emptyBranch = function($branch)
	{
		$branch.empty();
		onChange();
	};
	
	//// Ouvrir tous les éléments ////
	
	this.openAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].openAll))
				elementsList[i].openAll();
		}
	};
	
	//// Fermer tous les éléments ////
	
	this.closeAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};

	this.refresh = function()
	{
		$this.onRefresh($this);
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].refresh))
				elementsList[i].refresh();
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onSelect = function($data) {};
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	this.onRefresh = function($element) {};
	
	this.onClick = function() { deselectAll(); };
	
	var onMouseMove = function($event)
	{
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].mouseMove))
					elementsList[i].mouseMove($event);
			}
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].mouseUp))
					elementsList[i].mouseUp($event);
			}
		}
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].onKeyUp($event);
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getBranches = function() { return elementsList; };
	this.getElementsList = this.getBranches;
    this.getSelectedElement = function() { return selectedElement; };

	this.getJSON = function()
	{
		var jsonData = { "type": "tree", "ordered": ordered, "elementsList": [] };

		for (var i = 0; i < elementsList.length; i++)
			jsonData.elementsList.push(elementsList[i].getJSON());

		return jsonData;
	};

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
			$this.addClass('edit-mode');
		else
			$this.removeClass('edit-mode');
		
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].setEditMode(editMode);
	};

	this.loadFromJSON = function($json)
	{
		ordered = $json.ordered;

		for (var i = 0; i < $json.elementsList.length; i++)
		{
			var item = new TreeLeaf(json.elementsList[i].label);

			if ($json.type === "branch")
				item = new TreeBranch(json.elementsList[i].label, ordered);

			item.loadFromJSON($json.elementsList[i]);
			$this.deselectAll();
			$this.addElement(item);
		}
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("tree");