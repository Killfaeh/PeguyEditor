function Select($name, $options, $currentValue)
{
	//console.log("Current value : " + $currentValue);
	//console.log($options); 
	
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var options = $options;
	var currentValue = $currentValue;
	var currentName = "";
	
	var enable = true;

	var html = '<select id="' + name + '" name="' + name + '" ></select>';
	
	if (/android/.test(navigator.userAgent.toLowerCase()))
		html = '<select class="selectAndroid" id="' + name + '" name="' + name + '" ></select>';

	var component = new Component(html);

	//////////////
	// Méthodes //
	//////////////

	var loadOptions = function()
	{
		var selectedOption = null;
		
		for (var i = 0; i < options.length; i++)
		{
			var option = new Option(options[i].name, options[i].value);
			
			if (currentValue === options[i].value)
			{
				selectedOption = options[i];
				option.setSelected(true);
			}
			
			component.appendChild(option);
		}
		
		if (!utils.isset(selectedOption))
			selectedOption = options[0];
		
		if (utils.isset(selectedOption))
		{
			currentValue = selectedOption.value;
			currentName = selectedOption.name
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onChange = function($value) {};

	component.addEvent('change', function() 
	{
		currentName = component.options[component.selectedIndex].firstChild.nodeValue;
		currentValue = component.value;
		$this.onChange(currentValue);
	});

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getOptions = function() { return options; };
	this.getCurrentValue = function() { return currentValue; };
	this.getCurrentName = function() { return currentName; };
	this.isEnable = function() { return enable; };

	// SET
	this.setName = function($name) 
	{
		name = $name;
		component.set("id", name);
		component.set("name", name);
	};

	this.setOptions = function($options) 
	{
		options = $options;

		component.removeAllChildren();
		loadOptions();
	};

	this.setCurrentValue = function($currentValue)
	{
		currentValue = $currentValue;

		for (var i = 0; i < options.length; i++)
		{
			if (currentValue === options[i].value)
				component.childNodes[i].setSelected(true);
			else 
				component.childNodes[i].setSelected(false);
		}
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
			$this.removeAttribute('disabled');
		else
			$this.setAttribute('disabled', true);
	};

	//////////////
	// Héritage //
	//////////////
	
	loadOptions();

	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("select");