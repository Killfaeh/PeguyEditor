function HorizontalSlide($leftPanel, $rightPanel, $minSize)
{
	///////////////
	// Attributs //
	///////////////
	
	var leftPanel = $leftPanel;
	var rightPanel = $rightPanel;
	var minSize = $minSize;
	
	if (!utils.isset(minSize) || minSize < 100)
		minSize = 100;
	
	var html = '<div id="horizontalSlide" class="horizontalSlide" ><div id="slideButton" class="slideButton" ></div><div class="wall" ></div></div>';
				
	var component = new Component(html);
	
	// Drag & drop
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var deltaLeft = 0;
	var deltaRight = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var autoUpdate = function()
	{
		var currentWidth = $this.offsetWidth;
		
		if (currentWidth <= 0)
			setTimeout(function() { autoUpdate(); }, 20);
		else
		{
			var leftPosition = leftPanel.offsetLeft + leftPanel.offsetWidth;
			var rightPosition = rightPanel.offsetLeft;
			var slidePosition = (leftPosition + rightPosition)/2.0;
			$this.style.left = (slidePosition - currentWidth/2.0) + 'px';
			
			deltaLeft = leftPosition - (slidePosition - currentWidth/2.0);
			deltaRight = rightPosition - (slidePosition - currentWidth/2.0);
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onDrag = function() {};
	
	component.onMouseDown = function($event)
	{
		if (!$event) // Cas IE 
			$event = window.event;
		
		if ($event.preventDefault) 
			$event.preventDefault(); 
		else
			$event.returnValue = false;
		
		if ($event.button === 0)
		{
			dragging = true;
			
			var x = $event.clientX + component.offsetParent.scrollLeft;
			var y = $event.clientY + component.offsetParent.scrollTop;
			startX = x;
			startY = y;
			offsetX = startX-component.offsetLeft;
			offsetY = startY-component.offsetTop;
		}

		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			if (!$event) // Cas IE 
				$event = window.event;
			
			if ($event.preventDefault) 
				$event.preventDefault(); 
			else
				$event.returnValue = false; 

			var x = $event.clientX-offsetX;
			
			if (utils.isset(component.offsetParent))
			{
				if (x < minSize)
					x = minSize;
				else if (x > component.offsetParent.offsetWidth - minSize)
					x = component.offsetParent.offsetWidth - minSize;
			}
			else
				x = 0;
			
			var leftPanelStyle = getComputedStyle(leftPanel);
			var leftPanelOffsetWidth = parseInt(leftPanelStyle.paddingLeft.replace('px', '')) + parseInt(leftPanelStyle.paddingRight.replace('px', '')) 
										+ parseInt(leftPanelStyle.borderLeft.replace('px', '')) + parseInt(leftPanelStyle.borderRight.replace('px', ''));
			
			var rightPanelStyle = getComputedStyle(rightPanel);
			var rightPanelOffsetLeft = parseInt(rightPanelStyle.marginLeft.replace('px', ''));
			
			component.getById('horizontalSlide').style.left = x + 'px';
			leftPanel.style.width = (x + deltaLeft - leftPanel.offsetLeft - leftPanelOffsetWidth) + 'px';
			rightPanel.style.left = (x + deltaRight - rightPanelOffsetLeft) + 'px';
			
			if (utils.isset(leftPanel.onResize))
				leftPanel.onResize();
			
			if (utils.isset(rightPanel.onResize))
				rightPanel.onResize();
			
			$this.onDrag();
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		dragging = false;
		moved = false;
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onResize = function() { autoUpdate(); };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	autoUpdate();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("horizontalSlide");