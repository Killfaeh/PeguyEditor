function InputNumber($placeholder, $value)
{
	///////////////
	// Attributs //
	///////////////
	
	var placeholder = $placeholder;
	var value = $value;
	var readonly = false;
	
	var html = '<input type="text" id="input" autocomplete="off" placeholder="' + dataManager.encodeHTMLEntities(placeholder) + '" value="' + dataManager.encodeHTMLEntities(value) + '" />';

	var component = new Component(html);
	
	component.filterNumber();
	
	//////////////
	// Méthodes //
	//////////////
	
	this.clear = function() { component.value = ""; };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onFocus = function() {};
	this.onChange = function($value) {};
	this.onBlur = function() {};
	
	component.onfocus = function() { $this.onFocus(); };
	component.onblur = function() { $this.onBlur(); };
	
	//component.onchange = function() { $this.onChange(component.getById('input').value); };
	
	component.onChange = function()
	{
		component.filterNumber();
		$this.onChange(component.value);
	};
	
	component.addEvent('keyup', function($event)
	{
		Events.onTipText($event, function()
		{
			component.filterNumber();
			$this.onChange(component.value);
		});
	});
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getPlaceholder = function() { return placeholder; };
	this.getValue = function() { return component.value; };

	// SET
	
	this.setPlaceholder = function($placeholder)
	{
		placeholder = $placeholder;
		component.setAttribute('placeholder', placeholder);
	};
	
	
	this.setValue = function($value)
	{
		value = $value;
		component.value = value;
		component.filterNumber();
	};
	
	this.setReadonly = function($readonly)
	{
		readonly = $readonly;
		
		if (readonly === true)
			component.setAttribute('readonly', 'readonly');
		else
			component.removeAttribute('readonly');
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputNumber");