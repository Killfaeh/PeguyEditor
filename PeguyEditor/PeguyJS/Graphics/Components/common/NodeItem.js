function NodeItem($label, $x, $y)
{
	///////////////
	// Attributs //
	///////////////
	
	var parent = null;
	
	var label = $label;
	var x = $x;
	var y = $y;
	
	var g = new Component('<g class="nodeItem" ></g>');
	
	var htmlPanel = '<div xmlns="http://www.w3.org/1999/xhtml" >'
						+ '<div id="nodePanel" class="nodePanel" >'
							+ '<div id="label" class="nodeLabel" >' + label + '</div>'
						+ '</div>'
					+ '</div>';
	
	var htmlLists = '<div xmlns="http://www.w3.org/1999/xhtml" id="lists" class="lists" >'
						+ '<ul id="inputs" class="nodeInputs" ></ul>'
						+ '<ul id="outputs" class="nodeOutputs" ></ul>'
				+ '</div>';
	
	var panelNode = new SVGhtml(200, 150, htmlPanel);
	var listsNode = new SVGhtml(200, 150, htmlLists);
	
	g.appendChild(panelNode);
	g.appendChild(listsNode);

	g.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
	
	panelNode.getById('label').onToolTip = label;
	
	var dictInputs = {};
	var dictOutputs = {};
	var inputs = [];
	var outputs = [];
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.select = function()
	{
		panelNode.addClass('selected');
		Events.emit('onSelectNode', [$this]);
	};
	
	this.unselect = function()
	{
		panelNode.removeClass('selected');
		Events.emit('onSelectNode', [$this]);
	};
	
	//// Gestion des entrées ////
	
	this.addInput = function($input)
	{
		var index = inputs.indexOf($input);
		
		if (index < 0)
		{
			dictInputs[$input.getName()] = $input;
			inputs.push($input);
			$input.setParent($this);
		}
		
		listsNode.getById('inputs').appendChild($input);
		
		updateSize();
	};
	
	this.removeInput = function($input)
	{
		delete dictInputs[$input.getName()];
		
		var index = inputs.indexOf($input);
		
		if (index >= 0)
			inputs.splice(index, 1);
		
		if (utils.isset($input.parentNode))
			$input.parentNode.removeChild($input);
		
		updateSize();
	};
	
	this.removeAllInputs = function()
	{
		dictInputs = {};
		inputs = [];
		listsNode.getById('inputs').removeAllChildren();
		updateSize();
	};
	
	//// Gestion des sorties ////
	
	this.addOutput = function($output)
	{
		var index = outputs.indexOf($output);
		
		if (index < 0)
		{
			dictOutputs[$output.getName()] = $output;
			outputs.push($output);
			$output.setParent($this);
		}
		
		listsNode.getById('outputs').appendChild($output);
		
		updateSize();
	};
	
	this.removeOutput = function($output)
	{
		delete dictOutputs[$output.getName()];
		
		var index = outputs.indexOf($output);
		
		if (index >= 0)
			outputs.splice(index, 1);
		
		if (utils.isset($output.parentNode))
			$output.parentNode.removeChild($output);
		
		updateSize();
	};
	
	this.removeAllOutputs = function()
	{
		dictOutputs = {};
		Outputs = [];
		listsNode.getById('outputs').removeAllChildren();
		updateSize();
	};
	
	//// Exécution de l'opération du noeud ////
	
	this.execute = function() { return null; }; // A surcharger
	
	//// Position et dimensions ////
	
	var updatePosition = function()
	{
		g.setAttributeNS(null, "transform", "translate(" + x + "," + y + ")");
		
		for (var i = 0; i < inputs.length; i++)
		{
			if (utils.isset(inputs[i].updateLink))
				inputs[i].updateLink();
		}
		
		for (var i = 0; i < outputs.length; i++)
		{
			if (utils.isset(outputs[i].updateLinks))
				outputs[i].updateLinks();
		}
	};
	
	var updateSize = function()
	{
		var listsHeight = listsNode.getById('lists').offsetHeight;
		var height = listsHeight + 10;
		panelNode.getById('nodePanel').style.height = listsHeight + 'px';
		panelNode.setHeight(height);
		listsNode.setHeight(height);
	};
	
	this.autoResize = function()
	{
		var width = listsNode.getById('lists').offsetWidth;
		var height = listsNode.getById('lists').offsetHeight;
		
		if (width > 0)
		{
			x = x - width/2;
			y = y - height/2;
			updatePosition();
			updateSize();
		}
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	this.updateLinks = function() { updatePosition(); };
	
	var stopDragging = function() { dragging = false; };
	
	var isVertexInRect = function($x, $y, $rect)
	{
		var isInRect = false;
		
		var rectX = parseInt($rect.getAttributeNS(null, 'x'));
		var rectY = parseInt($rect.getAttributeNS(null, 'y'));
		var rectWidth = parseInt($rect.getAttributeNS(null, 'width'));
		var rectHeight = parseInt($rect.getAttributeNS(null, 'height'));
		
		if ($x >= rectX && $x <= rectX + rectWidth && $y >= rectY && $y <= rectY + rectHeight)
			isInRect = true;
		
		return isInRect;
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	listsNode.onClick = function($event)
	{
		if (moved === false)
		{
			if (Events.keyPressTable['shift'] !== true)
				parent.unselectAll();
			
			$this.select();
		}
	};
	
	var onMouseDown = function($event)
	{
		if ($this.isSelected() === true)
		{
			dragging = true;
			
			var mousePosition = parent.getMousePosition($event);
			
			startX = mousePosition.x;
			startY = mousePosition.y;
			offsetX = mousePosition.x - x;
			offsetY = mousePosition.y - y;
		}
		
		//$this.focus();
	};
	
	listsNode.onMouseDown = function($event)
	{
		if (utils.isset(parent))
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
			{
				if ($this.isSelected() !== true)
				{
					parent.unselectAll();
					$this.select();
				}
				
				Events.emit('onMouseDownOnNode', [$event]);
			}
		}
		
		return false;
	};
	
	//// Déplacement de l'élément ////
	
	var onMouseMove = function($event)
	{
		if (dragging === true)
		{
			moved = true;
			Events.preventDefault($event);
			var mousePosition = parent.getMousePosition($event);
			x = mousePosition.x - offsetX;
			y = mousePosition.y - offsetY;
			updatePosition();
		}
		
		for (var i = 0; i < inputs.length; i++)
		{
			if (utils.isset(inputs[i].mouseMove))
				inputs[i].mouseMove($event);
		}
		
		for (var i = 0; i < outputs.length; i++)
		{
			if (utils.isset(outputs[i].mouseMove))
				outputs[i].mouseMove($event);
		}
	};
	
	this.mouseMove = onMouseMove;
	
	//// Relâcher l'élément ////
	
	var onMouseUp = function($event)
	{
		if (dragging === true)
		{
			dragging = false;
		}
		
		for (var i = 0; i < inputs.length; i++)
		{
			if (utils.isset(inputs[i].mouseUp))
				inputs[i].mouseUp($event);
		}
		
		for (var i = 0; i < outputs.length; i++)
		{
			if (utils.isset(outputs[i].mouseUp))
				outputs[i].mouseUp($event);
		}
		
		setTimeout(function() { moved = false; }, 20);
	};
	
	this.mouseUp = onMouseUp;
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
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
	
	listsNode.connect('onReleaseOnInput', stopDragging);
	listsNode.connect('onReleaseOnOutput', stopDragging);
	listsNode.connect('onMouseDownOnNode', onMouseDown);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getParent = function() { return parent; };
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getWidth = function() { return panelNode.getWidth(); };
	this.getHeight = function() { return panelNode.getHeight(); };
	this.getInputs = function() { return inputs; };
	this.getInput = function($name) { return dictInputs[$name]; };
	this.getOutputs = function() { return outputs; };
	this.getOutput = function($name) { return dictOutputs[$name]; };
	
	this.isInSelectRect = function($selectRect)
	{
		var isInSelectRect = false;
		
		var width = parseInt(listsNode.getWidth());
		var height = parseInt(listsNode.getHeight());
		
		var vertex1 = { x: x, y: y };
		var vertex2 = { x: x+width, y: y };
		var vertex3 = { x: x+width, y: y+height };
		var vertex4 = { x: x, y: y+height };
		
		if (isVertexInRect(vertex1.x, vertex1.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(vertex2.x, vertex2.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(vertex3.x, vertex3.y, $selectRect) === true)
			isInSelectRect = true;
		
		if (isVertexInRect(vertex4.x, vertex4.y, $selectRect) === true)
			isInSelectRect = true;
		
		return isInSelectRect;
	};
	
	this.isSelected = function() { return panelNode.isClass('selected'); };
	
	// SET
	
	this.setParent = function($parent) { parent = $parent; };
	
	this.setLabel = function($label)
	{
		label = $label;
		panelNode.getById('label').innerHTML = label;
		panelNode.getById('label').onToolTip = label;
	};
	
	this.setX = function($x)
	{
		x = $x;
		updatePosition();
	};
	
	this.setY = function($y)
	{
		y = $y;
		updatePosition();
	};
	
	this.setOutput = function($name, $value)
	{
		if (utils.isset(dictOutputs[$name]))
			dictOutputs[$name].setValue($value);
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(g, this);
	this.autoResize();
	//console.log($this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodeItem");