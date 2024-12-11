function Option($name, $value, $selected)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var value = $value;
	var selected = $selected;

	var html = '<option id="' + value + '" value="' + value + '" >' + dataManager.encodeHTMLEntities(name) + '</option>';

	if (selected === true)
		html = '<option id="' + value + '" value="' + value + '" selected="selected" >' + dataManager.encodeHTMLEntities(name) + '</option>';
	
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	var update = function()
	{
		component.removeAllChildren();
		component.appendChild(utils.createText(name));
		component.set("value", value);
		
		if (selected === true)
			component.set("selected", "selected");
		else
			component.removeAttribute("selected");
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getName = function() { return name; };
	this.getValue = function() { return value; };
	this.isSelected = function() { return selected; };
	
	// SET
	this.setName = function($name) 
	{
		name = $name;
		update();
	};
	
	this.setValue = function($value) 
	{
		value = $value;
		update();
	};
	
	this.setSelected = function($selected) 
	{
		selected = $selected;
		update();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("option");