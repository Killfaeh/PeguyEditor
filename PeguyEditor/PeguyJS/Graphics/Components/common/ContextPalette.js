function ContextPalette($mouseX, $mouseY, $colorsList)
{
	///////////////
	// Attributs //
	///////////////

	var mouseX = $mouseX;
	var mouseY = $mouseY;
	var colorsList = $colorsList;

	var html = '<div class="contextPalette" >'
					+ '<ul id="children-list" class="root-children-list" >'
					+ '</ul>'
				+ '</div>';
				
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////

	this.update = function()
	{
		$this.getById("children-list").removeAllChildren();
		
		var nbColumns = Math.ceil(Math.sqrt(colorsList.length));
		var nbRows = Math.ceil(colorsList.length/nbColumns);
		
		console.log("NB columns : " + nbColumns);
		
		for (var i = 0; i < colorsList.length; i++)
		{
			var colorHTML = '<li colorValue="' + colorsList[i] + '" >'
								+ '<span style="color: ' + colorsList[i] + '; background-color: ' + colorsList[i] + '; " >col</span>'
							+ '</li>';
			
			var colorComponent = new Component(colorHTML);
			$this.getById("children-list").appendChild(colorComponent);
			
			colorComponent.onClick = function()
			{
				var colorValue = this.getAttribute('colorValue');
				$this.onAction(colorValue);
				document.getElementById('main').removeChild($this);
			};
			
			if (i > 0 && i%nbColumns === (nbColumns-1))
				$this.getById("children-list").appendChild(utils.createBR());
		}
		
		// Gérer le cas où la liste sort de l'écran
		var panelWidth = component.getById('children-list').offsetWidth;
		var panelHeight = component.getById('children-list').offsetHeight;
		var panelPosition = component.getById('children-list').position();
		
		/*
		console.log(panelPosition);
		console.log("Panel height : " + panelHeight);
		console.log("Screen height : " + Screen.getHeight());
		//*/
		
		/*
		if (panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
			component.getById('children-list').setStyle("top", "10px");
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else if (panelPosition.y + panelHeight > Screen.getHeight())
		{
			component.getById('children-list').setStyle("top", "unset");
			component.getById('children-list').setStyle("bottom", "10px");
		}
		else
		{
			component.getById('children-list').setStyle("height", "unset");
			component.getById('children-list').setStyle("top", panelPosition.y + "px");
			component.getById('children-list').setStyle("bottom", "unset");
			component.getById('children-list').setStyle("overflow", "unset");
		}
		//*/
		
		if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
		{
			if (panelHeight > Screen.getHeight())
			{
				component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
				component.getById('children-list').setStyle("top", "10px");
			}
			
			if (panelWidth > Screen.getWidth())
			{
				component.getById('children-list').setStyle("width", (Screen.getWidth()-20) + "px");
				component.getById('children-list').setStyle("left", "10px");
			}
			
			component.getById('children-list').setStyle("overflow", "auto");
		}
		else
			component.getById('children-list').setStyle("overflow", "unset");
		
		if (panelHeight <= Screen.getHeight())
		{
			if (panelPosition.y + panelHeight > Screen.getHeight())
			{
				component.getById('children-list').setStyle("top", "unset");
				component.getById('children-list').setStyle("bottom", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("height", "unset");
				component.getById('children-list').setStyle("top", panelPosition.y + "px");
				component.getById('children-list').setStyle("bottom", "unset");
			}
		}
		
		if (panelWidth <= Screen.getWidth())
		{
			if (panelPosition.x + panelWidth > Screen.getWidth())
			{
				component.getById('children-list').setStyle("left", "unset");
				component.getById('children-list').setStyle("right", "10px");
			}
			else
			{
				component.getById('children-list').setStyle("width", "unset");
				component.getById('children-list').setStyle("left", panelPosition.x + "px");
				component.getById('children-list').setStyle("right", "unset");
			}
		}
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onCancel = function() {};
	this.onAction = function($color) {};

	this.onClick = function()
	{
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
		
		$this.onCancel();
	};
	
	component.getById('children-list').onClick = function() {};
	
	this.onContextMenu = function($event)
	{
		Events.preventDefault($event);
		
		if (utils.isset($this.parentNode))
			document.getElementById('main').removeChild($this);
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getColorsList = function() { return colorsList; };
	this.getListNode = function() { return component.getById('root-children-list'); };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	
	document.getElementById('main').appendChild($this);
	component.getById('children-list').style.left = mouseX + 'px';
	component.getById('children-list').style.top = mouseY + 'px';
	$this.update();
	
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("contextPalette");