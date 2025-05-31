function ListBox()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<ul class="listBox" >'
				+ '</ul>';
				
	var component = new Component(html);
	
	var editMode = false;
	var elementsList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	this.addElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index < 0)
		{
			elementsList.push($element);
			component.appendChild($element);
			$element.setParent($this);
		}
		
		$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
		$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
		$this.onChange();
	};
	
	this.insertElementInto = function($element, $index)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
			elementsList.splice(index, 1);
		
		elementsList.splice($index, 0, $element);
		component.insertAt($element, $index);
		$element.setParent($this);
		$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
		$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
		$this.onChange();
	};
	
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
		{
			elementsList.splice(index, 1);
			
			if (utils.isset($element.parentNode))
				$element.parentNode.removeChild($element);
			
			$this.onChange();
		}
	};
	
	this.removeAllElement = function()
	{
		//$this.closeAll();
		elementsList = [];
		component.removeAllChildren();
		$this.onChange();
	};
	
	var onDrag = function($x, $y, $element)
	{
		var overLayer = null;
		
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
		
		return overLayer;
	};
	
	var onRelease = function($tab, $index) { $this.insertElementInto($tab, $index); };

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function() {};
	
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
			var hasChanged = false;

			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].mouseUp))
				{
					var changed = elementsList[i].mouseUp($event);

					if (changed === true)
						hasChanged = true;
				}
			}
			
			if (hasChanged === true)
				$this.onChange();
		}
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
				elementsList[i].onKeyUp($event);
			
			$this.onChange();
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getElementsList = function() { return elementsList; };
	this.isEditMode = function() { return editMode; };

	this.getJSON = function()
	{
		var jsonTable = [];

		for (var i = 0; i < elementsList.length; i++)
			jsonTable.push(elementsList[i].getJSON());

		return jsonTable;
	};
	
	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };

	this.loadFromJSON = function($json)
	{
		for (var i = 0; i < $json.length; i++)
		{
			var item = new ListItem($json[i].label);
			item.loadFromJSON($json[i]);
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
	Loader.hasLoaded("listBox");