function VerticalSlide($topPanel, $bottomPanel, $minSize)
{
	///////////////
	// Attributs //
	///////////////
	
	var topPanel = $topPanel;
	var bottomPanel = $bottomPanel;
	var minSize = $minSize;
	
	if (!utils.isset(minSize) || minSize < 100)
		minSize = 100;
	
	var html = '<div id="verticalSlide" class="verticalSlide" ><div id="slideButton" class="slideButton" ></div><div class="wall" ></div></div>';
				
	var component = new Component(html);
	
	// Drag & drop
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var deltaTop = 0;
	var deltaBottom = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var autoUpdate = function()
	{
		var currentHeight = $this.offsetHeight;
		
		if (currentHeight <= 0)
			setTimeout(function() { autoUpdate(); }, 20);
		else
		{
			var topPosition = topPanel.offsetTop + topPanel.offsetHeight;
			var bottomPosition = bottomPanel.offsetTop;
			var slidePosition = (topPosition + bottomPosition)/2.0;
			$this.style.top = (slidePosition - currentHeight/2.0) + 'px';
			
			deltaTop = topPosition - (slidePosition - currentHeight/2.0);
			deltaBottom = bottomPosition - (slidePosition - currentHeight/2.0);
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

			var y = $event.clientY-offsetY;
			
			if (utils.isset(component.offsetParent))
			{
				if (y < minSize)
					y = minSize;
				else if (y > component.offsetParent.offsetHeight - minSize)
					y = component.offsetParent.offsetHeight - minSize;
			}
			else
				y = 0;
			
			var topPanelStyle = getComputedStyle(topPanel);
			var topPanelOffsetHeight = parseInt(topPanelStyle.paddingTop.replace('px', '')) + parseInt(topPanelStyle.paddingBottom.replace('px', '')) 
										+ parseInt(topPanelStyle.borderTop.replace('px', '')) + parseInt(topPanelStyle.borderBottom.replace('px', ''));
			
			var bottomPanelStyle = getComputedStyle(bottomPanel);
			var bottomPanelOffsetTop = parseInt(bottomPanelStyle.marginTop.replace('px', ''));
			
			component.getById('verticalSlide').style.top = y + 'px';
			topPanel.style.height = (y + deltaTop - topPanel.offsetLeft - topPanelOffsetHeight) + 'px';
			bottomPanel.style.top = (y + deltaBottom - bottomPanelOffsetTop) + 'px';
			
			if (utils.isset(topPanel.onResize))
				topPanel.onResize();
			
			if (utils.isset(bottomPanel.onResize))
				bottomPanel.onResize();
			
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
	Loader.hasLoaded("verticalSlide");