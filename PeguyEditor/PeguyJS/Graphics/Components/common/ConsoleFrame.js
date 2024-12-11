function ConsoleFrame()
{
	///////////////
	// Attributs //
	///////////////
	
	var minWidth = 300;
	var minHeight = 200;
	var width = 500;
	var height = 400;
	var x = 10;
	var y = 10;
	
	// Drag & drop
    /*
	var clicked = false;
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var previousX = 0;
	var previousY = 0;
    //*/

	var html = '<div class="consoleFrame" >'
					+ '<h4 id="title" >' + KEYWORDS.debugConsole + '</h4>'
					+ '<div id="content" class="content" ></div>'
					+ '<div id="closeIcon" class="closeIcon" ></div>'
					+ '<div id="resizeLeft" class="resizeLeft" ></div>'
					+ '<div id="resizeRight" class="resizeRight" ></div>'
					+ '<div id="resizeTop" class="resizeTop" ></div>'
					+ '<div id="resizeBottom" class="resizeBottom" ></div>'
					+ '<div id="resizeTL" class="resizeTL" ></div>'
					+ '<div id="resizeTR" class="resizeTR" ></div>'
					+ '<div id="resizeBL" class="resizeBL" ></div>'
					+ '<div id="resizeBR" class="resizeBR" ></div>'
				+ '</div>';

	var component = new Component(html);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
	component.getById('closeIcon').appendChild(closeIcon);
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	
	var draggingAll = false;
	var draggingLeft = false;
	var draggingRight = false;
	var draggingTop = false;
	var draggingBottom = false;
	var draggingTL = false;
	var draggingTR = false;
	var draggingBL = false;
	var draggingBR = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var previousX = 0;
	var previousY = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.display = function()
	{
		var parentConsole = $this.parentNode;
		
		if (!utils.isset(parentConsole))
			document.getElementById('main').appendChild($this);
	};
	
	this.hide = function()
	{
		var consoleParent = $this.parentNode;
		
		if (utils.isset(consoleParent))
			consoleParent.removeChild($this);
	};
	
	this.log = function($message)
	{
		console.log($message);
		
		if (Debug.mode === true)
			$this.display();
		
		var now = new Date();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();
		var milli = now.getMilliseconds();
		
		if (hours < 10)
			hours = '0' + hours;
		
		if (minutes < 10)
			minutes = '0' + minutes;
		
		if (seconds < 10)
			seconds = '0' + seconds;
		
		if (milli < 10)
			milli = '00' + milli;
		else if (milli < 100)
			milli = '0' + milli;
		
		component.getById('content').appendChild(new Component('<p><strong>' + now.getSQLFormat() + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milli + ' : </strong>' + $message + '</p>'));
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.getById('closeIcon').onClick = function() { $this.hide(); };
	
	if (Loader.getMode() === 'classic')
	{
		var onMouseDown = function($event, $component)
		{
			var titleWidth = component.getById('title').offsetWidth;
			var buttonsBlockWidth = component.getById('closeIcon').offsetWidth;
			var marginLeft = parseInt(component.getById('content').getStyle('margin-left').replace('px', ''));
			var margin = 2*(buttonsBlockWidth-marginLeft);
			/*
			var newMinWidth = titleWidth+margin;
			
			if (newMinWidth > minWidth)
				minWidth = newMinWidth;
				//*/
			
			var mouseX = $event.clientX + component.parentNode.scrollLeft;
			var mouseY = $event.clientY + component.parentNode.scrollTop;
			var componentInitPosition = $component.position();
			console.log("Mouse position : " + x + ", " + y);
			console.log(componentInitPosition);
			var componentInitX = componentInitPosition.x;
			var componentInitY = componentInitPosition.y;
			startX = mouseX;
			startY = mouseY;
			previousX = mouseX;
			previousY = mouseY;
			offsetX = startX-componentInitX;
			offsetY = startY-componentInitY;
		};
		
		component.onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingAll = true;
				onMouseDown($event, component);
			}
	
			return false;
		};
		
		component.getById('resizeLeft').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingLeft = true;
				onMouseDown($event, component.getById('resizeLeft'));
			}
	
			return false;
		};
		
		component.getById('resizeRight').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingRight = true;
				onMouseDown($event, component.getById('resizeRight'));
			}
	
			return false;
		};
		
		component.getById('resizeTop').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingTop = true;
				onMouseDown($event, component.getById('resizeTop'));
			}
	
			return false;
		};
		
		component.getById('resizeBottom').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingBottom = true;
				onMouseDown($event, component.getById('resizeBottom'));
			}
	
			return false;
		};
		
		component.getById('resizeTL').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingTL = true;
				onMouseDown($event, component.getById('resizeTL'));
			}
	
			return false;
		};
		
		component.getById('resizeTR').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingTR = true;
				onMouseDown($event, component.getById('resizeTR'));
			}
	
			return false;
		};
		
		component.getById('resizeBL').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingBL = true;
				onMouseDown($event, component.getById('resizeBL'));
			}
	
			return false;
		};
		
		component.getById('resizeBR').onMouseDown = function($event)
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				draggingBR = true;
				onMouseDown($event, component.getById('resizeBR'));
			}
	
			return false;
		};
		
		this.onDrag = function($x, $y) { return null; };
		this.onRelease = function($element, $index) {};
		
		var onMouseMove = function($event)
		{
			var mouseX = $event.clientX + (utils.isset(component.parentNode) ? component.parentNode.scrollLeft : 0);
			var mouseY = $event.clientY + (utils.isset(component.parentNode) ? component.parentNode.scrollTop : 0);
			
			var deltaX = mouseX - previousX;
			var deltaY = mouseY - previousY;
			
			if (draggingAll === true)
			{
				Events.preventDefault($event);
				
				x = mouseX - offsetX;
				y = mouseY - offsetY;
		
				component.style.left = x + 'px';
				component.style.top = y + 'px';
			}
			else
			{
				if (draggingLeft === true || draggingTL === true || draggingBL === true)
				{
					Events.preventDefault($event);
					
					width = width - deltaX;
					
					if (width > minWidth)
					{
						x = mouseX - offsetX;
						component.style.left = x + 'px';
						component.style.width = width + 'px';
					}
				}
				
				if (draggingTop === true || draggingTL === true || draggingTR === true)
				{
					Events.preventDefault($event);
					
					height = height - deltaY;
					
					if (height > minHeight)
					{
						y = mouseY - offsetY;
						component.style.top = y + 'px';
						component.style.height = height + 'px';
					}
				}
				
				if (draggingRight === true || draggingTR === true || draggingBR === true)
				{
					Events.preventDefault($event);
					
					width = width + deltaX;
					
					if (width > minWidth)
						component.style.width = width + 'px';
				}
				
				if (draggingBottom === true || draggingBL === true || draggingBR === true)
				{
					Events.preventDefault($event);
					
					height = height + deltaY;
					
					if (height > minHeight)
						component.style.height = height + 'px';
				}
			}
			
			previousX = mouseX;
			previousY = mouseY;
		};
		
		document.getElementById('main').onMouseMove.push(onMouseMove);
		
		var onMouseUp = function($event)
		{
			draggingAll = false;
			draggingLeft = false;
			draggingRight = false;
			draggingTop = false;
			draggingBottom = false;
			draggingTL = false;
			draggingTR = false;
			draggingBL = false;
			draggingBR = false;
		};
		
		document.getElementById('main').onMouseUp.push(onMouseUp);
		
		this.onKeyUp = function($event)
		{
			if ($event.keyCode === 27)
			{
				onMouseUp($event);
				console.log("Echappe ! ");
			}
		};
	}
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	
	// L'objet console ne peut être instancié qu'une seule fois.
	
	if (utils.isset(Debug.console))
		$this = Debug.console;
	else
		Debug.console = $this;
	
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("consoleFrame");