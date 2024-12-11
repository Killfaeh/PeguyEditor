function InputNumber($placeholder, $value)
{
	///////////////
	// Attributs //
	///////////////
	
	var placeholder = $placeholder;
	var value = $value;
	var readonly = false;

	var html = '<div class="inputText" >'
					+ '<input type="text" id="input" autocomplete="off" placeholder="' + dataManager.encodeHTMLEntities(placeholder) + '" value="' + dataManager.encodeHTMLEntities(value) + '" />'
					+ '<label for="input" id="mask" class="mask" ></label>'
				+ '</div>';

	var component = new Component(html);
	
	component.getById('input').filterNumber();
	
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
		component.getById('input').filterNumber();
		$this.onChange(component.getById('input').value);
	};
	
	component.getById('input').addEvent('keyup', function($event)
	{
		Events.onTipText($event, function()
		{
			component.getById('input').filterNumber();
			$this.onChange(component.getById('input').value);
		});
	});
	
	this.onRemove = function() { Components.removeInputText($this); };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getPlaceholder = function() { return placeholder; };
	this.getValue = function() { return component.getById('input').value; };

	// SET
	
	this.setPlaceholder = function($placeholder)
	{
		placeholder = $placeholder;
		component.getById('input').setAttribute('placeholder', placeholder);
	};
	
	
	this.setValue = function($value)
	{
		value = $value;
		component.getById('input').value = value;
		component.getById('input').filterNumber();
	};
	
	this.setReadonly = function($readonly)
	{
		readonly = $readonly;
		
		if (readonly === true)
			component.getById('input').setAttribute('readonly', 'readonly');
		else
			component.getById('input').removeAttribute('readonly');
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Components.addInputText($this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputNumber");