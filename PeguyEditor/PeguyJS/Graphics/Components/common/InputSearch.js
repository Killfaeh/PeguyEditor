function InputSearch($type, $placeholder)
{
	///////////////
	// Attributs //
	///////////////
	
	var type = "text";

	if (utils.isset($type) && $type !== '')
		type = $type;
	
	var placeholder = $placeholder;
	
	var html = '<div id="search" class="search" >'
					+ '<div class="searchInner" >'
						+ '<span id="searchIcon" class="searchIcon" ><div class="wall" ></div></span>'
						+ '<span id="emptyIcon" class="emptyIcon" style="display: none;" ><div class="wall" ></div></span>'
						+ '<input id="input" type="' + type + '" autocomplete="off" />'
						+ '<div class="wall" ></div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	component.getById('searchIcon').appendChild(Loader.getSVG('icons', 'magnifying-glass-icon', 20, 20));
	component.getById('emptyIcon').appendChild(Loader.getSVG('icons', 'black-close-icon', 15, 15));
	
	if (utils.isset(placeholder))
		component.getById('input').setAttribute('placeholder', placeholder);
	
	var searchDate = new Date();
	var freeze = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	var update = function()
	{
		var value = $this.getValue();
		
		if (utils.isset(value) && value !== '')
		{
			component.getById('searchIcon').style.display = 'none';
			component.getById('emptyIcon').style.display = 'block';
		}
		else
		{
			component.getById('searchIcon').style.display = 'block';
			component.getById('emptyIcon').style.display = 'none';
		}
	};
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onSearch = function($value) {};
	
	var freezeOnDown = false;
	
	component.getById('input').addEvent('keydown', function($event)
	{
		if (freeze === true)
			freezeOnDown = true;
		else
			freezeOnDown = false;
		
		if (freeze === true || $event.keyCode === 38 || $event.keyCode === 40)
			Events.preventDefault($event);
	});
	
	component.getById('input').addEvent('keyup', function($event)
	{
		if (freeze === true || freezeOnDown === true)
			Events.preventDefault($event);
		else
		{
			if ($event.keyCode === 38 || $event.keyCode === 40)
				Events.preventDefault($event);
			
			Events.onTipText($event, function()
			{
				update();
				searchDate = new Date();
				$this.onSearch($this.getValue());
			});
		}
	});
	
	this.onEmpty = function() {};
	
	component.getById('emptyIcon').onClick = function()
	{
		$this.setValue('');
		update();
		$this.onEmpty();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getType = function() { return type; };
	this.getPlaceholder = function() { return placeholder; };
	this.getValue = function() { return component.getById('input').value; };
	this.getSearchDate = function() { return searchDate; };
	this.isFreeze = function() { return freeze; };
	
	// SET
	
	this.setType = function($type)
	{
		var type = $type;
		
		if (!utils.isset(type) && $type !== '')
			type = 'text';
		
		component.getById('input').setAttribute('type', type);
	};
	
	this.setPlaceholder = function($placeholder)
	{
		var placeholder = $placeholder;
		
		if (utils.isset(placeholder) && placeholder !== '')
			component.getById('input').setAttribute('placeholder', placeholder);
		else
			component.getById('input').removeAttribute('placeholder');
	};
	
	this.setValue = function($value) { component.getById('input').value = $value; };
	this.setFreeze = function($freeze) { freeze = $freeze; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputSearch");