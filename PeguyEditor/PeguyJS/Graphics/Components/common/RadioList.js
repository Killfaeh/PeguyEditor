function RadioList($name, $options, $currentValue, $nbColumns, $isHTML)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var options = $options;
	var currentValue = $currentValue;
	var selectedOption = null;
	var nbColumns = $nbColumns;
	var isHTML = $isHTML;
	
	var enable = true;
	
	var html = '<ul class="radioList" ></ul>';
	
	if (nbColumns > 1 && nbColumns < options.length)
	{
		html = '<div class="radioListColumns" >';
		
		for (var i = 0; i < nbColumns; i++)
			html = html + '<ul class="radioList" ></ul>';
		
		html = html + '</div>';
	}
	
	var component = new Component(html);
    
    var inputRadioList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	var loadOptions = function()
	{
		for (var i = 0; i < options.length; i++)
		{
			var option = new InputRadio(name, options[i].label, options[i].value, false, isHTML);
			
			if (currentValue === options[i].value)
			{
				selectedOption = option;
				option.setSelected(true);
			}
			
			option.onSelect = function($value)
			{
				currentValue = $value;
				selectedOption = this;
				$this.onChange(currentValue);
			};
			
			if (nbColumns > 1 && nbColumns < options.length)
			{
				var columns = component.getElementsByTagName('ul');
				var num = Math.floor(i/options.length*$nbColumns);
				columns[num].appendChild(option);
			}
			else
				component.appendChild(option);
            
            inputRadioList.push(option);
		}
	};
	
	var unSelectAll = function()
	{
		for (var i = 0; i < inputRadioList.length; i++)
			inputRadioList[i].setSelected(false);
		
		selectedOption = null;
		currentValue = null;
	};
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($value) {};
	
	this.onKeyDown = function($event)
	{
		if (enable === true)
		{
			var index = -1;
			var newIndex = 0;
			
			if (utils.isset(selectedOption))
				index = Array.prototype.indexOf.call(inputRadioList, selectedOption);
			
			if ($event.keyCode === 38)
			{
				if (index <= 0)
					newIndex = inputRadioList.length-1;
				else
					newIndex = index - 1;
			}
			else if ($event.keyCode === 40)
			{
				if (index < 0 || index >= inputRadioList.length-1)
					newIndex = 0;
				else
					newIndex = index + 1;
			}
			
			unSelectAll();
			
			var newOption = inputRadioList[newIndex];
			
			if (utils.isset(newOption))
				newOption.setSelected(true);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getName = function() { return name; };
	this.getCurrentValue = function() { return currentValue; };
	
	// SET
	
	this.setOptions = function($options) 
	{
		options = $options;
		
        inputRadioList = [];
        
        if (nbColumns > 1 && nbColumns < options.length)
        {
            var columns = component.getElementsByTagName('ul');
            
            for (var i = 0; i < columns.length; i++)
                columns[i].removeAllChildren();
        }
        else
            component.removeAllChildren();
        
		loadOptions();
	};
	
	this.setCurrentValue = function($currentValue)
	{
		currentValue = $currentValue;
		
		for (var i = 0; i < inputRadioList.length; i++)
		{
			if (inputRadioList[i].getValue() === currentValue)
			{
				inputRadioList[i].setSelected(true);
				selectedOption = inputRadioList[i];
				i = inputRadioList.length;
			}
		}
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		for (var i = 0; i < inputRadioList.length; i++)
			inputRadioList[i].setEnable(enable);
	};
	
	loadOptions();
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("radioList");