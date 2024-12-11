function Dock()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="dock" >'
					+ '<div id="movingBlock" class="movingBlock" >'
						+ '<div id="supportLeft" class="support supportLeft" ></div>'
						+ '<div id="center" class="center" >'
							+ '<ul id="listIcons" class="listIcons" ></ul>'
							+ '<div id="supportCenter" class="support supportCenter" >'
							+ '</div>'
						+ '</div>'
						+ '<div id="supportRight" class="support supportRight" ></div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	var editMode = false;
	var elementsList = [];
	
	var mouseIn = false;
	
	var zoomingMode = false;
	var maxBaseWidth = 75;
	var baseWidth = 50;
	var zoomingMaxSize = 2.5;
	var maxZoomingDistance = 200;
	
	var hiddenMode = false;
	
	// Animation de réduction
	var supportPosition = 0;
	var animationTimer = null;
	var animationSpeed = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.addElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index < 0)
		{
			elementsList.push($element);
			$element.setParent($this);
		}
		
		component.getById('listIcons').appendChild($element);
		
		$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
		$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
		
		resizeItems();
	};
	
	this.insertElementInto = function($element, $index)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
			elementsList.splice(index, 1);
		
		elementsList.splice($index, 0, $element);
		component.getById('listIcons').insertAt($element, $index);
		$element.setParent($this);
		$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
		$element.onRelease = function($element2, $index) { return onRelease($element2, $index); };
		resizeItems();
	};
	
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		if (index >= 0)
		{
			elementsList.splice(index, 1);
			$element.onRemoveFromDock();
		}
		
		if (utils.isset($element.parentNode))
			$element.parentNode.removeChild($element);
		
		resizeItems();
	};
	
	this.removeAllElement = function()
	{
		for (var i = 0; i < elementsList.length; i++)
			elementsList[i].onRemoveFromDock();
		
		elementsList = [];
		component.getById('listIcons').removeAllChildren();
		
		resizeItems();
	};
	
	var resizeItems = function()
	{
		if (elementsList.length > 0)
		{
			var parentWidth = component.parentNode.offsetWidth;
			var itemWidth = (parentWidth-60)/elementsList.length;
			baseWidth = Math.min(itemWidth, maxBaseWidth);
			
			for (var i = 0; i < elementsList.length; i++)
			{
				elementsList[i].setBaseWidth(baseWidth);
				elementsList[i].setCurrentSize(baseWidth);
			}
			
			var supportHeight = elementsList[0].getById('openIcon').offsetHeight;
			
			component.getById('supportLeft').style.height = (baseWidth+supportHeight) + 'px';
			component.getById('supportCenter').style.height = (baseWidth+supportHeight) + 'px';
			component.getById('supportRight').style.height = (baseWidth+supportHeight) + 'px';
		}
		else
		{
			baseWidth = maxBaseWidth;
			component.getById('supportLeft').style.height = baseWidth + 'px';
			component.getById('supportCenter').style.height = baseWidth + 'px';
			component.getById('supportRight').style.height = baseWidth + 'px';
		}
	};
	
	this.autoResize = function()
	{
		var width = component.offsetWidth;
		
		if (width > 0)
		{
			resizeItems();
			
			if (hiddenMode === true)
			{
				setTimeout(function()
				{
					if (mouseIn === false)
						$this.startHide();
					
				}, 5000);
			}
		}
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	var animation = function()
	{
		supportPosition = supportPosition + animationSpeed;
		
		if (animationSpeed > 0 && supportPosition > 0)
		{
			supportPosition = 0;
			clearTimeout(animationTimer);
			animationTimer = null;
			animationSpeed = 0;
		}
		else if (animationSpeed < 0 && supportPosition < -component.getById('supportCenter').offsetHeight)
		{
			supportPosition = -component.getById('supportCenter').offsetHeight;
			clearTimeout(animationTimer);
			animationTimer = null;
			animationSpeed = 0;
		}
		
		component.getById('movingBlock').style.bottom = supportPosition + "px";
	};
	
	this.startDisplay = function()
	{
		if (hiddenMode === true)
		{
			animationSpeed = component.getById('supportCenter').offsetHeight/20;
			
			if (!utils.isset(animationTimer))
				animationTimer = setInterval(function() { animation(); }, 8);
		}
	};
	
	this.startHide = function()
	{
		if (hiddenMode === true)
		{
			animationSpeed = -component.getById('supportCenter').offsetHeight/20;
			
			if (!utils.isset(animationTimer))
				animationTimer = setInterval(function() { animation(); }, 8);
		}
	};
	
	this.reduce = function()
	{
		mouseIn = false;
		
		if (zoomingMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
				elementsList[i].launchReductionAnimation();
			
			component.getById('movingBlock').style.left = '0px';
		}
	};
	
	var onDrag = function($x, $y, $element)
	{
		var overLayer = null;
		
		for (var i = 0; i < elementsList.length; i++)
		{
			if (elementsList[i] !== $element)
			{
				overLayer = elementsList[i].getOverLayer($x, $y, $element);
				
				if (utils.isset(overLayer))
				{
					i = elementsList.length;
					//overLayer.dragOver();
				}
			}
		}
		
		if (!utils.isset(overLayer))
			overLayer = $this;
		
		return overLayer;
	};
	
	var onRelease = function($element, $index) { $this.insertElementInto($element, $index); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.onMouseOver = function($event)
	{
		if (hiddenMode === true)
			$this.startDisplay();
	};
	
	component.getById('movingBlock').onMouseOver = function($event)
	{
		mouseIn = true;
		
		if (hiddenMode === true)
			$this.startDisplay();
	};
	
	var onMouseMove = function($event)
	{
		if (zoomingMode === true && mouseIn === true)
		{
			var mousePosition = $this.mousePosition($event);
			
			for (var i = 0; i < elementsList.length; i++)
			{
				var itemPosition = elementsList[i].position();
				var itemX = itemPosition.x + elementsList[i].offsetWidth/2;
				var distance = Math.abs(itemX - mousePosition.x);
				
				if (distance > maxZoomingDistance)
				{
					distance = maxZoomingDistance;
					elementsList[i].setCurrentSize(baseWidth);
				}
				else
				{
					var itemWidth = baseWidth*(2.0-distance/maxZoomingDistance);
					elementsList[i].setCurrentSize(itemWidth);
				}
			}
			
			if (component.getById('movingBlock').offsetWidth > component.parentNode.offsetWidth)
			{
				var ratio = mousePosition.x/component.parentNode.offsetWidth;
				
				component.getById('movingBlock').style.left = ((component.parentNode.offsetWidth-component.getById('movingBlock').offsetWidth)*ratio) + 'px';
			}
			else
				component.getById('movingBlock').style.left = '0px';
		}
		
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].mouseMove))
					elementsList[i].mouseMove($event);
			}
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].mouseUp))
					elementsList[i].mouseUp($event);
			}
		}
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		if (editMode === true)
		{
			for (var i = 0; i < elementsList.length; i++)
				elementsList[i].onKeyUp($event);
		}
	};
	
	component.onMouseOut = function($event)
	{
		if (hiddenMode === true)
			$this.startHide();
	};
	
	component.getById('movingBlock').onMouseOut = function($event)
	{
		mouseIn = false;
		$this.reduce();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };

	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };
	this.setZoomingMode = function($zoomingMode) { zoomingMode = $zoomingMode; };
	this.setHiddenMode = function($hiddenMode) { hiddenMode = $hiddenMode; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	this.autoResize();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("dock");