function Button($label)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	
	var labelToDisplay = dataManager.encodeHTMLEntities(label);
	
	var enable = true;
	
	var html = '<button class="button" >' + labelToDisplay + '</button>';
	
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onAction = function($value) {};
	
	this.onClick = function($event)
	{
		if (enable === true)
			$this.onAction();
	}
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getLabel = function() { return label; };
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		labelToDisplay = dataManager.encodeHTMLEntities(label);
		labelToDisplay = labelToDisplay.replaceAll("&#160;", " ");
		$this.removeAllChildren();
		$this.appendChild(utils.createText(labelToDisplay));
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable === true)
			$this.removeClass('disabledButton');
		else
			$this.addClass('disabledButton');
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("button");