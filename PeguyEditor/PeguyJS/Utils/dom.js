///////////////////////////////
//// Gestion des attributs ////
/////////////////////////////// 

// Récupération des attributs 
Node.prototype.get = function($name)
{
	var value = null; 
	
	// Cas particuliers en fonction des navigateurs 
	if ($name === "textContent") 
	{
		var textContent = ""; 
		
		if (this.textContent)
			textContent = this.textContent; 
		else 
			textContent = this.innerText; 
		
		value = textContent; 
	}
	// Cas innerHTML
	else if ($name === "innerHTML")
		value = this.innerHTML; 
	// Cas value
	else if ($name === "value")
		value = this.value; 
	// Cas standard
	else 
		value = this.getAttribute($name); 
	
	return value; 
}; 

// Affectation d'une valaur à un attribut 
Node.prototype.set = function($name, $value)
{
	// Cas particuliers en fonction des navigateurs 
	if ($name === "textContent") 
	{
		if (this.textContent)
			this.textContent = $value; 
		else 
			this.innerText = $value; 
	}
	// Cas innerHTML
	else if ($name === "innerHTML")
		this.innerHTML = $value; 
	// Cas value
	else if ($name === "value")
		this.value = $value; 
	// Tous les cas normaux 
	else
		this.setAttribute($name, $value); 
}; 

//////////////////////////////
// Manipulation des classes //
//////////////////////////////

// Vérifier si un élément appartient à une classe ou non 
Node.prototype.isClass = function($name)
{
	var isClass = false;
	var className = "";
	
	if (utils.isset(this.getAttribute))
		className = this.getAttribute('class');
	else if (utils.isset(this.getAttributeNS))
		className = this.getAttributeNS(null, 'class');
	
	if (utils.isset(className))
	{
		var classes = className.split(" ");
	
		for (var i = 0; i < classes.length; i++)
		{
			if($name === classes[i])
				isClass = true;
		}
	}

	return isClass;
};

// Ajouter une classe à un élément 
Node.prototype.addClass = function($name)
{
	var className = "";
	
	if (utils.isset(this.getAttribute))
		className = this.getAttribute('class');
	else if (utils.isset(this.getAttributeNS))
		className = this.getAttributeNS(null, 'class');
	
	if (utils.isset(className) && className !== "")
	{
		var newClass = className;
		
		if (utils.isset($name) && $name !== "" && !this.isClass($name))
			newClass = className + " " + $name;
		
		newClass = newClass.replace(/^ /, '');
		
		if (utils.isset(this.setAttribute))
			this.setAttribute('class', newClass);
		else if (utils.isset(this.setAttributeNS))
			this.setAttributeNS(null, 'class', newClass);
	}
	else
	{
		if (utils.isset(this.setAttribute))
			this.setAttribute('class', $name);
		else if (utils.isset(this.setAttributeNS))
			this.setAttributeNS(null, 'class', $name);
	}
};

// Supprimer une classe d'un élément 
Node.prototype.removeClass = function($name)
{
	var className = "";
	
	if (utils.isset(this.getAttribute))
		className = this.getAttribute('class');
	else if (utils.isset(this.getAttributeNS))
		className = this.getAttributeNS(null, 'class');
	
	if (utils.isset(className) && className !== "")
	{
		var classes = className.split(" "); 
	
		if (utils.isset(this.setAttribute))
			this.setAttribute('class', '');
		else if (utils.isset(this.setAttributeNS))
			this.setAttributeNS(null, 'class', '');
	
		for (var i = 0; i < classes.length; i++)
		{
			if ($name !== classes[i])
				this.addClass(classes[i]); 
		}
	}
};

///////////////////////////
// Manipulation du style //
///////////////////////////

// Récupération du style 
Node.prototype.getStyle = function($name)
{
	var value = null; 
	
	//console.log(window.getComputedStyle(this, null));
	
	if (window.getComputedStyle)
		value = window.getComputedStyle(this, null).getPropertyValue($name);
	else if (this.currentStyle)
		value =  this.currentStyle[$name]; //IE
	
	return value;
}; 

