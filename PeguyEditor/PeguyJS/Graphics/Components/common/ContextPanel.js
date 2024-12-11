function ContextPanel($content)
{
	///////////////
	// Attributs //
	///////////////

	var content = $content;
	var mouseX = 0;
	var mouseY = 0;

	var html = '<div class="contextPanel" >'
					+ '<div id="content-panel" class="content-panel" >' + content + '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var elementsList = [];
	
	//////////////
	// Méthodes //
	//////////////

	this.update = function()
	{
		component.getById('content-panel').style.left = mouseX + 'px';
		component.getById('content-panel').style.top = mouseY + 'px';
		component.getById('content-panel').setStyle("right", "unset");
		component.getById('content-panel').setStyle("bottom", "unset");
		component.getById('content-panel').setStyle("width", "unset");
		component.getById('content-panel').setStyle("height", "unset");
		
		// Gérer le cas où la liste sort de l'écran
		var panelWidth = component.getById('content-panel').offsetWidth;
		var panelHeight = component.getById('content-panel').offsetHeight;
		var panelPosition = component.getById('content-panel').position();
		
		/*
		console.log(panelPosition);
		console.log("Panel height : " + panelHeight);
		console.log("Screen height : " + Screen.getHeight());
		//*/
		
		/*
		if (panelHeight > Screen.getHeight())
		{
			component.getById('content-panel').setStyle("height", (Screen.getHeight()-20) + "px");
			component.getById('content-panel').setStyle("top", "10px");
			component.getById('content-panel').setStyle("overflow", "auto");
		}
		else if (panelPosition.y + panelHeight > Screen.getHeight())
		{
			component.getById('content-panel').setStyle("top", "unset");
			component.getById('content-panel').setStyle("bottom", "10px");
		}
		else
		{
			component.getById('content-panel').setStyle("height", "unset");
			component.getById('content-panel').setStyle("top", panelPosition.y + "px");
			component.getById('content-panel').setStyle("bottom", "unset");
			component.getById('content-panel').setStyle("overflow", "unset");
		}
		//*/
		
		if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
		{
			if (panelHeight > Screen.getHeight())
			{
				component.getById('content-panel').setStyle("height", (Screen.getHeight()-20) + "px");
				component.getById('content-panel').setStyle("top", "10px");
			}
			
			if (panelWidth > Screen.getWidth())
			{
				component.getById('content-panel').setStyle("width", (Screen.getWidth()-20) + "px");
				component.getById('content-panel').setStyle("left", "10px");
			}
			
			component.getById('content-panel').setStyle("overflow", "auto");
		}
		else
			component.getById('content-panel').setStyle("overflow", "unset");
		
		if (panelHeight <= Screen.getHeight())
		{
			if (panelPosition.y + panelHeight > Screen.getHeight())
			{
				component.getById('content-panel').setStyle("top", "unset");
				component.getById('content-panel').setStyle("bottom", "10px");
			}
			else
			{
				component.getById('content-panel').setStyle("height", "unset");
				component.getById('content-panel').setStyle("top", panelPosition.y + "px");
				component.getById('content-panel').setStyle("bottom", "unset");
			}
		}
		
		if (panelWidth <= Screen.getWidth())
		{
			if (panelPosition.x + panelWidth > Screen.getWidth())
			{
				component.getById('content-panel').setStyle("left", "unset");
				component.getById('content-panel').setStyle("right", "10px");
			}
			else
			{
				component.getById('content-panel').setStyle("width", "unset");
				component.getById('content-panel').setStyle("left", panelPosition.x + "px");
				component.getById('content-panel').setStyle("right", "unset");
			}
		}
	};
	
	this.close = function()
	{
		if (utils.isset($this.parentNode))
		{
			$this.parentNode.removeChild($this);
			$this.onClose();
		}
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onClose = function() {};
	this.onClick = function() { $this.close(); };
	
	component.getById('content-panel').onClick = function() {};
	
	this.onContextMenu = function($event)
	{
		Events.preventDefault($event);
		$this.close();
	};
	
	component.getById('content-panel').onContextMenu = function() {};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getContentPanel = function() { return component.getById('content-panel'); };
	
	// SET
	
	this.setPosition = function($x, $y)
	{
		mouseX = $x;
		mouseY = $y;
		
		//component.getById('content-panel').style.left = mouseX + 'px';
		//component.getById('content-panel').style.top = mouseY + 'px';
		
		$this.update();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	
	//document.getElementById('main').appendChild($this);
	//component.getById('content-panel').style.left = mouseX + 'px';
	//component.getById('content-panel').style.top = mouseY + 'px';
	//$this.update();
	
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("contextPanel");