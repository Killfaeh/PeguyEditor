function ComboBox($name, $options, $currentValue, $freeOption, $autoResize)
{
	///////////////
	// Attributs //
	///////////////

	var name = $name;
	var options = $options;
	var currentValue = $currentValue;
	var currentIndex = 0;
	var freeOption = $freeOption;
	var autoResize = $autoResize;
	
	if (!utils.isset(name))
		name = '';
	
	if (!utils.isset(options))
		options = [];
	
	if (!utils.isset(currentValue))
		currentValue = '';
	
	if (!utils.isset(freeOption))
		freeOption = false;
	
	if (freeOption === true)
		options.push({ name: KEYWORDS.otherChoice, value: '{{[[*]]}}', color: null });
	
	var enable = true;
	var open = false;
	var enlighted = null;

	var html = '<div class="select" >'
					+ '<div><input type="text" id="selected" class="selected" readonly="readonly" /><span id="icon" class="icon" ><div class="wall" ></div></span></div>'
					+ '<div id="invisibleFreezeScreen" class="invisibleFreezeScreen" ></div>'
					+ '<div id="panel" class="panel selectPanel" >'
						+ '<ul id="list" ></ul>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);

	var icon = Loader.getSVG('icons', 'sort-icon', 17, 17);
	component.getById('icon').appendChild(icon);
	
	//component.getById('invisibleFreezeScreen').style.display = "none";
	
	//var invisibleFreezeScreen = component.getById('invisibleFreezeScreen');
	var invisibleFreezeScreen = new InvisibleFreezeScreen();
	component.getById('invisibleFreezeScreen').appendChild(invisibleFreezeScreen);
	var panel = component.getById('panel');
	var list = component.getById('list');

	panel.style.display = 'none';

	//////////////
	// Méthodes //
	//////////////

	var loadOptions = function()
	{
		for (var i = 0; i < options.length; i++)
		{
			var option = new ComboBoxItem(options[i].name, options[i].value, options[i].color);
			option.set('index', i);
			
			option.onClick = function()
			{
				var index = this.get('index');
				$this.select(index);
				this.style.backgroundColor = 'none';
			};
			
			option.onMouseOver = function()
			{
				var index = parseInt(this.get('index'));
				$this.enlight(index);
			};
			
			if (currentValue === options[i].value)
			{
				option.setSelected(true);
				component.getById('selected').value = options[i].name;
				enlighted = i;
				currentIndex = i;
			}
			
			list.appendChild(option);
		}
		
		//if (freeOption === true)
		//	component.getById('selected').removeAttribute('readonly');
		
		if (utils.isset(currentIndex) && currentIndex !== "" && currentIndex >= 0 && utils.isset(options[currentIndex]))
			component.getById('selected').value = options[currentIndex].name;
		else
		{
			enlighted = null;
			currentIndex = null;
		}
		
		if (!utils.isset(currentValue) || currentValue === "")
			currentValue = options[0].value;
			
		setTimeout(function()
		{
			var width = component.getById('selected').offsetWidth;
			//panel.style.width = width + "px;"
			panel.style.minWidth = width + "px;"
		}, 20);
	};
	
	this.select = function($index)
	{
		currentIndex = $index;
		currentValue = options[currentIndex].value;
		
		if (currentValue === '{{[[*]]}}')
		{
			component.getById('selected').removeAttribute('readonly');
			component.getById('selected').value = '';
			component.getById('selected').focus();
		}
		else
		{
			component.getById('selected').setAttribute('readonly', 'readonly');
			component.getById('selected').value = options[currentIndex].name;
		}
		
		$this.close();
		$this.onChange(currentValue);
	};
	
	this.enlight = function($index)
	{
		if (options.length > 0 && utils.isset($index) && $index >= 0)
		{
			var rows = list.getElementsByTagName('li');
			var row = null;
			
			for (var i = 0; i < rows.length; i++)
			{
				var index = parseInt(rows[i].get('index'));
				
				if (parseInt($index) === index)
				{
					rows[i].addClass('selected');
					enlighted = index;
					row = rows[i];
				}
				else
					rows[i].removeClass('selected');
			}
		}
	};
	
	//// Gestion de l'affichage du panneau de sélection. ////
	
	var resize = function()
	{
		//var componentPosition = $this.position();
		var componentPosition = component.getById('selected').position();
		var componentWidth = component.getById('selected').offsetWidth;
		var panelWidth = panel.offsetWidth;
		var panelHeight = panel.offsetHeight;
		var panelPosition = panel.position();
		
		invisibleFreezeScreen.resize(component.getById('selected'));
		
		panel.style.zIndex = "10000000000";
		panel.style.minWidth = component.getById('selected').offsetWidth + "px";
		panel.style.left = componentPosition.x + 'px';
		panel.style.top = (componentPosition.y+component.getById('selected').offsetHeight) + 'px';
		
		if (panelHeight > Screen.getHeight())
		{
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.height = (Screen.getHeight()-20) + "px";
			panel.style.top = "7px";
			panel.style.overflow = "auto";
		}
		else if (componentPosition.y + component.getById('selected').offsetHeight + panelHeight > Screen.getHeight())
		{
			var delta = componentPosition.y + component.getById('selected').offsetHeight + panelHeight - Screen.getHeight() - 25;
			panel.style.left = (componentPosition.x + component.offsetWidth - panelWidth - 27) + 'px';
			panel.style.top = (componentPosition.y-delta) + "px";
		}
	};
	
	this.autoResize = function()
	{
		$this.open();
		
		var maxSize = $this.getPanel().offsetWidth;
		
		if (utils.isset(autoResize) && autoResize > 0)
		{
			if (maxSize <= 0)
				setTimeout(function() { $this.autoResize(); }, autoResize);
			else
			{
				$this.getById('selected').style.width = maxSize + 'px';
				$this.getById('selected').style.minWidth = maxSize + 'px';
			}
		}
		else
		{
			$this.getById('selected').style.width = maxSize + 'px';
			$this.getById('selected').style.minWidth = maxSize + 'px';
		}
		
		$this.close();
	};
	
	this.onOpen = function() {};
	
	this.open = function()
	{
		if (enable === true)
		{
			$this.onOpen();
			$this.enlight(currentIndex);
			
			invisibleFreezeScreen.display(component.getById('selected'));
			document.getElementById('main').appendChild(invisibleFreezeScreen);
			panel.style.display = "block";
			document.getElementById('main').appendChild(panel);
			
			resize();

			open = true;
		}
	};
	
	this.onClose = function() {};
	
	this.close = function()
	{
		$this.onClose();
		
		if (utils.isset(panel.parentNode))
			panel.parentNode.removeChild(panel);
		
		panel.removeAttribute('style');
		panel.style.display = "none";
		invisibleFreezeScreen.hide();
		open = false;
	};
	
	this.onRemove = function()
	{
		/*
		var index = document.getElementById('main').onClick.indexOf(this.close);
		
		if (index >= 0)
			document.getElementById('main').onClick.splice(index, 1);
		//*/
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	component.getById('selected').onClick = function($event)
	{
		if (freeOption === false || currentValue !== '{{[[*]]}}')
			Events.preventDefault($event);
		
		if (panel.style.display === 'block')
			$this.close();
		else
		{
			if (enable === true)
				$this.open();
		}
	};
	
	//component.getById('selected').addEvent('keyup', function($event) { Events.onTipText($event, function() { $this.onchange(component.getById('selected').value); }); });
	component.getById('selected').addEvent('keyup', function($event) { Events.onTipText($event, function() { $this.onChange(component.getById('selected').value); }); });
	
	component.getById('icon').onClick = function()
	{
		if (panel.style.display === 'block')
			$this.close();
		else
		{
			if (enable === true)
				$this.open();
		}
	};

	this.onChange = function($value) {};
	
	// Ces 2 lignes empêchent le rechargement de la page de l'application lorsqu'on tape entrer avec le focus dans le champ de saisie
	component.getById('selected').addEvent('keydown', function($event)
	{
		if ($event.keyCode === 13)
			Events.preventDefault($event);
	});
	
	component.getById('selected').addEvent('keyup', function($event)
	{
		if ($event.keyCode === 13)
			Events.preventDefault($event);
	});
	
	this.onKeyDown = function($event)
	{
		if (enable === true && open === true)
		{
			if ($event.keyCode === 13)
				$this.select(enlighted);
			else if ($event.keyCode === 27)
				$this.close();
			else if ($event.keyCode === 38)
			{
				if (utils.isset(enlighted))
				{
					enlighted--;
				
					if (enlighted < 0)
						enlighted = options.length-1;
				}
				else
					enlighted = options.length-1;

				$this.enlight(enlighted);
			}
			else if ($event.keyCode === 40)
			{
				if (utils.isset(enlighted))
				{
					enlighted++;
					
					if (enlighted >= options.length)
						enlighted = 0;
				}
				else
					enlighted = 0;
				
				$this.enlight(enlighted);
			}
		}
	};
	
	this.onResize = function()
	{
		if (open === true)
			resize();
	};
	
	component.onClick = function() {}; // Pour empêcher la fermeture quand on clique en dehors des boutons
	//document.getElementById('main').onClick.push(this.close);
	
	invisibleFreezeScreen.onClick = function() { $this.close(); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getOptions = function() { return options; };
	
	this.getCurrentValue = function()
	{
		var valueToReturn = currentValue;
		
		if (currentValue === '{{[[*]]}}')
			valueToReturn = component.getById('selected').value;
		
		return valueToReturn;
	};
	
	this.getDisplayedValue = function() { return component.getById('selected').value; };
	
	this.getPanel = function() { return panel; };
	
	this.isOpen = function() { return open; };
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

		list.removeAllChildren();
		loadOptions();
	};

	this.setCurrentValue = function($currentValue)
	{
		currentValue = $currentValue;

		for (var i = 0; i < options.length; i++)
		{
			if (currentValue + "" === options[i].value + "")
			{
				list.childNodes[i].setSelected(true);
				component.getById('selected').value = options[i].name;
				currentIndex = i;
			}
			else 
				list.childNodes[i].setSelected(false);
		}
	};
	
	this.setEnable = function($enable)
	{
		enable = $enable;

		if (enable === true)
			component.getById('selected').removeAttribute('disabled');
		else
			component.getById('selected').setAttribute('disabled', true);
	};

	//////////////
	// Héritage //
	//////////////
	
	loadOptions();

	var $this = utils.extend(component, this);
	
	if (utils.isset(autoResize) && autoResize > 0)
		setTimeout(function() { $this.autoResize(); }, autoResize);
	
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("comboBox");