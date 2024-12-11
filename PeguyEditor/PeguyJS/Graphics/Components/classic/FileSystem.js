function FileSystem($sorted)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////
	
	this.isFileSystem = true;
	
	var sorted = $sorted;
	var editMode = false;
	var elementsList = [];
	var selectedElement = null;
	
	var html = '<div class="fileSystem" >'
					+ '<div class="column" ><ul id="root" ></ul></div>'
				+ '</div>';

	var component = new Component(html);

	//////////////
	// Méthodes //
	//////////////
	
	//// Désélectionner tout ////

	var deselectAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			elementsList[i].deselect();
			
			if (utils.isset(elementsList[i].deselectAll))
				elementsList[i].deselectAll();
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
			if (utils.isset(elementsList[i].deselectAll))
				elementsList[i].dragOutAll();
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
				$element.setParentFolder(selectedElement);
			}
			// Sinon on l'ajoute au parent
			else
			{
				var parentBranch = selectedElement.getParentFolder();
				parentBranch.addElement($element);
				$element.setParentFolder(parentBranch);
			}
		}
		// Sinon on l'ajoute à la racine
		else
		{
			elementsList.push($element);
			component.getById('root').appendChild($element);
			$element.setParentFolder($this);
		}
		
		if (utils.isset($element.getListPanel))
			component.appendChild($element.getListPanel());
		
		if (utils.isset($element.setSorted))
			$element.setSorted(sorted);
		
		//// Initialisation des événements du nouvel élément ////
		
		// Quand l'élément est sélectionné

		$element.onSelect = function($selectedElement)
		{
			selectedElement = $selectedElement;
			
			if (utils.isset(component.scrollTo))
				component.scrollTo(component.scrollWidth, 0);
			else
				component.scrollLeft = component.scrollWidth;
			
			$this.onSelect(selectedElement);
		};
		
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
							i = elementsList.length;
					}
				}
				
				if (!utils.isset(overLayer))
				{
					overLayer = $this.getById('root').parentNode;
					$this.getById('root').folder = $this;
				}
				
				if (utils.isset(overLayer.dragOver))
					overLayer.dragOver();
				else
					overLayer.addClass('drag-over');
			}
		
			return overLayer;
		};
		
		// Quand l'élément est lâché après un déplacement
		$element.onRelease = function($element2, $index)
		{
			if (editMode === true)
			{
				var oldParentFolder = $element2.getParentFolder();
				var newParentFolder = $element2.getParentNode().folder;
				
				if (newParentFolder.tagName.toLowerCase() !== 'li')
					newParentFolder = $this;
				
				// Retirer l'élément déplacé de l'ancien parent
				if (utils.isset(oldParentFolder.removeElement))
					oldParentFolder.removeElement($element2);
				
				// Ajouter l'élément déplacé au nouveau parent
				if (utils.isset(newParentFolder.insertElementInto))
					newParentFolder.insertElementInto($element2, $index);
				
				$element2.setParentFolder(newParentFolder);
				
				$this.dragOutAll();
				$element2.select();
				
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
		
		if (parent === component.getById('root'))
			component.getById('root').removeChild($element);
		
		if (utils.isset($element.getListPanel))
			component.removeChild($element.getListPanel());
	};
	
	//// Supprimer tous les éléments ////
	
	this.empty = function()
	{
		while (elementsList.length > 0)
			$this.removeElement(elementsList[0]);
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

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onSelect = function($data) {};
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	
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

	this.getElementsList = function() { return elementsList; };

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].setEditMode(editMode);
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("fileSystem");