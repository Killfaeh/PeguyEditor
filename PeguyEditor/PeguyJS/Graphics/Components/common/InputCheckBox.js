function InputCheckBox($name, $label, $checked, $isHTML)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var label = $label;
	//var checked = $checked;
	var isHTML = $isHTML;
	
	var labelToDisplay = dataManager.encodeHTMLEntities(label);
	
	if (isHTML === true)
		labelToDisplay = label;
	
	var enable = true;
	
	var html = '<li class="inputCheckBox" ><label id="label" >' + labelToDisplay + '</label></li>';
	
	var component = new Component(html);
	
	var checkBox = new CheckBox($checked, 18);
	component.insertAt(checkBox, 0);
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($checked) {};
	
	var onChange = function()
	{
		if (enable === true)
		{
			if (checkBox.isChecked() === true)
				checkBox.setChecked(false);
			else
				checkBox.setChecked(true);
			
			$this.onChange(checkBox.isChecked());
		}
	};
	
	component.getById('label').onClick = function() { onChange(); };
	component.onClick = function() { onChange(); };
	checkBox.onChange = function() { $this.onChange(checkBox.isChecked()); };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getName = function() { return name; };
	this.getLabel = function() { return label; };
	this.isChecked = function() { return checkBox.isChecked(); };
	this.isEnable = function() { return enable; };
	
	// SET
	
	this.setLabel = function($label)
	{
		var label = $label;
		component.getById('label').removeAllChildren();
		component.getById('label').appendChild(utils.createText(label));
	};
	
	this.setChecked = function($checked)
	{
		checkBox.setChecked($checked);
		$this.onChange();
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;
		
		if (enable === true)
			checkBox.setReadonly(false);
		else
			checkBox.setReadonly(true);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputCheckBox");