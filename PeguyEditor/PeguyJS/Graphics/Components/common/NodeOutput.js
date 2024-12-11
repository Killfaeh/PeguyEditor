function NodeOutput($name, $label, $type, $defaultValue)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var label = $label;
	var type = $type;
	var defaultValue = $defaultValue;
	var value = defaultValue;
	var parent = null;
	var twin = null;
	
	var html = '<li class="nodeOutput" >'
					+ '<div id="label" class="nodeOutputLabel" >' + label + '</div>'
					+ '<div id="connector" class="connector" ></div>'
					+ '<div class="wall" ></div>'
				+ '</li>';
	
	var component = new Component(html);
	
	var linksList = [];
	
	// Drag & drop
	var dragging = false;
	var tmpLink = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	var onReleaseOnInput = function($input)
	{
		if (dragging === true)
		{
			var oldLink = $input.getLink();
			
			if (utils.isset(oldLink))
				oldLink.getParent().removeLink(oldLink);
			
			$this.addLink(tmpLink);
			$input.setLink(tmpLink);
			$input.updateLink();
		}
		
		dragging = false;
		tmpLink = null;
	};
	
	var onReleaseOnOutput = function($output)
	{
		if (dragging === true)
		{
			parent.getParent().removeLink(tmpLink);
			$this.removeLink(tmpLink);
			$this.updateLinks();
		}
		
		dragging = false;
		tmpLink = null;
	};
	
	//// Gestion des liens ////
	
	this.addLink = function($link)
	{
		var index = linksList.indexOf($link);
		
		if (index < 0)
			linksList.push($link);
		
		$link.setParent($this);
	};
	
	this.removeLink = function($link)
	{
		var index = linksList.indexOf($link);
		
		if (index >= 0)
			linksList.splice(index, 1);
	};
	
	this.removeAllLinks = function() { linksList = []; };
	
	this.updateLinks = function()
	{
		var outputPosition = $this.getPosition();
		var width = component.getById('connector').offsetWidth;
		var height = component.getById('connector').offsetHeight;
		
		for (var i = 0; i < linksList.length; i++)
			linksList[i].setVertex1(outputPosition.x + width/2, outputPosition.y + height/2);
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.onMouseDown = function($event)
	{
		if (utils.isset(parent))
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				dragging = true;
				var mousePosition = parent.getParent().getMousePosition($event);
				tmpLink = new NodesLink(mousePosition.x, mousePosition.y, mousePosition.x, mousePosition.y);
				//tmpLink.setParent($this);
				$this.addLink(tmpLink);
				parent.getParent().addLink(tmpLink);
				$this.updateLinks();
			}
		}
		
		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			Events.preventDefault($event);
			var mousePosition = parent.getParent().getMousePosition($event);
			tmpLink.setVertex2(mousePosition.x, mousePosition.y);
		}
	};
	
	this.mouseMove = onMouseMove;
	
	var onMouseUp = function($event)
	{
		if (dragging === true)
		{
			parent.getParent().removeLink(tmpLink);
			$this.removeLink(tmpLink);
			$this.updateLinks();
		}
		
		dragging = false;
		tmpLink = null;
	};
	
	this.mouseUp = onMouseUp;
	
	this.onKeyUp = function($event)
	{
		if (dragging === true)
		{
			if ($event.keyCode === 27)
			{
				onMouseUp($event);
				console.log("Echappe ! ");
			}
		}
	};
	
	component.onMouseUp = function()
	{
		Events.emit('onReleaseOnOutput', [$this]);
	};
	
	component.connect('onReleaseOnInput', onReleaseOnInput);
	component.connect('onReleaseOnOutput', onReleaseOnOutput);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getName = function() { return name; };
	this.getLabel = function() { return label; };
	this.getType = function() { return type; };
	this.getDefaultValue = function() { return defaultValue; };
	this.getValue = function() { return value; };
	this.getParent = function() { return parent; };
	this.getTwin = function() { return twin; };
	
	this.getPosition = function()
	{
		var parentX = parent.getX();
		var parentY = parent.getY();
		return { 'x': parentX + component.getById('connector').offsetLeft, 'y': parentY + component.getById('connector').offsetTop };
	};
	
	this.getLinks = function() { return linksList; };
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('label').innerHTML = label;
	};
	
	this.setParent = function($parent) { parent = $parent; };
	this.setTwin = function($twin) { twin = $twin; };
	
	this.setValue = function($value)
	{
		value = $value;
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodeOutput");