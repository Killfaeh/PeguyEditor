function Frame($content, $title)
{
	///////////////
	// Attributs //
	///////////////

	var content = $content;
	var title = $title;
	var minWidth = 300;
	var minHeight = 200;
	var width = 300;
	var height = 200;
	var x = 0;
	var y = 35;
	
	if (!utils.isset(title))
		title = '';

	var html = '<div class="frame" >'
					+ '<div class="innerFrame" >'
						+ '<div id="backgroundTitleBlock" class="backgroundTitleBlock" >'
							+ '<div id="backgroundTitle" class="backgroundTitle" >' + title + '</div>'
							+ '<div class="wall" ></div>'
						+ '</div>'
						+ '<div id="titleBlock" class="titleBlock" >'
							+ '<div id="title" class="title" >' + title + '</div>'
							+ '<div class="wall" ></div>'
						+ '</div>'
						+ '<div id="buttonsBlock" class="buttonsBlock" ></div>'
						+ '<div id="content" class="content" >'
							+ content
						+ '</div>'
						+ '<div id="resizeLeft" class="resizeLeft" ></div>'
						+ '<div id="resizeRight" class="resizeRight" ></div>'
						+ '<div id="resizeTop" class="resizeTop" ></div>'
						+ '<div id="resizeBottom" class="resizeBottom" ></div>'
						+ '<div id="resizeTL" class="resizeTL" ></div>'
						+ '<div id="resizeTR" class="resizeTR" ></div>'
						+ '<div id="resizeBL" class="resizeBL" ></div>'
						+ '<div id="resizeBR" class="resizeBR" ></div>'
						//+ '<div id="resizeBlock" class="resizeBlock" ></div>'
					+ '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
	var hideIcon = Loader.getSVG('icons', 'hide-frame-icon', 20, 20);
	var fullscreenModeIcon = Loader.getSVG('icons', 'fullscreen-mode-icon', 20, 20);
	var frameModeIcon = Loader.getSVG('icons', 'frame-mode-icon', 20, 20);
	//var resizeIcon = Loader.getSVG('icons', 'resize-frame-icon', 20, 20);
	
	component.getById('buttonsBlock').appendChild(closeIcon);
	component.getById('buttonsBlock').appendChild(hideIcon);
	component.getById('buttonsBlock').appendChild(fullscreenModeIcon);
	component.getById('buttonsBlock').appendChild(frameModeIcon);
	//component.getById('resizeBlock').appendChild(resizeIcon);
	
	frameModeIcon.style.display = 'none';
	component.getById('content').style.minWidth = width + 'px';
	component.getById('content').style.minHeight = height + 'px';
	component.getById('content').style.width = width + 'px';
	component.getById('content').style.height = height + 'px';
	
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
	
	var fullscreen = false;
	
	//////////////
	// Méthodes //
	//////////////

	this.onHide = function() { return true; };

	this.hide = function()
	{
		setTimeout(function()
		{
			var confirmHide = $this.onHide();
		
			if (confirmHide !== false)
			{
				if (utils.isset(component) && utils.isset(component.parentNode))
					component.parentNode.removeChild(component);
				
				if (utils.isset($this.blur) && $this instanceof Window)
					$this.blur();
				
				$this.unconnectAll();
				
				Components.removeFrame($this);
				Components.focusLastFrame();
				
				var index = document.getElementById('main').onClick.indexOf(onMouseMove);
		
				if (index >= 0)
					document.getElementById('main').onClick.splice(index, 1);
				
				index = document.getElementById('main').onClick.indexOf(onMouseUp);
		
				if (index >= 0)
					document.getElementById('main').onClick.splice(index, 1);
			}
			
		}, 50);
	};
	
	this.close = this.hide;
	
	this.onFocusFrame = function()
	{
		// On dégrise la fenêtre
		$this.setAttribute('class', 'frame');
	};
	
	this.onBlurFrame = function()
	{
		// On grise la fenêtre
		$this.setAttribute('class', 'frame blurFrame');
	};
	
	this.appendContent = function($content)
	{
		content = $content;
		component.getById('content').removeAllChildren();
		component.getById('content').appendChild($content);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	closeIcon.onClick = function() { $this.hide(); };
	
	fullscreenModeIcon.onClick = function()
	{
		fullscreen = true;
		
		var marginLeft = parseInt(component.getById('content').getStyle('margin-left').replace('px', ''));
		var marginRight = parseInt(component.getById('content').getStyle('margin-right').replace('px', ''));
		var marginTop = parseInt(component.getById('content').getStyle('margin-top').replace('px', ''));
		var marginBottom = parseInt(component.getById('content').getStyle('margin-bottom').replace('px', ''));
		
		component.style.left = '0px';
		component.style.right = '0px';
		component.style.top = '35px';
		component.style.bottom = '0px';
		
		component.getById('content').style.width = 'unset';
		component.getById('content').style.height = 'unset';
		
		component.getById('content').style.position = 'absolute';
		component.getById('content').style.left = marginLeft + 'px';
		component.getById('content').style.right = marginRight + 'px';
		component.getById('content').style.top = marginTop + 'px';
		component.getById('content').style.bottom = marginBottom + 'px';
		
		fullscreenModeIcon.style.display = 'none';
		frameModeIcon.style.display = 'inline';
		
		$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
	};
	
	frameModeIcon.onClick = function()
	{
		fullscreen = false;
		
		component.style.left = x + 'px';
		component.style.right = 'unset';
		component.style.top = y + 'px';
		component.style.bottom = 'unset';
		
		
		component.getById('content').style.position = 'relative';
		component.getById('content').style.left = 'unset';
		component.getById('content').style.right = 'unset';
		component.getById('content').style.top = 'unset';
		component.getById('content').style.bottom = 'unset';
		
		component.getById('content').style.width = width + 'px';
		component.getById('content').style.height = height + 'px';
		
		fullscreenModeIcon.style.display = 'inline';
		frameModeIcon.style.display = 'none';
		
		//$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
		$this.onResize(width, height);
	};
	
	component.getById('content').onClick = function() { Components.focusFrame($this); };
	component.getById('content').onMouseDown = function() { Components.focusFrame($this); };
	closeIcon.onMouseDown = function() { Components.focusFrame($this); };
	hideIcon.onMouseDown = function() { Components.focusFrame($this); };
	fullscreenModeIcon.onMouseDown = function() { Components.focusFrame($this); };
	frameModeIcon.onMouseDown = function() { Components.focusFrame($this); };
	
	var onMouseDown = function($event, $component)
	{
		var titleWidth = component.getById('title').offsetWidth;
		var buttonsBlockWidth = component.getById('buttonsBlock').offsetWidth;
		var marginLeft = parseInt(component.getById('content').getStyle('margin-left').replace('px', ''));
		var margin = 2*(buttonsBlockWidth-marginLeft);
		var newMinWidth = titleWidth+margin;
		
		if (newMinWidth > minWidth)
			minWidth = newMinWidth;
		
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
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingAll = true;
			onMouseDown($event, component);
		}

		return false;
	};
	
	component.getById('resizeLeft').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingLeft = true;
			onMouseDown($event, component.getById('resizeLeft'));
		}

		return false;
	};
	
	component.getById('resizeRight').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingRight = true;
			onMouseDown($event, component.getById('resizeRight'));
		}

		return false;
	};
	
	component.getById('resizeTop').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTop = true;
			onMouseDown($event, component.getById('resizeTop'));
		}

		return false;
	};
	
	component.getById('resizeBottom').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingBottom = true;
			onMouseDown($event, component.getById('resizeBottom'));
		}

		return false;
	};
	
	component.getById('resizeTL').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTL = true;
			onMouseDown($event, component.getById('resizeTL'));
		}

		return false;
	};
	
	component.getById('resizeTR').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTR = true;
			onMouseDown($event, component.getById('resizeTR'));
		}

		return false;
	};
	
	component.getById('resizeBL').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingBL = true;
			onMouseDown($event, component.getById('resizeBL'));
		}

		return false;
	};
	
	component.getById('resizeBR').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
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
		if (fullscreen !== true)
		{
			Events.preventDefault($event);
	
			var mouseX = $event.clientX + (utils.isset(component.parentNode) ? component.parentNode.scrollLeft : 0);
			var mouseY = $event.clientY + (utils.isset(component.parentNode) ? component.parentNode.scrollTop : 0);
			
			var deltaX = mouseX - previousX;
			var deltaY = mouseY - previousY;
			
			if (draggingAll === true)
			{
				x = mouseX - offsetX;
				y = mouseY - offsetY;
		
				component.style.left = x + 'px';
				component.style.top = y + 'px';
			}
			else
			{
				if (draggingLeft === true || draggingTL === true || draggingBL === true)
				{
					width = width - deltaX;
					
					if (width > minWidth)
					{
						x = mouseX - offsetX;
						component.style.left = x + 'px';
						component.getById('content').style.width = width + 'px';
						$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
						
						if (utils.isset(content) && utils.isset(content.resize))
							content.resize();
					}
				}
				
				if (draggingTop === true || draggingTL === true || draggingTR === true)
				{
					height = height - deltaY;
					
					if (height > minHeight)
					{
						y = mouseY - offsetY;
						component.style.top = y + 'px';
						component.getById('content').style.height = height + 'px';
						$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
						
						if (utils.isset(content) && utils.isset(content.resize))
							content.resize();
					}
				}
				
				if (draggingRight === true || draggingTR === true || draggingBR === true)
				{
					width = width + deltaX;
					
					if (width > minWidth)
					{
						component.getById('content').style.width = width + 'px';
						$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
						
						if (utils.isset(content) && utils.isset(content.resize))
							content.resize();
					}
				}
				
				if (draggingBottom === true || draggingBL === true || draggingBR === true)
				{
					height = height + deltaY;
					
					if (height > minHeight)
					{
						component.getById('content').style.height = height + 'px';
						$this.onResize(component.getById('content').offsetWidth, component.getById('content').offsetHeight);
						
						if (utils.isset(content) && utils.isset(content.resize))
							content.resize();
					}
				}
			}
			
			previousX = mouseX;
			previousY = mouseY;
		}
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
		//if (utils.isset(ghost) && utils.isset(ghost.parentNode))
		{
			if ($event.keyCode === 27)
			{
				onMouseUp($event);
				console.log("Echappe ! ");
			}
		}
		/*
		else
		{
			for (var i = 0; i < elementsList.length; i++)
				elementsList[i].onKeyUp($event);
		}
		//*/
	};

	// Pour empêcher de déclencher les événements de la fenêtre quand on clique dans son contenu
	component.getById('content').onMouseDown = function($event) {};
	component.getById('content').onMouseMove = function($event) {};
	
	this.onResize = function($width, $height)
	{
		//console.log("Resize frame");
		
		if (utils.isset(content) && utils.isset(content.resize))
			content.resize();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	this.setTitle = function($title)
	{
		title = $title;
		
		if (!utils.isset(title))
			title = '';
		
		component.getById('title').innerHTML = title;
		component.getById('backgroundTitle').innerHTML = title;
	};
	
	this.setPosition = function($x, $y)
	{
		x = $x;
		y = $y;
		
		$this.style.left = $x + 'px';
		$this.style.top = $y + 'px';
	};
	
	this.setMinDimensions = function($width, $height)
	{
		minWidth = $width;
		minHeight = $height;
		
		if (minWidth < 10)
			minWidth = 10;
		
		if (minHeight < 10)
			minHeight = 10;
		
		component.getById('content').style.minWidth = minWidth + 'px';
		component.getById('content').style.minHeight = minHeight + 'px';
	};
	
	this.setMinWidth = function($width)
	{
		minWidth = $width;
		
		if (minWidth < 10)
			minWidth = 10;
		
		component.getById('content').style.minWidth = minWidth + 'px';
	};
	
	this.setMinHeight = function($height)
	{
		minHeight = $height;
		
		if (minHeight < 10)
			minHeight = 10;
		
		component.getById('content').style.minHeight = minHeight + 'px';
	};
	
	this.setDimensions = function($width, $height)
	{
		width = $width;
		height = $height;
		
		if (width < minWidth)
			width = minWidth;
		
		if (height < minHeight)
			height = minHeight;
		
		component.getById('content').style.width = width + 'px';
		component.getById('content').style.height = height + 'px';
	};
	
	this.setWidth = function($width)
	{
		width = $width;
		
		if (width < minWidth)
			width = minWidth;
		
		component.getById('content').style.width = width + 'px';
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		
		if (height < minHeight)
			height = minHeight;
		
		component.getById('content').style.height = height + 'px';
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	document.getElementById('main').appendChild($this);
	Components.addFrame($this);
	$this.focus();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("frame");