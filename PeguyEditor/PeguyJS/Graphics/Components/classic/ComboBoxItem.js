function ComboBoxItem($name, $value, $color, $selected)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var value = $value;
	var color = $color;
	var selected = $selected;

	var html = '<li>';

	if (selected === true)
		html = '<li class="selected" >';
	
	if (utils.isset(color) && color !== '')
		html = html + '<span class="color-icon" style="background-color: ' + color + '; " ></span>';
	
	html = html + dataManager.encodeHTMLEntities(name);
	
	html = html + '</li>';
	
	var component = new Component(html);

	//////////////
	// Méthodes //
	//////////////

	var update = function()
	{
		var innerHTML = "";
		
		if (utils.isset(color) && color !== '')
			innerHTML = innerHTML + '<span class="color-icon" style="background-color: ' + color + '; " ></span>';
		
		innerHTML = innerHTML + dataManager.encodeHTMLEntities(name);
		
		component.innerHTML = innerHTML;
		component.set("value", value);

		if (selected === true)
			component.addClass("selected");
		else
			component.removeClass("selected");
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
		pudate();
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
	Loader.hasLoaded("comboBoxItem");