// Affectation d'un style
Node.prototype.setStyle = function($name, $value)
{
	// Opacité 
	if ($name === 'opacity')
	{
		if ($value < 0)
			$value = 0; 
		else if ($value > 1)
			$value = 1; 
		
		this.style.filter = "alpha(opacity=" + ($value*100) + ")"; // Cas IE
		this.style.opacity = $value; // Cas usuel
	}
	// Ascenseurs
	else if ($name === 'overflow' && this.tagName.toLowerCase() === 'body')
	{
		this.style.overflow = $value; 
		
		var element = this; 
		
		while (element)
		{
			if (element.tagName.toLowerCase() === 'html')
			{
				element.style.overflow = $value; 
				element = null; 
			}
			else
				element = element.parentNode; 
		}
	}
	// Cas par défaut
	else
		this.style[$name] = $value; 
};

// Copier le style sur un autre noeud
Node.prototype.copyStyleTo = function($target)
{
	var styles = null;
	
	if (window.getComputedStyle)
		styles = window.getComputedStyle(this, null);
	else if (this.currentStyle)
		styles = this.currentStyle; //IE
	
	if (utils.isset(styles))
	{
		for (var i = 0; i < styles.length; i++)
		{
			if (window.getComputedStyle)
				$target.style[styles[i]] = window.getComputedStyle(this, null).getPropertyValue(styles[i]);
			else
				$target.currentStyle[styles[i]] = this.currentStyle[styles[i]];
		}
	}
};

/////////////////////////////
// Manipulation des noeuds //
/////////////////////////////

// Récupérer tous les éléments d'une classe donnée 
Node.prototype.getElementsByClassName = function($name) 
{
	var elementsPage = this.getElementsByTagName("*"); 
	var elementsClass = new Array(); 
		
	for (var i = 0; i < elementsPage.length; i++)
	{
		if(elementsPage[i].isClass($name))
			elementsClass.push(elementsPage[i]);  
	}
		
	return elementsClass; 
};

// Récupérer tous les élément parmis une liste de types
Node.prototype.getElementsByTagNames = function($tagNames)
{
	var nodesToReturn = [];
	
	for (var i = 0; i < $tagNames.length; i++)
	{
		var nodes = this.getElementsByTagName($tagNames[i]);
		
		for (var j = 0; j < nodes.length; j++)
			nodesToReturn.push(nodes[j]);
	}
	
	return nodesToReturn;
};

// Supprimer tous les noeuds enfants
Node.prototype.removeAllChildren = function()
{
	while (this.firstChild)
		this.removeChild(this.firstChild); 
};

Node.prototype.empty = function()
{
	while (this.firstChild)
		this.removeChild(this.firstChild); 
};

// Insérer un élément après un autre 
Node.prototype.insertAfter = function($nodeToInsert, $refNode) 
{
	if($refNode.nextSibling) 
	{
		return this.insertBefore($nodeToInsert, $refNode.nextSibling);
	} 
	else 
	{
		return this.appendChild($nodeToInsert);
	}
}; 

// Insérer un élément à une position précise 
Node.prototype.insertAt = function($element, $index)
{
	if ($element.parentNode !== this)
	{
		if ((this.childNodes.length !== 0) && ($index < this.childNodes.length))
			this.insertBefore($element, this.childNodes[$index]); 
		else 
			this.appendChild($element); 
	}
};

// Récupérer l'index du noeud
Node.prototype.index = function()
{
	var i = 0;
	var previousSibling = this.previousSibling;
	
	while (utils.isset(previousSibling))
	{
		i++;
		previousSibling = previousSibling.previousSibling;
	}

	return i;
};

/////////////
// Clonage //
/////////////

