function Label($label)
{
	////////////////
	// Attributes //
	////////////////

	var label = $label;
	
	var html = '<span class="label" >'
					+ '<span id="label" class="labelText" >' + label + '</span>'
					+ '<span id="close" class="closeLabel" >X</span>'
				+ '</span>';

	var component = new Component(html);
	
	var parent = null;

	/////////////
	// Methods //
	/////////////
	
	/////////////////
	// Init events //
	/////////////////
	
	var onClose = function()
	{
		if (utils.isset(parent))
			parent.removeLabel($this);
	};
	
	component.getById('close').onClick = function() { onClose(); };

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getLabel = function() { return label; };
	this.getParent = function() { return parent; };

	this.getJSON = function()
	{
		var jsonData = { "label": label };
		return jsonData;
	};

	// SET

	this.setLabel = function($label)
	{
		label = $label;
	};
	
	this.setParent = function($parent) { parent = $parent; };

	this.loadFromJSON = function($json)
	{
		label = $json.label;
	};

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("label");
