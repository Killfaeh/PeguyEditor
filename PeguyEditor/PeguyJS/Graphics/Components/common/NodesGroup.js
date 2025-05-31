function NodesGroup($label, $x, $y, $nodesList)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isGroup = true;
	
	var panelCode = '<g>'
						+ '<g id="linksGroup" ></g>'
						+ '<g id="nodesGroup" ></g>'
					+ '</g>';
	
	var panel = new Component(panelCode);
	
	var nodeItem = new NodeItem($label, $x, $y);
	
	var nodesList = $nodesList;
	var linksList = [];
	var inputNode = new NodeItem("Inputs", $x, $y);
	var outputNode = new NodeItem("Outputs", $x, $y);
	
	inputNode.addClass('groupInputNode');
	outputNode.addClass('groupOutputNode');
	
	//console.log(inputNode);
	
	// Calcul de la bounding box
	
	var boundingBox = { minX: 1000000000, maxX: -1000000000, minY: 1000000000, maxY: -1000000000};
	
	for (var i = 0; i < nodesList.length; i++)
	{
		if (nodesList[i].getX() < boundingBox.minX)
			boundingBox.minX = nodesList[i].getX();
		
		if (nodesList[i].getX() + nodesList[i].getWidth() > boundingBox.maxX)
			boundingBox.maxX = nodesList[i].getX() + nodesList[i].getWidth();
		
		if (nodesList[i].getY() < boundingBox.minY)
			boundingBox.minY = nodesList[i].getY();
		
		if (nodesList[i].getY() + nodesList[i].getHeight() > boundingBox.maxY)
			boundingBox.maxY = nodesList[i].getY() + nodesList[i].getHeight();
	}
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function()
	{
		inputNode.setParent($this);
		outputNode.setParent($this);
		
		panel.getById('nodesGroup').appendChild(inputNode);
		panel.getById('nodesGroup').appendChild(outputNode);
		
		// Déplacement des liens
		
		// Liens accrochés aux entrées
		
		for (var i = 0; i < nodesList.length; i++)
		{
			originalParent = nodesList[i].getParent();
			
			var inputs = nodesList[i].getInputs();
			
			for (var j = 0; j < inputs.length; j++)
			{
				var link = inputs[j].getLink();
				
				if (utils.isset(link))
				{
					var parentOuput = link.getParent();
					
					if (nodesList.indexOf(parentOuput.getParent()) >= 0)
					{
						parentOuput.getParent().getParent().removeLink(link);
						$this.addLink(link);
					}
					else
					{
						var innerOutput = new NodeOutput(parentOuput.getName(), parentOuput.getLabel(), parentOuput.getType(), parentOuput.getDefaultValue());
						inputNode.addOutput(innerOutput);
						var outerInput = new NodeInput(parentOuput.getName(), parentOuput.getLabel(), parentOuput.getType());
						$this.addInput(outerInput);
						
						innerOutput.setTwin(outerInput);
						outerInput.setTwin(innerOutput);
						
						var innerLink = new NodesLink(0, 0, 0, 0);
						var outerLink = new NodesLink(0, 0, 0, 0);
						
						innerOutput.addLink(innerLink);
						innerOutput.updateLinks();
						inputs[j].setLink(innerLink);
						inputs[j].updateLink();
						$this.addLink(innerLink);
						
						link.getParent().removeLink(link);
						parentOuput.addLink(outerLink);
						parentOuput.updateLinks();
						outerInput.setLink(outerLink);
						outerInput.updateLink();
						originalParent.addLink(outerLink);
					}
				}
			}
		}
		
		// Liens accrochés aux sorties
		
		for (var i = 0; i < nodesList.length; i++)
		{
			var outputs = nodesList[i].getOutputs();
			
			for (var j = 0; j < outputs.length; j++)
			{
				var links = [];
				
				for (var k = 0; k < outputs[j].getLinks().length; k++)
					links.push(outputs[j].getLinks()[k]);
				
				for (var k = 0; k < links.length; k++)
				{
					var link = links[k];
					
					if (linksList.indexOf(link) < 0)
					{
						var innerInput = new NodeInput(parentOuput.getName(), parentOuput.getLabel(), parentOuput.getType());
						outputNode.addInput(innerInput);
						var outerOutput = new NodeOutput(parentOuput.getName(), parentOuput.getLabel(), parentOuput.getType(), parentOuput.getDefaultValue());
						$this.addOutput(outerOutput);
						
						innerInput.setTwin(outerOutput);
						outerOutput.setTwin(innerInput);
						
						var linkParent = links[k].getParent();
						linkParent.removeLink(link);
						outerOutput.addLink(link);
						outerOutput.updateLinks();
						
						var innerLink = new NodesLink(0, 0, 0, 0);
						linkParent.addLink(innerLink);
						linkParent.updateLinks();
						innerInput.setLink(innerLink);
						innerInput.updateLink();
						$this.addLink(innerLink);
					}
				}
			}
		}
		
		// Déplacement des noeuds
		
		var originalParent = null;
		
		for (var i = 0; i < nodesList.length; i++)
		{
			originalParent = nodesList[i].getParent();
			originalParent.removeNode(nodesList[i]);
			panel.getById('nodesGroup').appendChild(nodesList[i]);
			nodesList[i].setParent($this);
		};
		
		// Repositionnement des noeuds d'entrée et de sortie
		
		inputNode.setX(boundingBox.minX - 3.0*inputNode.getWidth());
		inputNode.setY((boundingBox.minY + boundingBox.maxY)/2.0 - inputNode.getHeight()/2.0);
		
		outputNode.setX(boundingBox.maxX + 2.0*outputNode.getWidth());
		outputNode.setY((boundingBox.minY + boundingBox.maxY)/2.0 - outputNode.getHeight()/2.0);
		
		$this.setX((boundingBox.minX + boundingBox.maxX)/2.0 - $this.getWidth()/2.0);
		$this.setY((boundingBox.minY + boundingBox.maxY)/2.0 - $this.getHeight()/2.0);
		
		$this.unselectAll();
	};
	
	this.ungroup = function()
	{
		// Déplacement des noeuds
		
		var currentParent = null;
		
		for (var i = 0; i < nodesList.length; i++)
		{
			currentParent = nodesList[i].getParent();
			$this.getParent().addNode(nodesList[i]);
			nodesList[i].setParent($this.getParent());
		}
		
		// Liens intérieurs
		
		for (var i = 0; i < nodesList.length; i++)
		{
			var inputs = nodesList[i].getInputs();
			
			for (var j = 0; j < inputs.length; j++)
			{
				var link = inputs[j].getLink();
				
				if (utils.isset(link))
				{
					var parentNode = link.getParent().getParent();
					
					if (parentNode !== inputNode)
						$this.getParent().addLink(link);
				}
			}
		}
		
		// Liens accrochés au noeud d'entrée
		
		var inputNodeOutputs = inputNode.getOutputs();
		
		for (var i = 0; i < inputNodeOutputs.length; i++)
		{
			var twin = inputNodeOutputs[i].getTwin();
			
			var links = inputNodeOutputs[i].getLinks();
			var twinLink = twin.getLink();
			
			var twinParent = twinLink.getParent();
			
			for (var j = 0; j < links.length; j++)
			{
				twinParent.addLink(links[j]);
			}
			
			twinParent.removeLink(twinLink);
			
			if (utils.isset(twinLink.parentNode))
				twinLink.parentNode.removeChild(twinLink);
			
			for (var j = 0; j < links.length; j++)
			{
				if (utils.isset(links[j].parentNode))
					links[j].parentNode.removeChild(links[j]);
				
				$this.getParent().addLink(links[j]);
			}
			
			twinParent.updateLinks();
		}
		
		// Liens accrochés au noeud de sortie
		
		var outputNodeInputs = outputNode.getInputs();
		
		for (var i = 0; i < outputNodeInputs.length; i++)
		{
			var twin = outputNodeInputs[i].getTwin();
			
			var link = outputNodeInputs[i].getLink();
			var twinLinks = twin.getLinks();
			
			var parent = link.getParent();
			
			for (var j = 0; j < twinLinks.length; j++)
			{
				var twinParent = twinLinks[j].getParent();
				
				parent.addLink(twinLinks[j]);
				twinParent.removeLink(twinLinks[j]);
				
			}
			
			parent.removeLink(link);
			
			if (utils.isset(link.parentNode))
				link.parentNode.removeChild(link);
			
			parent.updateLinks();
		}
		
		currentParent.removeAllNode();
		currentParent.removeAllLinks();
		
		Events.emit('onUngroupNode', [$this]);
	};
	
	var onUngroup = function($groupNode)
	{
		$this.removeNode($groupNode);
		$this.unselectAll();
		$this.updateLinks();
	};
	
	this.unselectAll = function()
	{
		for (var i = 0; i < nodesList.length; i++)
		{
			nodesList[i].unselect();
			
			if (nodesList[i].isGroup === true)
				nodesList[i].unselectAll();
		}
		
		inputNode.unselect();
		outputNode.unselect();
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
		
		panel.getById('nodesGroup').appendChild($node);
		
		$node.onDrag = function($x, $y) { return onDragTab($x, $y, $node); };
		$node.onRelease = function($node2, $index) { return onRelease($node2, $index); };
		$this.unselectAll();
		$node.select();
		
		if ($node.isGroup === true)
			Events.emit('onAddNodesGroup', [$node]);
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
		panel.getById('nodesGroup').removeAllChildren();
		selected = null;
	};
	
	//// Gestion des liens ////
	
	this.addLink = function($link)
	{
		var index = linksList.indexOf($link);
		
		if (index < 0)
			linksList.push($link);
		
		panel.getById('linksGroup').appendChild($link);
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
		panel.getById('linksGroup').removeAllChildren();
	};
	
	this.updateLinks = function()
	{
		for (var i = 0; i < nodesList.length; i++)
		{
			if (utils.isset(nodesList[i].updateLinks))
				nodesList[i].updateLinks();
		}
		
		this.execSuper('updateLinks', []);
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	nodeItem.connect('onUngroupNode', onUngroup);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getNodesList = function()
	{
		var nodesToReturn = [];
		
		for (var i = 0; i < nodesList.length; i++)
			nodesToReturn.push(nodesList[i]);
		
		nodesToReturn.push(inputNode);
		nodesToReturn.push(outputNode);
		
		return nodesToReturn;
	};
	
	this.getSelected = function()
	{
		var selectedNodes = [];
		
		for (var i = 0; i < nodesList.length; i++)
		{
			if (nodesList[i].isSelected())
				selectedNodes.push(nodesList[i]);
		}
		
		return selectedNodes;
	};
	
	this.getPanel = function() { return panel; };
	
	this.getMousePosition = function($event) { return $this.getParent().getMousePosition($event); };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(nodeItem, this);
	$this.init();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("nodesGroup");