// Cloner une arborescence 
Node.prototype.clone = function()
{
	var clone;
	
	if (this.tagName !== undefined)
	{
		// Création du clone
		clone = document.createElement(this.tagName);
		
		// Attributs du noeuds
		var attributes = this.attributes;
		
		//console.log(this.attributes);
		
		for (var i = 0; i < attributes.length; i++)
			clone.setAttribute(attributes[i].name, this.getAttribute(attributes[i].name));
		
		// Parcours des enfants du noeud
		var children = this.childNodes;
	
		for (var i = 0; i < children.length; i++)
		{
			console.log(children[i].tagName);
			console.log(children[i].nodeType);
			
			clone.appendChild(children[i].clone());
			
			/*
			if (utils.isset(children[i].clone))
				clone.appendChild(children[i].clone());
			else
				clone.appendChild(children[i].cloneNode(true));
			//*/
		}
	}
	else 
		clone = document.createTextNode(this.nodeValue);
	
	return clone;
};

// Cloner une arborescence en vu d'en faire une capture
Node.prototype.cloneForScreenshot = function()
{
	var clone;
	
	if (this.tagName !== undefined)
	{
		// Création du clone
		if (this.tagName === 'input' || this.tagName === 'INPUT')
		{
			clone = document.createElement('div');
			clone.appendChild(document.createTextNode(this.value));
		}
		else
			clone = document.createElement(this.tagName);
		
		// Attributs du noeuds
		var attributes = this.attributes;
		
		for (var i = 0; i < attributes.length; i++)
			clone.setAttribute(attributes[i].name, this.getAttribute(attributes[i].name));
		
		// Styles du noeud
		this.copyStyleTo(clone);
		
		if (this.tagName === 'input' || this.tagName === 'INPUT')
		{
			clone.style.display = 'table-cell';
			clone.style.verticalAlign = 'middle';
		}
		
		// Parcours des enfants du noeud
		var children = this.childNodes;
	
		for (var i = 0; i < children.length; i++)
		{
			if (utils.isset(children[i].cloneForScreenshot))
				clone.appendChild(children[i].cloneForScreenshot());
			else
				clone.appendChild(children[i].cloneNode(true));
		}
	}
	else 
		clone = document.createTextNode(this.nodeValue);
	
	return clone;
};

// Faire une capture bitmap du noeud
Node.prototype.capture = function($width, $height, $callback, $backgroundColor)
{
	var $this = this;
	
	var allTags = $this.getElementsByTagName('*');
	console.log("Number of tags to screenshot : " + allTags.length);
	
	setTimeout(function()
	{
		var backgroundColor = $backgroundColor;
		
		if (!utils.isset(backgroundColor))
			backgroundColor = 'rgb(255, 255, 255)';
		
		console.log("Screenshot...");
		
		var cloneForScreenshot = $this.cloneForScreenshot();
		
		var code = '<div style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;" >'
						+ cloneForScreenshot.innerHTML.replaceAll('&nbsp;', ' ')
					+ '</div>';
		
		var svgHTML = new SVGhtml($width, $height, '');
		svgHTML.innerHTML = code;
		
		var svg = new SVG($width, $height, '<rect x="0" y="0" width="' + $width + '" height="' + $height + '" style="fill:' + backgroundColor + ';" />');
		
		svg.appendChild(svgHTML);
		
		/*
		// Débugage
		svg.style.position = "absolute";
		svg.style.left = "0px";
		svg.style.top = "0px";
		svg.style.zIndex = "10000000000000000000";
		document.getElementById('main').appendChild(svg);
		//*/
		
		svg.toBitmap(function($img)
		{
			console.log("End screenshot");
			$callback($img);
		});
		
	}, 50);
};

////////////////////////////
// Gestion des événements //
////////////////////////////

const originalEventListener = document.addEventListener;

document.addEventListener = function(a, b)
{
	if (b.toString().indexOf("messageHandlers.fb_getSelection") > -1)
	{
		return null;
	}
	
	return originalEventListener.apply(this, arguments);
};

// Attacher un événement 
Node.prototype.addEvent = function($event, $function)
{
	var node; 
	
	if (this === document.getElementsByTagName('BODY')[0])
		node = document; 
	else 
		node = this; 
	
	// Cas particulier de la molette 
	if ($event === 'mousewheel')
	{
		// Firefox Safari 
		if (node.addEventListener)
		{
			node.addEventListener("mousewheel", $function, true);
			node.addEventListener('DOMMouseScroll', $function, true);
		}
		// IE Opera 
		else 
			node.onmousewheel = $function;
		//window.onmousewheel = document.onmousewheel = $function;
	}
	// Les autres cas 
	else
	{
		// Cas IE 
		if( node.attachEvent)
			node.attachEvent('on' + $event, $function);
		// Le reste 
		else
			node.addEventListener($event, $function, true);
	}
	
	if (!utils.isset(this.events))
		this.events = new Array(); 
	
	this.events.push({event: $event, func: $function}); 
}; 

// Détacher un événement 
Node.prototype.removeEvent = function($event, $function)
{
	var node; 
	
	if (this === document.getElementsByTagName('BODY')[0])
		node = document; 
	else 
		node = this; 
	
	// Cas particulier de la molette 
	if ($event === 'mousewheel')
	{
		// Firefox Safari 
		if (node.removeEventListener)
		{
			node.removeEventListener("mousewheel", $function, true);
			node.removeEventListener('DOMMouseScroll', $function, true);
		}
		// IE Opera 
		else 
			node.onmousewheel = null;
		//window.onmousewheel = document.onmousewheel = null;
	}
	// Les autres cas 
	else
	{
		// Cas IE 
		if( node.detachEvent)
			node.detachEvent('on' + $event, $function);
		// Le reste 
		else
			node.removeEventListener($event, $function, true);
	}
}; 

// Supprimer tous les événements 
Node.prototype.removeAllEvents = function()
{
	if (utils.isset(this.events))
	{
		for (var i = 0; i < this.events.length; i++)
			this.removeEvent(this.events[i].event, this.events[i].func); 
	}
};

//Déterminer la position du noeud dans l'écran 
Node.prototype.position = function()
{
	var element = this;
	var x 		= 0;
	var y 		= 0;
	var scrollX = 0;
	var scrollY = 0;

	//console.log("Node position : " + element.tagName); 
	
	do
	{
		var rect = element.getBoundingClientRect();
		
		//console.log(element);
		//console.log("Position : " + element.offsetLeft + ", " + element.offsetTop);
		//console.log(rect);
		
		//x += rect.x;
		//y += rect.y;
		
		//*
		if (utils.isset(element.offsetLeft))
			x += element.offsetLeft;
		else
			x += rect.x;
		
		if (utils.isset(element.offsetTop))
			y += element.offsetTop;
		else
			y += rect.y;
		//*/
		
		if (utils.isset(element.scrollLeft))
			scrollX += element.scrollLeft;
		
		if (utils.isset(element.scrollTop))
			scrollY += element.scrollTop;
		
		element = element.offsetParent;
	}
	while (utils.isset(element) && utils.isset(element.tagName));

	x -= scrollX;
	y -= scrollY;
	
	//console.log("	Position finale : " + eX + ", " + eY); 
	
	return { 'x': x, 'y': y };
};

//Déterminer la position de la souris sur l'écran'
Node.prototype.mousePosition = function($event)
{
	var element = this;
	var x 		= $event.clientX;
	var y 		= $event.clientY;
	var scrollX = 0;
	var scrollY = 0;

	//console.log("Node position : " + element.tagName); 
	
	do
	{
		//console.log("Position : " + element.offsetLeft + ", " + element.offsetTop);
		/*
		var rect = element.getBoundingClientRect();
		
		if (utils.isset(element.offsetLeft))
			x += element.offsetLeft;
		else
			x += rect.x;
		
		if (utils.isset(element.offsetTop))
			y += element.offsetTop;
		else
			y += rect.y;
		//*/
		
		if (utils.isset(element.scrollLeft))
			scrollX += element.scrollLeft;
		
		if (utils.isset(element.scrollTop))
			scrollY += element.scrollTop;
		
		//element = element.offsetParent;
		element = element.parent;
	}
	while (utils.isset(element) && utils.isset(element.tagName));

	x -= scrollX;
	y -= scrollY;
	
	//console.log("	Position finale : " + eX + ", " + eY); 
	
	return { 'x': x, 'y': y };
};

