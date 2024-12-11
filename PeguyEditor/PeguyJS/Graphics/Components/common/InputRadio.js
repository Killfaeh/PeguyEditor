function InputRadio($name, $label, $value, $selected, $isHTML)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var label = $label;
	var value = $value;
	var selected = $selected;
	var isHTML = $isHTML;
	
	var labelToDisplay = dataManager.encodeHTMLEntities(label);
	
	if (isHTML === true)
		labelToDisplay = label;
	
	var enable = true;
	
	var html = '<li class="inputRadio" ><input type="radio" id="radio" name="' + name + '" value="' + dataManager.encodeHTMLEntities(value) + '" /> <label id="label" for="radio" >' + labelToDisplay + '</label></li>';
	
	if (selected === true)
		html = '<li class="inputRadio" ><input type="radio" id="radio" name="' + name + '" value="' + dataManager.encodeHTMLEntities(value) + '" checked="checked" /> <label id="label" for="radio" >' + labelToDisplay + '</label></li>';
	
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onSelect = function($value) {};
	
	var onSelect = function()
	{
		if (enable === true)
		{
			component.getById('radio').set('checked', 'checked');
			$this.onSelect(value);
		}
	};
	
	component.getById('radio').onClick = function() { onSelect(); };
	component.getById('label').onClick = function() { onSelect(); };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getName = function() { return name; };
	this.getLabel = function() { return label; };
	this.getValue = function() { return value; };
	this.isSelected = function() { return selected; };
	this.isEnable = function() { return enable; };
	
	// SET
	
	this.setLabel = function($label)
	{
		var label = $label;
		component.getById('label').removeAllChildren();
		component.getById('label').appendChild(utils.createText(label));
	};
	
	this.setSelected = function($selected)
	{
		selected = $selected;
		
		if (selected === true)
		{
			component.getById('radio').set('checked', 'checked');
			onSelect();
		}
		else
			component.getById('radio').removeAttribute('checked');
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable === true)
			component.getById('radio').removeAttribute('disabled');
		else
			component.getById('radio').set('disabled', 'disabled');
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputRadio");