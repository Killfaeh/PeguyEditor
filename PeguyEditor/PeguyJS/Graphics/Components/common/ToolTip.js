function ToolTip($callElement, $label)
{
	///////////////
	// Attributs //
	///////////////

	var callElement = $callElement;
	
	if (utils.isset(callElement.toolTipOpen))
		return null;
	
	var label = $label;

	var html = '<div class="toolTip" >' + label + '</div>';
				
	var component = new Component(html);
	
	// Gestion de l'animation
	var opacity = 1.0;
	var stepOpacity = 0.0;
	var fadeOutAnimation = null;
	
	//////////////
	// Méthodes //
	//////////////

	this.update = function($mouseX, $mouseY)
	{
		var callElementPosition = callElement.position();
		var positionX = callElementPosition.x + callElement.offsetWidth/2;
		var positionY = callElementPosition.y + callElement.offsetHeight;
		
		if (SVGTAGS.indexOf(callElement.tagName) >= 0)
		{
			positionX = $mouseX + 10;
			positionY = $mouseY + 10;
		}
		
		component.style.left = positionX + 'px';
		component.style.top = positionY + 'px';
		
		// Gérer le cas où la liste sort de l'écran
		var panelWidth = component.offsetWidth;
		var panelHeight = component.offsetHeight;
		var panelPosition = component.position();
		
		//console.log(panelPosition);
		//console.log("Panel height : " + panelHeight);
		//console.log("Panel width : " + panelWidth + ' ' + (panelPosition.x + panelWidth));
		//console.log("Screen height : " + Screen.getHeight());
		//console.log("Screen width : " + Screen.getWidth());
		
		if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
		{
			if (panelHeight > Screen.getHeight())
			{
				component.setStyle("height", (Screen.getHeight()-20) + "px");
				component.setStyle("top", "10px");
			}
			
			if (panelWidth > Screen.getWidth())
			{
				component.setStyle("width", (Screen.getWidth()-20) + "px");
				component.setStyle("left", "10px");
			}
			
			component.setStyle("overflow", "auto");
		}
		else
			component.setStyle("overflow", "unset");
		
		if (panelHeight <= Screen.getHeight())
		{
			if (panelPosition.y + panelHeight > Screen.getHeight())
			{
				component.setStyle("top", "unset");
				component.setStyle("bottom", "10px");
			}
			else
			{
				component.setStyle("height", "unset");
				component.setStyle("top", panelPosition.y + "px");
				component.setStyle("bottom", "unset");
			}
		}
		
		if (panelWidth <= Screen.getWidth())
		{
			if (panelPosition.x + panelWidth > Screen.getWidth())
			{
				component.setStyle("left", "unset");
				component.setStyle("right", "10px");
			}
			else
			{
				component.setStyle("width", "unset");
				component.setStyle("left", panelPosition.x + "px");
				component.setStyle("right", "unset");
			}
		}
	};
	
	this.close = function()
	{
		document.getElementById('main').removeChild($this);
	};

	var fadeOut = function()
	{
		opacity = opacity + stepOpacity;
		
		if (opacity > 1.0)
		{
			opacity = 1.0;
			stepOpacity = 0.0;
			clearTimeout(fadeOutAnimation);
			fadeOutAnimation = null;
		}
		else if (opacity < 0.0)
			$this.endFadeOut();
		
		$this.style.opacity = opacity;
	};

	this.startFadeOut = function()
	{
		if (!utils.isset(fadeOutAnimation))
		{
			stepOpacity = -0.05;
			fadeOutAnimation = setInterval(function() { fadeOut(); }, 40);
		}
	};
	
	this.endFadeOut = function()
	{
		opacity = 0.0;
		stepOpacity = 0.0;
		
		if (utils.isset(fadeOutAnimation))
			clearTimeout(fadeOutAnimation);
			
		Components.removeToolTip($this);
		fadeOutAnimation = null;
		
		callElement.toolTipOpen = null;
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	document.getElementById('main').appendChild($this);
	callElement.toolTipOpen = $this;
	Components.addToolTip($this);
	
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("toolTip");