// Déterminer si le curseur se trouve sur le noeud ou non
//Node.prototype.isMouseOver = function($event)
Node.prototype.isMouseOver = function()
{
	var mouseOver = false; 	
	var nodePosition = this.position(); 

	/*
	if (	$event.mouseX($event) >= nodePosition.x 
		&& 	$event.mouseX($event) <= nodePosition.x + this.offsetWidth 
		&&  $event.mouseY($event) >= nodePosition.y 
		&& 	$event.mouseY($event) <= nodePosition.y + this.offsetHeight)
		mouseOver = true;
	//*/
	
	if (	Events.mouseX >= nodePosition.x 
		&&  Events.mouseX <= nodePosition.x + this.offsetWidth 
		&&  Events.mouseY >= nodePosition.y 
		&&  Events.mouseY <= nodePosition.y + this.offsetHeight)
		mouseOver = true;
	
	return mouseOver; 
};

// Déterminer si le noeud en paramètre se trouve dans l'arborescence du noeud courant
Node.prototype.containsInChildren = function($node)
{
	var contains = false;
	
	if (utils.isset($node))
	{
		var parentNode = $node.parentNode;
		
		while (utils.isset(parentNode))
		{
			if (parentNode === this)
			{
				contains = true;
				parentNode = null;
			}
			else
				parentNode = parentNode.parentNode;
		}
	}
	
	return contains;
};

// Permettre de glisser déposer un noeud
// /!\ A compléter, ne gère que le SVG pour le moment /!\
Node.prototype.makeDraggable = function()
{
	var mouseDown = false;
	var dragged = null;
	var offsetX = 0;
	var offsetY = 0;
	var deltaX = 0;
	var deltaY = 0;
	var ratio = 1.0;

	var initMove = function($event)
	{
		if (utils.isset(dragged.getAttributeNS))
		{
			var originalWidth = 1000;

			var parentNode = $event.target.parentNode;

			while (parentNode.tagName.toLowerCase() !== 'svg')
				parentNode = parentNode.parentNode;
			
			var viewBox = parentNode.getAttribute('viewBox');
			viewBoxArray = viewBox.split(' ');

			originalWidth = parseInt(viewBoxArray[2]);

			var bounds = $event.target.parentNode.getBoundingClientRect();
			console.log(bounds);

			ratio = originalWidth/bounds.width;
			console.log(ratio);
			console.log($event.clientX);
			console.log($event.clientY);

			var x = $event.clientX - bounds.left;
			var y = $event.clientY - bounds.top;
			offsetX = x;
			offsetY = y;
			deltaX = parseInt(dragged.getAttributeNS(null, "x")/ratio) - x;
			deltaY = parseInt(dragged.getAttributeNS(null, "y")/ratio) - y;
			console.log(offsetX);
			console.log(offsetY);
			console.log(deltaX);
			console.log(deltaY);
			mouseDown = true;
		}
	};

	this.onmousedown = function($event)
	{
		dragged = this;
		initMove($event);
	};

	document.getElementById('main').onMouseMove.push(function($event)
	{
		if (mouseDown === true)
		{
			var bounds = $event.target.parentNode.getBoundingClientRect();
			
			var mouseX = $event.clientX - bounds.left;
			var mouseY = $event.clientY - bounds.top;
			
			var x = mouseX + deltaX;
			var y = mouseY + deltaY;

			dragged.setAttributeNS(null, "x", parseInt(x*ratio));
			dragged.setAttributeNS(null, "y", parseInt(y*ratio));

			if (utils.isset(dragged.onMove))
				dragged.onMove($event);
		}
	});

	document.getElementById('main').onMouseUp.push(function($event) { mouseDown = false; });
};

//////////////////////////
// Mécanisme de signaux //
//////////////////////////

Node.prototype.emit =  function($eventName, $args) { Events.emit($eventName, $args); };

Node.prototype.connect =  function($eventName, $function)
{
	Events.connect($eventName, $function, this);
	
	if (!utils.isset(this.signals))
		this.signals = {};
	
	if (!utils.isset(this.signals[$eventName]))
		this.signals[$eventName] = [];
	
	var index = this.signals[$eventName].indexOf($function);
	
	if (index < 0)
		this.signals[$eventName].push($function);
};

Node.prototype.reconnectAll = function()
{
	if (utils.isset(this.signals))
	{
		for (var eventName in this.signals)
		{
			for (var i = 0; i < this.signals[eventName].length; i++)
				Events.connect(eventName, this.signals[eventName][i], this);
		}
	}
};

Node.prototype.reconnectChildren = function()
{
	var childNodes = this.childNodes;
	
	for (var i = 0; i < childNodes.length; i++)
	{
		if (utils.isset(childNodes[i].reconnectAll))
			childNodes[i].reconnectAll();
		
		if (utils.isset(childNodes[i].reconnectChildren))
			childNodes[i].reconnectChildren();
	}
};

Node.prototype.unconnect =  function($eventName, $function) { Events.unconnect($eventName, $function); };

Node.prototype.unconnectAll = function()
{
	//console.log("Unconnect all");
	
	if (utils.isset(this.signals))
	{
		for (var eventName in this.signals)
		{
			//console.log("Unconnect : " + eventName);
			
			for (var i = 0; i < this.signals[eventName].length; i++)
				Events.unconnect(eventName, this.signals[eventName][i]);
		}
	}
};

Node.prototype.unconnectChildren = function()
{
	var childNodes = this.childNodes;
	
	for (var i = 0; i < childNodes.length; i++)
	{
		if (utils.isset(childNodes[i].unconnectAll))
			childNodes[i].unconnectAll();
		
		if (utils.isset(childNodes[i].unconnectChildren))
			childNodes[i].unconnectChildren();
	}
};

Node.prototype.onAppendChildren = function()
{
	var childNodes = this.childNodes;
	
	for (var i = 0; i < childNodes.length; i++)
	{
		if (utils.isset(childNodes[i].onAppend))
			childNodes[i].onAppend();
		
		if (utils.isset(childNodes[i].reconnectAll))
			childNodes[i].reconnectAll();
		
		if (utils.isset(childNodes[i].onAppendChildren))
			childNodes[i].onAppendChildren();
	}
};

Node.prototype.onRemoveChildren = function()
{
	var childNodes = this.childNodes;
	
	for (var i = 0; i < childNodes.length; i++)
	{
		if (utils.isset(childNodes[i].onRemove))
			childNodes[i].onRemove();
		
		if (utils.isset(childNodes[i].unconnectAll))
			childNodes[i].unconnectAll();
		
		if (utils.isset(childNodes[i].onRemoveChildren))
			childNodes[i].onRemoveChildren();
	}
};

Node.prototype.OriginalAppendChild = Node.prototype.appendChild;
Node.prototype.OriginalRemoveChild = Node.prototype.removeChild;
Node.prototype.OriginalInsertBefore = Node.prototype.insertBefore;

Node.prototype.appendChild = function($node)
{
	this.OriginalAppendChild($node);
	
	if (utils.isset($node.onAppend))
		$node.onAppend();

	if (utils.isset($node.reconnectAll))
		$node.reconnectAll();
	
	if (utils.isset($node.reconnectChildren))
		$node.reconnectChildren();

	if (utils.isset($node.onAppendChildren))
		$node.onAppendChildren();
};

Node.prototype.insertBefore = function($node, $nextNode)
{
	this.OriginalInsertBefore($node, $nextNode);
	
	if (utils.isset($node.onAppend))
		$node.onAppend();

	if (utils.isset($node.reconnectAll))
		$node.reconnectAll();
	
	if (utils.isset($node.reconnectChildren))
		$node.reconnectChildren();

	if (utils.isset($node.onAppendChildren))
		$node.onAppendChildren();
};

Node.prototype.removeChild = function($node)
{
	this.OriginalRemoveChild($node);
	
	if (utils.isset($node.onRemove))
		$node.onRemove();
	
	if (utils.isset($node.unconnectAll))
		$node.unconnectAll();
	
	if (utils.isset($node.onRemoveChildren))
		$node.onRemoveChildren();
};

Node.prototype.resize = function()
{
	if (utils.isset(this.onResize))
		this.onResize();
	
	for (var i = 0; i < this.childNodes.length; i++)
	{
		if (this.childNodes[i].resize)
			this.childNodes[i].resize();
	}
};

////////////////////////////////
// Mise en valeur de mots clé //
////////////////////////////////

Node.prototype.getTextNodes = function()
{
	var textNodesList = [];
	
	for (var i = 0; i < this.childNodes.length; i++)
	{
		if (this.childNodes[i].nodeType == 3)
			textNodesList.push(this.childNodes[i]);
		else
			textNodesList = textNodesList.concat(this.childNodes[i].getTextNodes());
	}
	
	return textNodesList;
};

Node.prototype.enlightText = function($text, $tag, $class, $style)
{
	var innerHTML = this.innerHTML;
	var textRegex = '(';
	
	for (var i = 0; i < $text.length; i++)
		textRegex = textRegex + '[' + $text[i].toLowerCase() + $text[i].toUpperCase() + ']';
	
	textRegex = textRegex + ')';
	
	var regex = new RegExp(textRegex, 'ig');
	
	var textNodes = this.getTextNodes();

	for (var i = 0; i < textNodes.length; i++)
	{
		var newText = textNodes[i].textContent.replace(regex, '<' + $tag + ' class="' + $class + '" style="' + $style + '" >$1</' + $tag + '>');
		innerHTML = innerHTML.replace(textNodes[i].textContent, newText);
	}

	this.innerHTML = innerHTML;
};

Node.prototype.removeEnlightText = function($tag, $class, $style)
{
	var innerHTML = this.innerHTML;
	var textRegex = '<' + $tag + ' class="' + $class + '" style="' + $style + '" ?>(.*?)</' + $tag + '>';
	var regex = new RegExp(textRegex, 'ig');
	
	innerHTML = innerHTML.replace(regex, '$1');
	this.innerHTML = innerHTML;
};

////////////////////////////////////////////////////
// Gestion du curseur dans un noeud de type input //
////////////////////////////////////////////////////

// Dans un noeud de type input texte, récupérer la position du curseur
Node.prototype.getCaret = function()
{
	var position = 0; 
	
	// IE Support
	if (document.selection)
	{
		this.focus(); 
		var range = document.selection.createRange();
		range.moveStart('character', -this.value.length); 
		position = range.text.length; 
	}
	
	// Firefox support
	else if (this.selectionStart || this.selectionStart === '0')
		position = this.selectionStart; 
	
	return position; 
};

// Dans un noeud de type input texte, imposer la position du curseur
Node.prototype.setCaret = function($position)
{
	if (this.setSelectionRange) 
	{
		this.focus();
		this.setSelectionRange($position, $position);
	}
	else if (this.createTextRange) 
	{
		var range = this.createTextRange();
		range.collapse(true);
		range.moveEnd('character', $position);
		range.moveStart('character', $position);
		range.select();
	}
};

// Dans un noeud de type input texte, supprimer les caractères passés en paramètre
Node.prototype.filter = function($regex, $replace)
{
	var cursorPosition = this.getCaret();
	var value = this.get('value');

	if (!utils.isset($replace))
		$replace = "";

	if ($regex.test(value))
	{
		var count = (value.match($regex) || []).length;
		this.value = value.replace($regex, $replace);
		this.setCaret(cursorPosition-count+$replace.length);
	}
};

// Dans un noeud de type input texte, s'assurer qu'on a bien un nombre
Node.prototype.filterNumber = function()
{
	this.filter(/[^0-9,\.]/gi, '');
	
	var value = this.get('value');
	
	var countDot = (value.match(/(\.|,)/gi) || []).length;
	
	// Si on entre plusieurs point ou virgules on supprime ceux en trop
	
	if (countDot > 1)
	{
		var separator = value.match(/(\.|,)/)[1];
		var firstDotPosition = value.indexOf(separator);
		this.filter(/(\.|,)/gi, '');
		value = this.get('value');
		var cursorPosition = this.getCaret();
		var endLength = value.length-firstDotPosition;
		this.value = value.slice(0, firstDotPosition) + separator + value.slice(firstDotPosition, 2*endLength);
		this.setCaret(cursorPosition+1);
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("dom");