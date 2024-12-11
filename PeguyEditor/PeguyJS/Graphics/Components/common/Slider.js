function Slider($min, $max, $currentValue)
{
	///////////////
	// Attributs //
	///////////////
	
	var min = $min;
	var max = $max;
	var currentValue = $currentValue;

	var html = '<div class="slider" >'
					+ '<div id="bar" class="sliderBar" ></div>'
					+ '<div id="handler" class="sliderHandler" ></div>'
				+ '</div>';
	
	var component = new Component(html);
	
	var icon = Loader.getSVG('icons', 'slider-cursor-icon', 18, 18);
	component.getById('handler').appendChild(icon);
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var updateCursor = function()
	{
		var cursorPosition = (currentValue-min)/(max-min);
		var barWidth = component.getById('bar').offsetWidth;
		component.getById('handler').style.left = (barWidth*cursorPosition) + 'px';
	};
	
	this.autoResize = function()
	{
		var barWidth = component.getById('bar').offsetWidth;
		
		if (barWidth > 0)
			updateCursor();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($value) {};
	
	component.getById('handler').onMouseDown = function($event)
	{
		console.log("Handle slider");
		console.log(document.getElementById('main').onMouseMove);

		if (!$event) // Cas IE 
			$event = window.event;
		
		if ($event.preventDefault) 
			$event.preventDefault(); 
		else
			$event.returnValue = false;
		
		if ($event.button === 0)
		{
			dragging = true;
			
			var x = $event.clientX + component.parentNode.scrollLeft;
			var y = $event.clientY + component.parentNode.scrollTop;
			var componentInitPosition = component.getById('handler').position();
			//console.log("Mouse position : " + x + ", " + y);
			//console.log(componentInitPosition);
			var componentInitX = componentInitPosition.x;
			var componentInitY = componentInitPosition.y;
			startX = x;
			startY = y;
			offsetX = startX-componentInitX;
			offsetY = startY-componentInitY;
			
			$this.focus();
		}

		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			Events.preventDefault($event);
			
			var componentPosition = $this.position();
			var componentX = componentPosition.x;
			var componentY = componentPosition.y;
	
			var mouseX = $event.clientX + $this.scrollLeft;
			var mouseY = $event.clientY + $this.scrollTop;
			
			var x = mouseX - offsetX - componentX;
			var y = mouseY - offsetY - componentY;
			
			if (x < 0)
				x = 0;
			else if (x > component.getById('bar').offsetWidth)
				x = component.getById('bar').offsetWidth;
			
			component.getById('handler').style.left = x + 'px';
			
			var positionRatio = x/component.getById('bar').offsetWidth;
			currentValue = min + (max-min)*positionRatio;
			
			$this.onChange(currentValue);
		}
	};
	
	//document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		if (dragging === true)
		{
			dragging = false;
			
			Events.preventDefault($event);
			
			var componentPosition = $this.position();
			var componentX = componentPosition.x;
			var componentY = componentPosition.y;
	
			var mouseX = $event.clientX + $this.scrollLeft;
			var mouseY = $event.clientY + $this.scrollTop;
			
			var x = mouseX - offsetX - componentX;
			var y = mouseY - offsetY - componentY;
			
			if (x < 0)
				x = 0;
			else if (x > component.getById('bar').offsetWidth)
				x = component.getById('bar').offsetWidth;
			
			component.getById('handler').style.left = x + 'px';
			
			var positionRatio = x/component.getById('bar').offsetWidth;
			currentValue = min + (max-min)*positionRatio;
			
			$this.onChange(currentValue);
		}
	};
	
	//document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onAppend = function()
	{
		document.getElementById('main').onMouseMove.push(onMouseMove);
		document.getElementById('main').onMouseUp.push(onMouseUp);
	};

	this.onRemove = function()
	{
		var index = document.getElementById('main').onMouseMove.indexOf(onMouseMove);
		
		if (index >= 0)
			document.getElementById('main').onMouseMove.splice(index, 1);
		
		index = document.getElementById('main').onMouseUp.indexOf(onMouseUp);
		
		if (index >= 0)
			document.getElementById('main').onMouseUp.splice(index, 1);
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getMin = function() { return min; };
	this.getMax = function() { return max; };
	this.getCurrentValue = function() { return currentValue; };
	
	// SET
	
	this.setCurrentValue = function($value)
	{
		currentValue = $value;
		
		if (currentValue < min)
			currentValue = min;
		else if (currentValue > max)
			currentValue = max;
		
		updateCursor();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.autoResize();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("slider");