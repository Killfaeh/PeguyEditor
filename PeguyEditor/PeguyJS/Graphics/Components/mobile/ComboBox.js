function ComboBox($name, $options, $currentValue)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var options = $options;
	var currentValue = $currentValue;
	var currentIndex = 0;
	
	var enable = true;
	var open = false;
	var enlighted = null;

	var html = '<div class="select" >'
					+ '<div id="selectedOption" class="selectedOption" ></div>'
					+ '<div class="displayedOption" id="displayedOption" ><span id="icon" class="icon" ></span></div>'
					+ '<label class="comboBoxLabel" id="comboBoxLabel" ></label>'
				+ '</div>';

	var component = new Component(html);

	var icon = Loader.getSVG('icons', 'sort-icon', 17, 17);
	component.getById('icon').appendChild(icon);
	
	var displayedOption = new InputText("text", "", "", "");
	component.getById('displayedOption').insertAt(displayedOption, 0);
	displayedOption.setReadonly(true);
	
	var selector;

	//////////////
	// Méthodes //
	//////////////

	var select = function($value)
	{
		var selectedOption = null;
		currentValue = $value;
		var currentName = "";
				
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].value === currentValue)
				selectedOption = options[i];
		}
		
		if (!utils.isset(selectedOption))
			selectedOption = options[0];
		
		currentValue = selectedOption.valeur;
		displayedOption.setValue(selectedOption.name);
	};

	var loadOptions = function()
	{
		component.getById("selectedOption").removeAllChildren();
		selector = new Select(name, options, currentValue);
		component.getById("comboBoxLabel").set("for", selector.get('id'));
		component.getById("selectedOption").appendChild(selector);
		
		selector.onChange = function($currentValue)
		{
			//currentValue = selector.getCurrentValue();
			select($currentValue);
			$this.onChange($currentValue);
		};
		
		select(currentValue);
	};
	
	//this.remove = function() { displayedOption.remove(); };
	
	//// Gestion de l'affichage du panneau de sélection. ////
	
	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true)
		{
			$this.onOpen();
			
			if (utils.isset(selector))
				selector.focus();
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	displayedOption.onClick = function() { $this.open(); };
	displayedOption.onFocus = function() { $this.open(); };
	component.getById('icon').onClick = function() { $this.open(); };
	this.onChange = function($value) {};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getOptions = function() { return options; };
	this.getCurrentValue = function() { return selector.getCurrentValue(); };
	this.getCurrentName = function() { return selector.getCurrentName(); };
	this.isOpen = function() { return open; };
	this.isEnable = function() { return enable; };

	// SET
	this.setName = function($name)
	{
		name = $name;
		
		if (utils.isset(selector))
		{
			selector.set("id", name);
			selector.set("name", name);
		}
	};

	this.setOptions = function($options) 
	{
		options = $options;
		loadOptions();
	};

	this.setCurrentValue = function($currentValue)
	{
		currentValue = $currentValue;
		
		if (utils.isset(selector))
			selector.setCurrentValue(currentValue);
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
		{
			displayedOption.getById('input').removeAttribute('disabled');
			
			if (utils.isset(selector))
				selector.removeAttribute('disabled');
		}
		else
		{
			displayedOption.getById('input').setAttribute('disabled', true);
			
			if (utils.isset(selector))
				selector.setAttribute('disabled', true);
		}
	};

	//////////////
	// Héritage //
	//////////////
	
	loadOptions();

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("comboBox");