function Textarea($placeholder, $value, $regex)
{
	///////////////
	// Attributs //
	///////////////

	var placeholder = $placeholder;
	var value = $value;

	var html = '<div class="inputText" >'
					+ '<textarea id="input" placeholder="' + dataManager.encodeHTMLEntities(placeholder) + '" >' + dataManager.encodeHTMLEntities(value) + '</textarea>'
					+ '<label for="input" id="mask" class="mask" ></label>'
				+ '</div>';

	var component = new Component(html);

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
	
	this.clear = function() { component.getById('input').innerHTML = ""; };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onFocus = function() {};
	this.onChange = function() {};
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

	//component.getById('input').onchange = function() { $this.onChange(); };
	component.getById('input').onChange = function() { $this.onChange(); };

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
		component.getById('input').innerHTML = value;
	};
	
	this.setReadonly = function($readonly)
	{
		if ($readonly === true)
			component.getById('input').setAttribute('readonly', 'readonly');
		else
			component.getById('input').removeAttribute('readonly');
	};
	
	this.onRemove = function() { Components.removeInputText($this); };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	Components.addInputText($this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("textarea");