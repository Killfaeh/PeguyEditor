function CheckBoxList($name, $options, $nbColumns, $isHTML)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var options = $options;
	var nbColumns = $nbColumns;
	var isHTML = $isHTML;
	
	var enable = true;
	
	var html = '<ul class="checkBoxList" ></ul>';
	
	if (nbColumns > 1 && nbColumns < options.length)
	{
		html = '<div class="checkBoxListColumns" >';
		
		for (var i = 0; i < nbColumns; i++)
			html = html + '<ul class="checkBoxList" ></ul>';
		
		html = html + '</div>';
	}
	
	var component = new Component(html);
	
	var inputCheckBoxList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	var loadOptions = function()
	{
		for (var i = 0; i < options.length; i++)
		{
			var option = new InputCheckBox(options[i].name, options[i].label, options[i].checked, isHTML);
			
			option.onChange = function($checked) { $this.onChange($this.getState()); };
			
			if (nbColumns > 1 && nbColumns < options.length)
			{
				var columns = component.getElementsByTagName('ul');
				var num = Math.floor(i/options.length*$nbColumns);
				columns[num].appendChild(option);
			}
			else
				component.appendChild(option);
			
			inputCheckBoxList.push(option);
		}
	};
	
	var unCheckAll = function()
	{
		for (var i = 0; i < inputCheckBoxList.length; i++)
			inputCheckBoxList[i].setChecked(false);
	};
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($value) {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getName = function() { return name; };
	
	this.isChecked = function($name)
	{
		var checked = false;
		
		for (var i = 0; i < inputCheckBoxList.length; i++)
		{
			if (inputCheckBoxList[i].getName() === $name)
			{
				checked = inputCheckBoxList[i].isChecked();
				i = inputCheckBoxList.length;
			}
		}
		
		return checked;
	};
	
	this.getState = function()
	{
		var state = {};
		
		for (var i = 0; i < inputCheckBoxList.length; i++)
			state[inputCheckBoxList[i].getName()] = inputCheckBoxList[i].isChecked();
		
		return state;
	};

	this.getJSON = function() { return $this.getState(); };
	
	// SET
	
	this.setOptions = function($options) 
	{
		options = $options;
		inputCheckBoxList = [];
		
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
	
	this.setChecked = function($name, $checked)
	{
		for (var i = 0; i < inputCheckBoxList.length; i++)
		{
			if (inputCheckBoxList[i].getName() === $name)
			{
				inputCheckBoxList[i].setChecked($checked);
				i = inputCheckBoxList.length;
			}
		}
	};
	
	this.setState = function($state)
	{
		for (var i = 0; i < inputCheckBoxList.length; i++)
			inputCheckBoxList[i].setChecked($state[inputCheckBoxList[i].getName()]);
	};

	this.loadFromJSON = function($json) { $this.setState($json); };
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		for (var i = 0; i < inputCheckBoxList.length; i++)
			inputCheckBoxList[i].setEnable(enable);
	};
	
	loadOptions();
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("checkBoxList");