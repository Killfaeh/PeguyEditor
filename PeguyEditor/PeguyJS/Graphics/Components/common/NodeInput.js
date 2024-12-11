function NodeInput($name, $label, $type)
{
	///////////////
	// Attributs //
	///////////////
	
	var name = $name;
	var label = $label;
	var type = $type;
	var parent = null;
	var twin = null;
	
	var html = '<li class="nodeInput" >'
					+ '<div id="connector" class="connector" ></div>'
					+ '<div id="label" class="nodeInputLabel" >' + label + '</div>'
					+ '<input type="text" id="input" class="nodeInputInput" placeholder="' + label + '" />'
				+ '</li>';
	
	var component = new Component(html);
	
	var link = null;
	
	// Drag & drop
	var dragging = false;
	var tmpLink = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	var onReleaseOnInput = function($input)
	{
		//if (dragging === true && utils.isset(tmpLink.getParent()) && $input !== $this)
		if (dragging === true)
		{
			if (utils.isset(link))
			{
				if ($input !== $this)
				{
					$input.setLink(tmpLink);
					$input.updateLink();
					link = null;
				}
				else
					$this.updateLink();
			}
			else
				parent.getParent().removeLink(tmpLink);
		}
		
		dragging = false;
		tmpLink = null;
	};
	
	var onReleaseOnOutput = function($output)
	{
		if (dragging === true)
		{
			if (utils.isset(link))
				$this.setLink(null);
			else
			{
				$output.addLink(tmpLink);
				$output.updateLinks();
				$this.setLink(tmpLink);
				$this.updateLink();
			}
		}
		
		dragging = false;
		tmpLink = null;
	};
	
	this.updateLink = function()
	{
		if (utils.isset(link))
		{
			var inputPosition = $this.getPosition();
			var width = component.getById('connector').offsetWidth;
			var height = component.getById('connector').offsetHeight;
			
			link.setVertex2(inputPosition.x + width/2, inputPosition.y + height/2);
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('input').onmousemove = function($event) { Events.emit('onMouseMoveOnModeInput', [$event]); };
	component.getById('input').onmouseup = function($event) { Events.emit('onReleaseOnInput', [$this]); };
	
	component.getById('connector').onMouseDown = function($event)
	{
		if (utils.isset(parent))
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				dragging = true;
				var mousePosition = parent.getParent().getMousePosition($event);
				
				if (utils.isset(link))
					tmpLink = link;
				else
				{
					tmpLink = new NodesLink(mousePosition.x, mousePosition.y, mousePosition.x, mousePosition.y);
					parent.getParent().addLink(tmpLink);
				}
				
				console.log(tmpLink);
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
			
			if (utils.isset(link))
				tmpLink.setVertex2(mousePosition.x, mousePosition.y);
			else
				tmpLink.setVertex1(mousePosition.x, mousePosition.y);
		}
	};
	
	this.mouseMove = onMouseMove;
	
	var onMouseUp = function($event)
	{
		if (dragging === true)
		{
			dragging = false;
			
			parent.getParent().removeLink(tmpLink);
			
			if (utils.isset(link))
				link.getParent().removeLink(link);
			
			link = null;
			tmpLink = null;
			$this.updateLink();
		}
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
		Events.emit('onReleaseOnInput', [$this]);
	};
	
	component.connect('onReleaseOnInput', onReleaseOnInput);
	component.connect('onReleaseOnOutput', onReleaseOnOutput);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getName = function() { return name };
	this.getLabel = function() { return label };
	this.getType = function() { return type; };
	this.getDefaultValue = function() { return defaultValue; };
	this.getParent = function() { return parent; };
	this.getTwin = function() { return twin; };
	
	this.getValue = function()
	{
		var value = component.getById('input').value;
		return value;
	};
	
	this.getLink = function() { return link; };
	
	this.getPosition = function()
	{
		var parentX = parent.getX();
		var parentY = parent.getY();
		return { 'x': parentX + component.getById('connector').offsetLeft, 'y': parentY + component.getById('connector').offsetTop };
	};
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('label').innerHTML = label;
	};
	
	this.setParent = function($parent) { parent = $parent; };
	this.setTwin = function($twin) { twin = $twin; };
	
	this.setLink = function($link)
	{
		if (utils.isset(link))
			parent.getParent().removeLink(link);
		
		link = $link;
		tmpLink = null;
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodeInput");