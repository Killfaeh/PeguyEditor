function Accordion($openOneCloseAll)
{
	///////////////
	// Attributs //
	///////////////
	
	var openOneCloseAll = $openOneCloseAll;
	
	var html = '<ul class="accordion" ></ul>';
				
	var component = new Component(html);
	
	var elementsList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	this.closeAll = function()
	{
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].close();
	};
	
	this.addElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index < 0)
		{
			elementsList.push($element);
			component.appendChild($element);
			$element.setParent($this);
			
		}
	};
	
	this.insertElementInto = function($element, $index)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
			elementsList.splice(index, 1);
		
		elementsList.splice($index, 0, $element);
		component.insertAt($element, $index);
		$element.setParent($this);
	};
	
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
		{
			elementsList.splice(index, 1);
			
			if (utils.isset($element.parentNode))
				$element.parentNode.removeChild($element);
		}
	};
	
	this.removeAllElement = function()
	{
		$this.closeAll();
		elementsList = [];
		component.removeAllChildren();
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getOpenOneCloseAll = function() { return openOneCloseAll; };
	
	// SET
	
	this.setOpenOneCloseAll = function($openOneCloseAll) { openOneCloseAll = $openOneCloseAll; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("accordion");