function ScrollPanel($content)
{
	///////////////
	// Attributs //
	///////////////

	var content = $content;

	var html = '<div class="scrollPanel" >'
					+ '<div id="canvas" class="canvas" >'
						+ '<div id="content" class="content" >'
							+ content
						+ '</div>'
					+ '</div>'
					+ '<div class="corner" ></div>'
					+ '<div id="up-down-scrollBar" class="up-down-scrollBar" >'
						+ '<div id="topArrows" class="topArrows" ><div id="topUpArrow" class="arrow" ></div><div id="topDownArrow" class="arrow" ></div></div>'
						+ '<div id="up-down-container" class="up-down-container" ><div id="up-down-bar" class="up-down-bar" ></div></div>'
						+ '<div id="bottomArrows" class="bottomArrows" ><div id="bottomUpArrow" class="arrow" ></div><div id="bottomDownArrow" class="arrow" ></div></div>'
					+ '</div>'
					+ '<div id="left-right-scrollBar" class="left-right-scrollBar" >'
						+ '<div id="leftArrows" class="leftArrows" ><div id="leftLeftArrow" class="arrow" ></div><div id="leftRightArrow" class="arrow" ></div></div>'
						+ '<div id="left-right-container" class="left-right-container" ><div id="left-right-bar" class="left-right-bar" ></div></div>'
						+ '<div id="rightArrows" class="rightArrows" ><div id="rightLeftArrow" class="arrow" ></div><div id="rightRightArrow" class="arrow" ></div></div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	var topUpArrow = Loader.getSVG('icons', 'up-arrow-icon', 12, 12);
	var bottomUpArrow = Loader.getSVG('icons', 'up-arrow-icon', 12, 12);
	var topDownArrow = Loader.getSVG('icons', 'down-arrow-icon', 12, 12);
	var bottomDownArrow = Loader.getSVG('icons', 'down-arrow-icon', 12, 12);
	var leftLeftArrow = Loader.getSVG('icons', 'left-arrow-icon', 12, 12);
	var rightLeftArrow = Loader.getSVG('icons', 'left-arrow-icon', 12, 12);
	var leftRightArrow = Loader.getSVG('icons', 'right-arrow-icon', 12, 12);
	var rightRightArrow = Loader.getSVG('icons', 'right-arrow-icon', 12, 12);
	
	component.getById('topUpArrow').appendChild(topUpArrow);
	component.getById('bottomUpArrow').appendChild(bottomUpArrow);
	component.getById('topDownArrow').appendChild(topDownArrow);
	component.getById('bottomDownArrow').appendChild(bottomDownArrow);
	component.getById('leftLeftArrow').appendChild(leftLeftArrow);
	component.getById('rightLeftArrow').appendChild(rightLeftArrow);
	component.getById('leftRightArrow').appendChild(leftRightArrow);
	component.getById('rightRightArrow').appendChild(rightRightArrow);
	
	// Paramètres
	
	var maxWidth = 0;
	var maxHeight = 0;
	
	var canScrollX = false;
	var canScrollY = false;
	
	var scrollX = 0;
	var scrollY = 0;
	
	var speedValue = 7;
	var speedX = 0;
	var speedY = 0;
	
	var paddingX = 0;
	var paddingY = 0;
	
	var maxBarRatioX = 1.0;
	var maxBarRatioY = 1.0;
	
	var arrowDown = false;
	var scrolling = false;
	var draggindLeftRight = false;
	var draggindUpDown = false;
	var draggindContent = false;
	var modifier = false;
	var lockWheel = false;
	var reverse = true;
	
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	
	var animationTimer = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function()
	{
		updateScrollBars();
	};
	
	var updateScrollBars = function()
	{
		var contentWidth = component.getById('content').offsetWidth;
		var contentHeight = component.getById('content').offsetHeight;
		var canvasWidth = component.getById('canvas').offsetWidth;
		var canvasHeight = component.getById('canvas').offsetHeight;
		var ratioWidth = canvasWidth/contentWidth;
		var ratioHeight = canvasHeight/contentHeight;
		
		var maxContentX = contentWidth - canvasWidth;
		var maxContentY = contentHeight - canvasHeight;
		
		component.getById('left-right-bar').removeAttribute('style');
		maxBarRatioX = 1.0;
		paddingX = parseInt(component.getById('left-right-bar').getStyle('top').replace('px', ''));
		maxWidth = component.getById('left-right-bar').offsetWidth;
		
		if (canvasWidth >= contentWidth)
		{
			canScrollX = false;
			component.getById('content').style.left = '0px';
		}
		else
		{
			canScrollX = true;
			component.getById('left-right-bar').style.width = (maxWidth*ratioWidth) + 'px';
			maxBarRatioX = maxWidth/contentWidth;
			
			var x = parseInt(component.getById('content').getStyle('left').replace('px', ''));
			
			if (x < -maxContentX)
			{
				x = -maxContentX;
				component.getById('content').style.left = x + 'px';
			}
			
			var ratioX = -x/maxContentX;
			var barX = paddingX + ratioX*(maxWidth - component.getById('left-right-bar').offsetWidth);
			component.getById('left-right-bar').style.left = barX + 'px';
			scrollX = barX;
		}
		
		component.getById('up-down-bar').removeAttribute('style');
		maxBarRatioY = 1.0;
		paddingY = parseInt(component.getById('up-down-bar').getStyle('left').replace('px', ''));
		maxHeight = component.getById('up-down-bar').offsetHeight;
		
		if (canvasHeight >= contentHeight)
		{
			canScrollY = false;
			component.getById('content').style.top = '0px';
		}
		else
		{
			canScrollY = true;
			component.getById('up-down-bar').style.height = (maxHeight*ratioHeight) + 'px';
			maxBarRatioY = maxHeight/contentHeight;
			
			var y = parseInt(component.getById('content').getStyle('top').replace('px', ''));
			
			if (y < -maxContentY)
			{
				y = -maxContentY;
				component.getById('content').style.top = y + 'px';
			}
			
			var ratioY = -y/maxContentY;
			var barY = paddingY + ratioY*(maxHeight - component.getById('up-down-bar').offsetHeight);
			component.getById('up-down-bar').style.top = barY + 'px';
			scrollY = barY;
		}
	};
	
	this.positionTo = function($x, $y)
	{
		
	};
	
	this.autoResize = function()
	{
		var canvasWidth = component.getById('canvas').offsetWidth;
		
		if (canvasWidth > 0)
			$this.init();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	var animation = function()
	{
		var contentWidth = component.getById('content').offsetWidth;
		var contentHeight = component.getById('content').offsetHeight;
		var canvasWidth = component.getById('canvas').offsetWidth;
		var canvasHeight = component.getById('canvas').offsetHeight;
		
		var maxContentX = contentWidth - canvasWidth;
		var maxContentY = contentHeight - canvasHeight;
		
		if (speedX !== 0)
		{
			scrollX = scrollX + speedX;
			
			if (speedX < 0 && scrollX < paddingX)
			{
				scrollX = paddingX;
				stopScroll();
			}
			else if (speedX > 0 && scrollX > maxWidth - component.getById('left-right-bar').offsetWidth)
			{
				scrollX = maxWidth - component.getById('left-right-bar').offsetWidth;
				stopScroll();
			}
			
			component.getById('left-right-bar').style.left = scrollX + 'px';
			
			var ratioX = scrollX/(maxWidth - component.getById('left-right-bar').offsetWidth);
			var contentX = -ratioX*maxContentX;
			
			component.getById('content').style.left = contentX + 'px';
		}
		else if (speedY !== 0)
		{
			scrollY = scrollY + speedY;
			
			if (speedY < 0 && scrollY < paddingY)
			{
				scrollY = paddingY;
				stopScroll();
			}
			else if (speedY > 0 && scrollY > maxHeight - component.getById('up-down-bar').offsetHeight)
			{
				scrollY = maxHeight - component.getById('up-down-bar').offsetHeight;
				stopScroll();
			}
			
			component.getById('up-down-bar').style.top = scrollY + 'px';
			
			var ratioY = scrollY/(maxHeight - component.getById('up-down-bar').offsetHeight);
			var contentY = -ratioY*maxContentY;
			
			component.getById('content').style.top = contentY + 'px';
		}
	};
	
	var stopScroll = function($event)
	{
		// Stopper les scrolls en cours
		arrowDown = false;
		
		if (scrolling === true)
		{
			clearTimeout(animationTimer);
			animationTimer = null;
		}
		else
			moveScroll(speedX, speedY);
		
		speedX = 0;
		speedY = 0;
		
		scrolling = false;
		
		component.getById('topUpArrow').removeClass('downArrow');
		component.getById('bottomUpArrow').removeClass('downArrow');
		component.getById('topDownArrow').removeClass('downArrow');
		component.getById('bottomDownArrow').removeClass('downArrow');
		component.getById('leftLeftArrow').removeClass('downArrow');
		component.getById('rightLeftArrow').removeClass('downArrow');
		component.getById('leftRightArrow').removeClass('downArrow');
		component.getById('rightRightArrow').removeClass('downArrow');
		component.getById('up-down-container').removeClass('downContainer');
		component.getById('left-right-container').removeClass('downContainer');
	};
	
	var launchTimeout = function()
	{
		setTimeout(function()
		{
			scrolling = true;
			
			if (arrowDown === true && !utils.isset(animationTimer))
				animationTimer = setInterval(function() { animation(); }, 20);
			
		}, 250);
	};
	
	var moveScroll = function($speedX, $speedY)
	{
		var contentWidth = component.getById('content').offsetWidth;
		var contentHeight = component.getById('content').offsetHeight;
		var canvasWidth = component.getById('canvas').offsetWidth;
		var canvasHeight = component.getById('canvas').offsetHeight;
		
		var maxContentX = contentWidth - canvasWidth;
		var maxContentY = contentHeight - canvasHeight;
		
		if ($speedX !== 0)
		{
			scrollX = scrollX + $speedX;
			
			if ($speedX < 0 && scrollX < paddingX)
				scrollX = paddingX;
			else if ($speedX > 0 && scrollX > maxWidth - component.getById('left-right-bar').offsetWidth)
				scrollX = maxWidth - component.getById('left-right-bar').offsetWidth;
			
			component.getById('left-right-bar').style.left = scrollX + 'px';
			
			var ratioX = scrollX/(maxWidth - component.getById('left-right-bar').offsetWidth);
			var contentX = -ratioX*maxContentX;
			
			component.getById('content').style.left = contentX + 'px';
		}
		
		if ($speedY !== 0)
		{
			scrollY = scrollY + $speedY;
			
			if ($speedY < 0 && scrollY < paddingY)
				scrollY = paddingY;
			else if ($speedY > 0 && scrollY > maxHeight - component.getById('up-down-bar').offsetHeight)
				scrollY = maxHeight - component.getById('up-down-bar').offsetHeight;
			
			component.getById('up-down-bar').style.top = scrollY + 'px';
			
			var ratioY = scrollY/(maxHeight - component.getById('up-down-bar').offsetHeight);
			var contentY = -ratioY*maxContentY;
			
			component.getById('content').style.top = contentY + 'px';
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	//// Evénements des flèches ////
	
	component.getById('topUpArrow').onMouseDown = component.getById('bottomUpArrow').onMouseDown = function($event)
	{
		// Déclencher la montée
		scrolling = false;
		arrowDown = true;
		speedY = -speedValue;
		launchTimeout();
		component.getById('topUpArrow').addClass('downArrow');
		component.getById('bottomUpArrow').addClass('downArrow');
	};
	
	component.getById('topDownArrow').onMouseDown = component.getById('bottomDownArrow').onMouseDown = function($event)
	{
		// Déclencher la descente
		scrolling = false;
		arrowDown = true;
		speedY = speedValue;
		launchTimeout();
		component.getById('topDownArrow').addClass('downArrow');
		component.getById('bottomDownArrow').addClass('downArrow');
	};
	
	component.getById('leftLeftArrow').onMouseDown = component.getById('rightLeftArrow').onMouseDown = function($event)
	{
		// Déclencher le défilement vers la gauche
		scrolling = false;
		arrowDown = true;
		speedX = -speedValue;
		launchTimeout();
		component.getById('leftLeftArrow').addClass('downArrow');
		component.getById('rightLeftArrow').addClass('downArrow');
	};
	
	component.getById('leftRightArrow').onMouseDown = component.getById('rightRightArrow').onMouseDown = function($event)
	{
		// Déclencher le défilement vers la droite
		scrolling = false;
		arrowDown = true;
		speedX = speedValue;
		launchTimeout();
		component.getById('leftRightArrow').addClass('downArrow');
		component.getById('rightRightArrow').addClass('downArrow');
	};
	
	component.getById('up-down-container').onMouseDown = function($event)
	{
		scrolling = false;
		arrowDown = true;
		
		var y = $event.clientY + component.parentNode.scrollTop - component.getById('up-down-container').position().y;
		
		if (y < component.getById('up-down-container').offsetHeight/2)
			speedY = -2*speedValue;
		else
			speedY = 2*speedValue;
		
		launchTimeout();
		component.getById('up-down-container').addClass('downContainer');
	};
	
	component.getById('left-right-container').onMouseDown = function($event)
	{
		scrolling = false;
		arrowDown = true;
		
		var x = $event.clientX + component.parentNode.scrollLeft - component.getById('left-right-container').position().x;
		
		if (x < component.getById('left-right-container').offsetWidth/2)
			speedX = -2*speedValue;
		else
			speedX = 2*speedValue;
		
		launchTimeout();
		component.getById('left-right-container').addClass('downContainer');
	};
	
	document.getElementById('main').onMouseUp.push(stopScroll);
	
	//// Drag & drop ////
	
	var onMouseDown = function($event, $element)
	{
		var x = $event.clientX + component.parentNode.scrollLeft;
		var y = $event.clientY + component.parentNode.scrollTop;
		var componentInitPosition = $element.position();
		//console.log("Mouse position : " + x + ", " + y);
		//console.log(componentInitPosition);
		var componentInitX = componentInitPosition.x;
		var componentInitY = componentInitPosition.y;
		startX = x;
		startY = y;
		offsetX = startX-componentInitX;
		offsetY = startY-componentInitY;
		
		$this.focus();
	};
	
	component.getById('left-right-bar').onClick = function() {};
	component.getById('up-down-bar').onClick = function() {};
	
	component.getById('left-right-bar').onMouseDown = function($event)
	{
		draggindLeftRight = true;
		onMouseDown($event, component.getById('left-right-bar'));
	};
	
	component.getById('up-down-bar').onMouseDown = function($event)
	{
		draggindUpDown = true;
		onMouseDown($event, component.getById('up-down-bar'));
	};
	
	component.getById('canvas').onMouseDown = function($event)
	{
		if (modifier === true)
		{
			draggindContent = true;
			onMouseDown($event, component.getById('content'));
		}
	};
	
	var onMouseMove = function($event)
	{
		if (draggindLeftRight === true || draggindUpDown === true || draggindContent === true)
		{
			Events.preventDefault($event);
			
			var componentPosition = component.getById('canvas').position();
			
			if (draggindLeftRight === true)
				componentPosition = component.getById('left-right-container').position();
			else if (draggindUpDown === true)
				componentPosition = component.getById('up-down-container').position();
			
			var componentX = componentPosition.x;
			var componentY = componentPosition.y;
	
			var mouseX = $event.clientX + $this.scrollLeft;
			var mouseY = $event.clientY + $this.scrollTop;
			
			var x = mouseX - offsetX - componentX;
			var y = mouseY - offsetY - componentY;
			
			var contentWidth = component.getById('content').offsetWidth;
			var contentHeight = component.getById('content').offsetHeight;
			var canvasWidth = component.getById('canvas').offsetWidth;
			var canvasHeight = component.getById('canvas').offsetHeight;
			
			var maxContentX = contentWidth - canvasWidth;
			var maxContentY = contentHeight - canvasHeight;
			
			if (draggindLeftRight === true)
			{
				if (x < paddingX)
					x = paddingX;
				else if (x > maxWidth - component.getById('left-right-bar').offsetWidth)
					x = maxWidth - component.getById('left-right-bar').offsetWidth;
				
				component.getById('left-right-bar').style.left = x + 'px';
				scrollX = x;
				
				var ratioX = x/(maxWidth - component.getById('left-right-bar').offsetWidth);
				var contentX = -ratioX*maxContentX;
				
				component.getById('content').style.left = contentX + 'px';
			}
			else if (draggindUpDown === true)
			{
				if (y < paddingY)
					y = paddingY;
				else if (y > maxHeight - component.getById('up-down-bar').offsetHeight)
					y = maxHeight - component.getById('up-down-bar').offsetHeight;
				
				component.getById('up-down-bar').style.top = y + 'px';
				scrollY = y;
				
				var ratioY = y/(maxHeight - component.getById('up-down-bar').offsetHeight);
				var contentY = -ratioY*maxContentY;
				
				component.getById('content').style.top = contentY + 'px';
			}
			else if (draggindContent === true)
			{
				if (x < -maxContentX)
					x = -maxContentX;
				else if (x > 0)
					x = 0;
				
				if (y < -maxContentY)
					y = -maxContentY;
				else if (y > 0)
					y = 0;
				
				component.getById('content').style.left = x + 'px';
				component.getById('content').style.top = y + 'px';
				
				var ratioX = -x/maxContentX;
				var barX = paddingX + ratioX*(maxWidth - component.getById('left-right-bar').offsetWidth);
				var ratioY = -y/maxContentY;
				var barY = paddingY + ratioY*(maxHeight - component.getById('up-down-bar').offsetHeight);
				
				component.getById('left-right-bar').style.left = barX + 'px';
				component.getById('up-down-bar').style.top = barY + 'px';
				
				scrollX = barX;
				scrollY = barY;
			}
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		draggindLeftRight = false;
		draggindUpDown = false;
		draggindContent = false;
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onWheel = function($event) {};
	
	component.onMouseWheel = function($event)
	{
		if (lockWheel === false)
		{
			var way = 1;
			
			if (reverse === true)
				way = -1;
			
			var deltaX = $event.wheelDeltaX;
			var deltaY = $event.wheelDeltaY;
			moveScroll(way*deltaX/3, way*deltaY/3);
		}
		
		$this.onWheel($event);
	};
	
	//// Redimensionnement ////
	
	this.onResize = function()
	{
		console.log("Resize scroll panel");
		updateScrollBars();
	};
	
	//// Lorsque l'on supprime le composent du DOM ////
	
	this.onRemove = function()
	{
		var index = document.getElementById('main').onMouseMove.indexOf(onMouseMove);
		
		if (index >= 0)
			document.getElementById('main').onMouseMove.splice(index, 1);
		
		index = document.getElementById('main').onMouseUp.indexOf(stopScroll);
		
		if (index >= 0)
			document.getElementById('main').onMouseUp.splice(index, 1);
		
		index = document.getElementById('main').onMouseUp.indexOf(onMouseUp);
		
		if (index >= 0)
			document.getElementById('main').onMouseUp.splice(index, 1);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getModifier = function() { return modifier; };
	this.isLockWheel = function() { return lockWheel; };
	this.isReverse = function() { return reverse; };
	
	// SET
	
	this.setModifier = function($modifier) { modifier = $modifier; };
	this.setLockWheel = function($lockWheel) { lockWheel = $lockWheel; };
	this.setReverse = function($reverse) { reverse = $reverse; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.autoResize();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("scrollPanel");