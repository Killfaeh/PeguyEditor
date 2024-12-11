function InputText($type, $placeholder, $value, $regex, $replace)
{
	///////////////
	// Attributs //
	///////////////
	
	var type = $type;
	var placeholder = $placeholder;
	var value = $value;
	var readonly = false;
	var regex = $regex;
	var replace = $replace;

	var html = '<div class="inputText" >'
					+ '<input type="' + type + '" id="input" autocomplete="off" placeholder="' + dataManager.encodeHTMLEntities(placeholder) + '" value="' + dataManager.encodeHTMLEntities(value) + '" />'
					+ '<label for="input" id="mask" class="mask" ></label>'
				+ '</div>';

	var component = new Component(html);
	
	if (utils.isset(regex) && regex !== '' && utils.isset(replace))
			component.getById('input').filter(regex, replace);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.focus = function()
	{
		component.getById('mask').style.display = 'none';
	};
	
	this.blur = function()
	{
		component.getById('mask').style.display = 'block';
	};
	
	this.clear = function() { component.getById('input').value = ""; };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onFocus = function() {};
	this.onChange = function($value) {};
	this.onBlur = function() {};
	
	component.getById('input').onfocus = function()
	{
		Components.focusAllInputText();
		$this.onFocus();
	};
	
	component.getById('input').onblur = function()
	{
		Components.blurAllInputText();
		$this.onBlur();
	};
	
	//component.getById('input').onchange = function() { $this.onChange(component.getById('input').value); };
	
	component.getById('input').onChange = function()
	{
		if (utils.isset(regex) && regex !== '' && utils.isset(replace))
			component.getById('input').filter(regex, replace);
		
		$this.onChange(component.getById('input').value);
	};
	
	component.getById('input').addEvent('keyup', function($event)
	{
		Events.onTipText($event, function()
		{
			if (utils.isset(regex) && regex !== '' && utils.isset(replace))
				component.getById('input').filter(regex, replace);
			
			$this.onChange(component.getById('input').value);
		});
	});
	
	this.onRemove = function() { Components.removeInputText($this); };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getType = function() { return type; };
	this.getPlaceholder = function() { return placeholder; };
	this.getValue = function() { return component.getById('input').value; };

	// SET
	
	this.setType = function($type)
	{
		type = $type;
		component.getById('input').setAttribute('type', type);
	};
	
	this.setPlaceholder = function($placeholder)
	{
		placeholder = $placeholder;
		component.getById('input').setAttribute('placeholder', placeholder);
	};
	
	
	this.setValue = function($value)
	{
		value = $value;
		component.getById('input').value = value;
		
		if (utils.isset(regex) && regex !== '' && utils.isset(replace))
			component.getById('input').filter(regex, replace);
	};
	
	this.setReadonly = function($readonly)
	{
		readonly = $readonly;
		
		if (readonly === true)
			component.getById('input').setAttribute('readonly', 'readonly');
		else
			component.getById('input').removeAttribute('readonly');
	};
	
	this.setRegex = function($regex) { regex = $regex; };
	this.setReplace = function($replace) { replace = $replace; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Components.addInputText($this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputText");