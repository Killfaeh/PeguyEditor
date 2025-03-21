function NodesPanel($width, $height)
{
	///////////////
	// Attributs //
	///////////////
	
	var scale = 1.0;
	var offsetX = 0.0;
	var offsetY = 0.0;
	
	var svg = new SVG($width, $height);
	svg.setAttribute('class', 'nodesPanel');
	
	var patternCode = '<defs>'
							+ '<pattern id="gridPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" >'
								+ '<line x1="0" y1="100" x2="100" y2="100" class="gridLine" />'
								+ '<line x1="100" y1="0" x2="100" y2="100" class="gridLine" />'
							+ '</pattern>'
						+ '</defs>';
	
	var pattern = new Component(patternCode);
	
	pattern.getById('gridPattern').setAttribute('id', 'gridPattern');
	
	var svgCode = '<g>'
						+ '<g id="translateGroup" transform="translate(0.0,0.0)" >'
							+ '<g id="scaleGroup" transform="scale(1.0)" >'
								+ '<rect id="gridRect" x="-10000000" y="-10000000" width="20000000" height="20000000" style="fill: url(#gridPattern);" />'
								+ '<g id="root" >'
									+ '<g id="linksGroup" ></g>'
									+ '<g id="nodesGroup" ></g>'
								+ '</g>'
								+ '<g id="groups" class="groups" ></g>'
								+ '<rect id="selectRect" class="selectRect" x="0" y="0" width="10" height="10" style="display: none; " />'
							+ '</g>'
						+ '</g>'
						+ '<g id="icons" transform="translate(10,10)" >'
							+ '<g class="icon" id="enterIcon" transform="translate(40,0)" >'
								+ '<rect x="0" y="0" width="30" height="30" style="fill: rgba(255, 255, 255, 0); " />'
							+ '</g>'
							+ '<g class="icon" id="outIcon" >'
								+ '<rect x="0" y="0" width="30" height="30" style="fill: rgba(255, 255, 255, 0); " />'
							+ '</g>'
						+ '</g>'
					+ '</g>';
	
	var g = new Component(svgCode);
	
	g.getById('gridRect').setAttribute('style', 'fill: url(#gridPattern);');
	
	svg.appendChild(pattern);
	svg.appendChild(g);
	
	var enterIcon = Loader.getSVG('icons', 'enter-icon', 30, 30);
	var outIcon = Loader.getSVG('icons', 'out-icon', 30, 30);
	
	g.getById('enterIcon').onToolTip = "Entrer dans le noeud";
	g.getById('outIcon').onToolTip = "Sortir du noeud";
	
	g.getById('enterIcon').appendChild(enterIcon);
	g.getById('outIcon').appendChild(outIcon);
	
	var nodesList = [];
	var linksList = [];
	//var selected = null;
	
	// Drag & drop
	var dragModifier = 'alt';
	var dragging = false;
	var select = false;
	var move = false;
	var startX = 0;
	var startY = 0;
	
	var displayedPanel = this;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.unselectAll = function()
	{
		for (var i = 0; i < nodesList.length; i++)
		{
			nodesList[i].unselect();
			
			if (nodesList[i].isGroup === true)
				nodesList[i].unselectAll();
		}
	};
	
	//// Gestion des noeuds ////
	
	this.addNode = function($node)
	{
		var index = nodesList.indexOf($node);
		
		if (index < 0)
		{
			nodesList.push($node);
			$node.setParent($this);
		}
		
		g.getById('nodesGroup').appendChild($node);
		
		$node.onDrag = function($x, $y) { return onDragTab($x, $y, $node); };
		$node.onRelease = function($node2, $index) { return onRelease($node2, $index); };
		$this.unselectAll();
		$node.select();
		
		if ($node.isGroup === true)
			g.getById('groups').appendChild($node.getPanel());
	};
	
	this.removeNode = function($node)
	{
		$node.unselect();
		
		var index = nodesList.indexOf($node);
		
		if (index >= 0)
			nodesList.splice(index, 1);
		
		if (utils.isset($node.parentNode))
			$node.parentNode.removeChild($node);
	};
	
	this.removeAllNode = function()
	{
		$this.unselectAll();
		nodesList = [];
		g.getById('nodesGroup').removeAllChildren();
		selected = null;
	};
	
	var onUngroup = function($groupNode)
	{
		$this.removeNode($groupNode);
		$this.unselectAll();
		
		for (var i = 0; i < displayedPanel.getNodesList().length; i++)
		{
			if (utils.isset(displayedPanel.getNodesList()[i].updateLinks))
				displayedPanel.getNodesList()[i].updateLinks();
		}
	};
	
	//// Gestion des liens ////
	
	this.addLink = function($link)
	{
		var index = linksList.indexOf($link);
		
		if (index < 0)
			linksList.push($link);
		
		g.getById('linksGroup').appendChild($link);
	};
	
	this.removeLink = function($link)
	{
		var index = linksList.indexOf($link);
		
		if (index >= 0)
			linksList.splice(index, 1);
		
		if (utils.isset($link.parentNode))
			$link.parentNode.removeChild($link);
	};
	
	this.removeAllLinks = function()
	{
		linksList = [];
		g.getById('linksGroup').removeAllChildren();
	};
	
	var updateZindex = function()
	{
		/*
		var displayed = g.getById('tabs').childNodes;
		
		for (var i = 0; i < displayed.length; i++)
			displayed[displayed.length-1-i].style.zIndex = i;
		//*/
	};
	
	var updateScale = function()
	{
		g.getById('scaleGroup').setAttributeNS(null, 'transform', 'scale(' + scale + ')');
	};
	
	var updatePosition = function()
	{
		g.getById('translateGroup').setAttributeNS(null, 'transform', 'translate(' + offsetX + ',' + offsetY + ')');
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function() {};
	
	var onSelect = function($node)
	{
		if ($this.containsInChildren($node) === true)
		{
			var selectedNodes = $this.getSelected();
			
			if (selectedNodes.length === 1 && selectedNodes[0].isGroup === true)
				g.getById('enterIcon').setAttributeNS(null, 'style', 'display: block;');
			else
				g.getById('enterIcon').setAttributeNS(null, 'style', 'display: none;');
		}
	};
	
	var onAddGroup = function($node)
	{
		if ($this.containsInChildren($node) === true)
			g.getById('groups').appendChild($node.getPanel());
	};
	
	svg.onClick = function($event)
	{
		if (move !== true)
			$this.unselectAll();
	};
	
	svg.onMouseDown = function($event)
	{
		Events.preventDefault($event);
		
		dragging = true;
		
		var mousePosition = document.getElementById('main').mousePosition($event);
		
		startX = mousePosition.x;
		startY = mousePosition.y;
		
		if ($event.button === 0)
		{
			if (Events.keyPressTable[dragModifier] !== true)
			{
				var mousePosition = $this.getMousePosition($event);
				
				startX = mousePosition.x;
				startY = mousePosition.y;
				
				select = true;
				g.getById('selectRect').setAttributeNS(null, 'x', startX);
				g.getById('selectRect').setAttributeNS(null, 'y', startY);
				g.getById('selectRect').setAttributeNS(null, 'width', 0);
				g.getById('selectRect').setAttributeNS(null, 'height', 0);
				g.getById('selectRect').setAttributeNS(null, 'style', 'display: block;');
			}
		}
		
		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			move = true;
			
			if (select === true)
			{
				var mousePosition = $this.getMousePosition($event);
				
				var rectX = startX;
				var rectY = startY;
				var rectWidth = Math.abs(mousePosition.x - startX);
				var rectHeight = Math.abs(mousePosition.y - startY);
				
				if (startX > mousePosition.x)
					rectX = mousePosition.x;
				
				if (startY > mousePosition.y)
					rectY = mousePosition.y;
				
				g.getById('selectRect').setAttributeNS(null, 'x', rectX);
				g.getById('selectRect').setAttributeNS(null, 'y', rectY);
				g.getById('selectRect').setAttributeNS(null, 'width', rectWidth);
				g.getById('selectRect').setAttributeNS(null, 'height', rectHeight);
			}
			else
			{
				var mousePosition = document.getElementById('main').mousePosition($event);
				
				offsetX = offsetX + mousePosition.x - startX;
				offsetY = offsetY + mousePosition.y - startY;
				
				updatePosition();
				
				startX = mousePosition.x;
				startY = mousePosition.y;
			}
		}
		else
		{
			for (var i = 0; i < displayedPanel.getNodesList().length; i++)
			{
				if (utils.isset(displayedPanel.getNodesList()[i].mouseMove))
					displayedPanel.getNodesList()[i].mouseMove($event);
			}
		}
	};
	
	//document.getElementById('main').onMouseMove.push(onMouseMove);
	svg.onMouseMove = onMouseMove;
	
	var onMouseUp = function($event)
	{
		if (dragging !== true)
		{
			for (var i = 0; i < displayedPanel.getNodesList().length; i++)
			{
				if (utils.isset(displayedPanel.getNodesList()[i].mouseUp))
					displayedPanel.getNodesList()[i].mouseUp($event);
			}
		}
		else
		{
			if (select === true)
			{
				if (Events.keyPressTable['shift'] !== true)
					$this.unselectAll();
				
				for (var i = 0; i < displayedPanel.getNodesList().length; i++)
				{
					if (displayedPanel.getNodesList()[i].isInSelectRect(g.getById('selectRect')) === true)
						displayedPanel.getNodesList()[i].select();
				}
			}
			
			setTimeout(function() { move = false; }, 50);
		}
		
		dragging = false;
		select = false;
		g.getById('selectRect').setAttributeNS(null, 'style', 'display: none;');
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		for (var i = 0; i < displayedPanel.getNodesList().length; i++)
			displayedPanel.getNodesList()[i].onKeyUp($event);
	};
	
	svg.onMouseWheel = function($event)
	{
		var deltaX = $event.wheelDeltaX;
		var deltaY = $event.wheelDeltaY;
		
		var oldScale = scale;
		var percentScale = scale*100.0;
		
		percentScale = percentScale+deltaY/20.0;
		
		if (percentScale < 20.0)
			percentScale = 20.0;
		else if (percentScale > 500.0)
			percentScale = 500.0;
		
		scale = percentScale/100.0;
		
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contentPosition = $this.parentNode.position($event);
		var mousePositionInSVG = $this.getMousePosition($event);
		var mousePositionInWindow = { x: mousePosition.x - contentPosition.x, y : mousePosition.y - contentPosition.y };
		var virtualWindowWidth = scale*svg.getWidth();
		var virtualWindowHeight = scale*svg.getHeight();
		
		offsetX = (mousePosition.x - contentPosition.x) * (1.0 - scale/oldScale) + offsetX*scale/oldScale;
		offsetY = (mousePosition.y - contentPosition.y) * (1.0 - scale/oldScale) + offsetY*scale/oldScale;
		
		updateScale();
		updatePosition();
	};
	
	g.getById('enterIcon').onMouseDown = function() {};
	
	g.getById('enterIcon').onClick = function()
	{
		var selectedNodes = $this.getSelected();
		
		if (selectedNodes.length === 1 && selectedNodes[0].isGroup === true)
		{
			g.getById('root').style.visibility = 'hidden';
			
			var groups = g.getById('groups').childNodes;
			
			for (var i = 0; i < groups.length; i++)
				groups[i].style.visibility = 'hidden';
			
			displayedPanel = selectedNodes[0];
			displayedPanel.getPanel().style.visibility = 'visible';
			displayedPanel.updateLinks();
			
			$this.unselectAll();
			
			g.getById('outIcon').setAttributeNS(null, 'style', 'display: block;');
		}
	};
	
	g.getById('outIcon').onMouseDown = function() {};
	
	g.getById('outIcon').onClick = function()
	{
		var previousDisplayedPanel = displayedPanel;
		displayedPanel = displayedPanel.getParent();
		
		g.getById('root').style.visibility = 'hidden';
		
		var groups = g.getById('groups').childNodes;
		
		for (var i = 0; i < groups.length; i++)
			groups[i].style.visibility = 'hidden';
		
		if (displayedPanel.isGroup === true)
		{
			displayedPanel.getPanel().style.visibility = 'visible';
			displayedPanel.updateLinks();
			g.getById('outIcon').setAttributeNS(null, 'style', 'display: block;');
		}
		else
		{
			g.getById('root').style.visibility = 'visible';
			g.getById('outIcon').setAttributeNS(null, 'style', 'display: none;');
		}
		
		$this.unselectAll();
		previousDisplayedPanel.select();
	};
	
	svg.connect('onSelectNode', onSelect);
	svg.connect('onAddNodesGroup', onAddGroup);
	svg.connect('onUngroupNode', onUngroup);
	svg.connect('onMouseMoveOnModeInput', onMouseMove);
	svg.connect('onMouseUpOnModeInput', onMouseUp);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getNodesList = function() { return nodesList; };
	
	this.getSelected = function()
	{
		var selectedNodes = [];
		
		for (var i = 0; i < displayedPanel.getNodesList().length; i++)
		{
			if (displayedPanel.getNodesList()[i].isSelected())
				selectedNodes.push(displayedPanel.getNodesList()[i]);
		}
		
		return selectedNodes;
	};
	
	this.getDisplayedPanel = function() { return displayedPanel; };
	
	this.getMousePosition = function($event)
	{
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contentPosition = $this.parentNode.position($event);
		
		return { x: (mousePosition.x - contentPosition.x - offsetX)/scale, y: (mousePosition.y - contentPosition.y - offsetY)/scale };
	};

	// Ajouter la récupération de toute la hiérarchie en JSON
	
	// SET
	
	this.setDimensions = function($width, $height)
	{
		$this.setWidth($width);
		$this.setHeight($height);
	};
	
	this.setScale = function($scale)
	{
		scale = $scale;
		updateScale();
	};
	
	this.setOffsetX = function($offsetX)
	{
		offsetX = $offsetX;
		updatePosition();
	};
	
	this.setOffsetY = function($offsetY)
	{
		offsetY = $offsetY;
		updatePosition();
	};
	
	this.setDragModifier = function($dragModifier) { dragModifier = $dragModifier; };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodesPanel");