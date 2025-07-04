function Component($html)
{
	///////////////
	// Attributs //
	///////////////
	
	Components.nbComponents++;
	var id = Components.nbComponents;
	var html = $html;
	var xml = null;
	var node = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.xmlToHtml = function($xmlNode)
	{
		var htmlNode;
		var inputNodes = [];
		
		if ($xmlNode.nodeType !== Node.TEXT_NODE)
		{
			var attributes = $xmlNode.attributes;
			var children = $xmlNode.childNodes;

			htmlNode = document.createElement($xmlNode.tagName);
			
			if (SVGTAGS.indexOf($xmlNode.tagName) >= 0)
			{
				htmlNode = document.createElementNS(SVGNS, $xmlNode.tagName);
				addNodeMethods(htmlNode);
			}
			
			this.initDefaultEvents(htmlNode);
			
			if (utils.isset(attributes))
			{
				for (var i = 0; i < attributes.length; i++)
				{
					if (attributes[i].name === 'id' || attributes[i].name === 'for' || (attributes[i].name === 'target' && $xmlNode.tagName.toLowerCase() === 'form'))
					{
						if (SVGTAGS.indexOf($xmlNode.tagName) >= 0)
							htmlNode.setAttributeNS(null, attributes[i].name, attributes[i].value + id);
						else
							htmlNode.setAttribute(attributes[i].name, attributes[i].value + id);
					}
					else
					{
						if (SVGTAGS.indexOf($xmlNode.tagName) >= 0 
							&& !/^xml/.test(attributes[i].name) && !/[a-z]+:[a-z]+/.test(attributes[i].name) 
							&& attributes[i].name !== 'width' && attributes[i].name !== 'height')
						{
							var attributeValue = attributes[i].value;
							
							if (/url\(#[a-zA-Z0-9-_]+\)/.test(attributeValue))
								attributeValue = attributeValue.replace(/url\(#([a-zA-Z0-9-_]+)\)/gi, 'url(#$1' + id + ')');
							
							htmlNode.setAttributeNS(null, attributes[i].name, attributeValue);
						}
						else
							htmlNode.setAttribute(attributes[i].name, attributes[i].value);
					}
				}
			}
			
			for (var i = 0; i < children.length; i++)
				htmlNode.appendChild(this.xmlToHtml(children[i]));
		}
		else
			htmlNode = document.createTextNode($xmlNode.textContent);

		return htmlNode;
	};

	this.stringToHtml = function($input)
	{
		var xmlNode = dataManager.StringToXML('<?xml version="1.0" encoding="UTF-8"?>' + $input).firstChild;
		var htmlNode = $this.xmlToHtml(xmlNode);
		return htmlNode;
	};
	
	this.parseNode = function($node)
	{
		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var attrId = $node.getAttribute('id');
			var forId = $node.getAttribute('for');
			
			if (utils.isset(attrId) && attrId !== '')
			{
				$node.setAttribute('id', attrId + "" + id);
				$node.addClass(attrId);
			}
			
			if (utils.isset(forId) && forId !== '')
				$node.setAttribute('for', forId + "" + id);
			
			this.initDefaultEvents($node);
			
			var children = $node.childNodes;
			
			for (var i = 0; i < children.length; i++)
				this.parseNode(children[i]);
		}
		
		return $node;
	};
	
	this.initDefaultEvents = function($node)
	{
		if ($node.tagName === 'input' || $node.tagName === 'INPUT'
			//|| $node.tagName === 'select' || $node.tagName === 'SELECT'
			|| $node.tagName === 'textarea' || $node.tagName === 'TEXTAREA')
		{
			$node.onChangeDelay = 0;
			$node.lastKeyStrokeDate = new Date();
			
			$node.onchange = function($event)
			{
				var keylist = [65, 67, 86, 88];
				
				if ((($event.metaKey || Events.keyPressTable['ctrl'] || Events.keyPressTable['cmd']) && keylist.indexOf($event.keyCode) < 0) || Events.keyPressTable['alt'])
				{
					Events.preventDefault($event);
					Events.stopPropagation($event);
				}
				
				if (utils.isset(this.onChange))
					this.onChange($event);
			};
			
			$node.onkeydown = function($event)
			{
				var keylist = [65, 67, 86, 88];
				
				if ((($event.metaKey || Events.keyPressTable['ctrl'] || Events.keyPressTable['cmd']) && keylist.indexOf($event.keyCode) < 0) || Events.keyPressTable['alt'])
				{
					Events.preventDefault($event);
					Events.stopPropagation($event);
				}
				
				if (utils.isset(this.onKeyDown))
					this.onKeyDown($event);
			};
			
			$node.onkeyup = function($event)
			{
				var node = this;
				node.lastKeyStrokeDate = new Date();
				
				if (utils.isset(this.onKeyUp))
					this.onKeyUp($event);
				
				if (utils.isset(node.onChange))
				{
					if (node.onChangeDelay > 0)
					{
						setTimeout(function()
						{
							var currentDate = new Date();
							var deltaTime = currentDate.getTime()-node.lastKeyStrokeDate.getTime();
							
							if (deltaTime >= node.onChangeDelay)
								node.onChange($event);
								
						}, node.onChangeDelay+1);
					}
					else
						node.onChange($event);
				}
			};
			
			$node.addEvent('click', function($event)
			{
				if (utils.isset(this.onClick))
					this.onClick($event);
			});
			
			$node.addEvent('dblclick', function($event)
			{
				if (utils.isset(this.onDblClick))
					this.onDblClick($event);
			});
			
			$node.addEvent('mousedown', function($event)
			{
				if (utils.isset(this.onMouseDown))
					this.onMouseDown($event);
			});
			
			$node.addEvent('mousemove', function($event)
			{
				if (utils.isset(this.onMouseMove))
					this.onMouseMove($event);
			});
			
			$node.addEvent('mouseup', function($event)
			{
				if (utils.isset(this.onMouseUp))
					this.onMouseUp($event);
			});
		}
		
		$node.addEvent('mouseover', function($event)
		{
			$event = $event || window.event; // Compatibilité IE
			
			var catchNode = $event.targetNode();
			var relatedTarget = $event.relatedTarget || $event.fromElement; // Idem
			
			if (!this.containsInChildren(relatedTarget))
			{
				if (utils.isset(this.onToolTip) && this.onToolTip !== "")
				{
					var toolTip = new ToolTip(this, this.onToolTip);
					var mousePosition = this.mousePosition($event);
					
					if (utils.isset(toolTip.update))
						toolTip.update(mousePosition.x, mousePosition.y);
				}
				
				if (utils.isset(this.onMouseOver))
					this.onMouseOver($event);
			}
		});
		
		$node.addEvent('mouseout', function($event)
		{
			$event = $event || window.event; // Compatibilité IE
			
			var catchNode = $event.targetNode();
			var relatedTarget = $event.relatedTarget || $event.toElement; // Idem
			
			if (!this.containsInChildren(relatedTarget))
			{
				if (utils.isset(this.toolTipOpen))
					this.toolTipOpen.startFadeOut();
				
				if (utils.isset(this.onMouseOut))
					this.onMouseOut($event);
			}
		});
	};
	
	this.getById = function($id)
	{
		//console.log(Components.nbComponents);
		//console.log('#' + $id + id);
		
		$id = $id.replace(/\+/g, '\\+');
		var output = node.querySelector('#' + $id + id);
		
		if (!utils.isset(output))
			output = node.querySelector('#' + $id);
		
		if (!utils.isset(output) && (""+$id+id === $this.getAttribute('id') || $id === $this.getAttribute('id')))
			output = $this;
		
		return output;
	};
	
	this.getRealId = function($id)
	{
		$id = $id.replace(/\+/g, '\\+');
		
		var realId = $id + '' + id;
		
		var output = node.querySelector('#' + $id + id);
		
		if (!utils.isset(output))
		{
			output = node.querySelector('#' + $id);
			realId = $id;
		}
		
		if (!utils.isset(output) && (""+$id+id === $this.getAttribute('id') || $id === $this.getAttribute('id')))
		{
			if (""+$id+id === $this.getAttribute('id'))
				realId = $id + '' + id;
			else if ($id === $this.getAttribute('id'))
				realId = $id;
		}
		
		return realId;
	};
	
	this.toCode = function()
	{
		var tagName = $this.tagName;
		var attributes = $this.attributes;
		
		var str = '<' + tagName + ' ';
		
		for (var i = 0; i < attributes.length; i++)
		{
			//if (attributes[i].name === 'id' || attributes[i].name === 'for' || (attributes[i].name === 'target' && $xmlNode.tagName.toLowerCase() === 'form'))
			
			str = str + attributes[i].name + '="' + attributes[i].value + '" ';
		}
		
		str = str + '>' + $this.innerHTML + '</' + tagName + '>';
		
		return str;
	};
	
	// Ajout des méthodes de noeuds
	
	var addNodeMethods = function($node)
	{
		//////////////////////////////
		// Manipulation des classes //
		//////////////////////////////
		
		$node.isClass = function($name)
		{
			var isClass = false;
			var className = this.getAttributeNS(null, 'class');
			
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
		
		$node.addClass = function($name)
		{
			var className = this.getAttributeNS(null, 'class');
			
			if (utils.isset(className) && className !== "")
			{
				var newClass = className;
				
				if (utils.isset($name) && $name !== "" && !this.isClass($name))
					newClass = className + " " + $name;
				
				newClass = newClass.replace(/^ /, '');
				this.setAttributeNS(null, 'class', newClass);
			}
			else
				this.setAttributeNS(null, 'class', $name);
		};
		
		$node.removeClass = function($name)
		{
			var className = this.getAttributeNS(null, 'class');
			
			if (utils.isset(className) && className !== "")
			{
				var classes = className.split(" "); 
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
		
		$node.getStyle = function($name)
		{
			var value = null; 
			
			//console.log(window.getComputedStyle(this, null));
			
			if (window.getComputedStyle)
				value = window.getComputedStyle(this, null).getPropertyValue($name);
			else if (this.currentStyle)
				value =  this.currentStyle[$name]; //IE
			
			return value;
		};
		
		$node.setStyle = function($name, $value)
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
		
		$node.copyStyleTo = function($target)
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
		
		/////////////
		// Clonage //
		/////////////
		
		$node.clone = function()
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
					clone.appendChild(children[i].clone());
			}
			else 
				clone = document.createTextNode(this.nodeValue);
			
			return clone;
		};
		
		$node.cloneForScreenshot = function()
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
				
				// Styles du noeud
				this.copyStyleTo(clone);
				
				// Parcours des enfants du noeud
				var children = this.childNodes;
			
				for (var i = 0; i < children.length; i++)
					clone.appendChild(children[i].cloneForScreenshot());
			}
			else 
				clone = document.createTextNode(this.nodeValue);
			
			return clone;
		};
	};
	
	// Gestion du focus
	
	this.focus = function()
	{
		$this.onFocus();
		Components.addFocus($this);
	};
	
	this.blur = function()
	{
		$this.onBlur();
		Components.removeFocus($this);
	};
	
	// Méthodes de gestion des événements globaux à surcharger
	
	this.onResize = function() {};
	this.onEndResize = function() {};
	this.onKeyDown = function($event) {};
	this.onKeyUp = function($event) {};
	this.onGamepadConnected = function($event) {};
	this.onGamepadDisconnected = function($event) {};
	this.onGamepadButtonDown = function($event) {};
	this.onGamepadButtonUp = function($event) {};
	this.onGamepadAxisChange = function($event) {};
	this.onRemove = function() {};
	this.onFocus = function() {};
	this.onBlur = function() {};
	this.onUndo = doNothing;
	this.onRedo = doNothing;
	
	this.refresh = function($data) {};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getId = function() { return id; };
	this.getHtml = function() { return html; };
	this.getJSON = function() { return {}; };

	// SET
	
	this.loadFromJSON = function($json) {};

	if (typeof html === "string")
	{
		xml = dataManager.StringToXML('<?xml version="1.0" encoding="UTF-8"?>' + html);
		node = this.xmlToHtml(xml.firstChild);
	}
	else
		node = this.parseNode(html);
	
	if (SVGTAGS.indexOf(node.tagName) >= 0)
	{
		this.totalLength = function() { return node.getTotalLength(); };

		this.pointAtLength = function($t)
		{
			if ($t < 0.0)
				$t = 0.0;
			else if ($t > 1.0)
				$t = 1.0;
			
			var totalLength = $this.totalLength();

			var point = node.getPointAtLength($t*totalLength);

			return [point.x, point.y, 0.0];
		};

		this.tangentAtLength = function($t)
		{
			var totalLength = $this.totalLength();

			if ($t < 0.0)
				$t = 0.0;
			else if ($t > 1.0)
				$t = 1.0;

			var $tPrev = $t*totalLength-PEGUY.glPrecision;
			var $tNext = $t*totalLength+PEGUY.glPrecision;
			
			if ($tPrev < 0.0)
				$tPrev = 0.0;
			else if ($tPrev > totalLength)
				$tPrev = totalLength;
			
			if ($tNext < 0.0)
				$tNext = 0.0;
			else if ($tNext > totalLength)
				$tNext = totalLength;
				
			var pointPrev = node.getPointAtLength($tPrev);
			var pointNext = node.getPointAtLength($tNext);
			
			var deltaVect = [pointNext.x-pointPrev.x, pointNext.y-pointPrev.y];
			var polar = Trigo.polar(deltaVect[0], deltaVect[1]);

			return [deltaVect[0]/polar.r, deltaVect[1]/polar.r, 0.0];
		};

		this.normalAtLength = function($t)
		{
			var tangent = node.tangentAtLength($t);
			return [tangent[1], -tangent[0], 0.0];
		};

		this.samplePoints = function($n, $edges)
		{
			var n = $n;

			if (n < 2)
				n = 2;
			
			if (/ [zZ]/.test(html))
				n = n+1;
			
			var pointsList = [];
			
			for (var i = 0; i < n; i++)
			{
				//if (i < n-1 || !/ [zZ]/.test(html))
				{
					var t = i/(n-1);
					pointsList.push($this.pointAtLength(t));
				}
			}

			console.log("Sampled points : ");
			console.log(pointsList);

			return pointsList;
		};

		this.samplePointsForWebGL = function($n, $edges)
		{
			var n = $n;

			if (n < 2)
				n = 2;
			
			if (/ [zZ]/.test(html))
				n = n+1;

			var pointsList = [];
			
			for (var i = 0; i < n; i++)
			{
				//if (i < n-1 || !/ [zZ]/.test(html))
				{
					var t = i/(n-1);
					var point = $this.pointAtLength(t);
					var tangent = $this.tangentAtLength(t);
					var normal = [tangent[1], -tangent[0], 0.0];
					var data = { point: point, tangent: tangent, normal: normal, smooth: true};
					pointsList.push(data);
				}
			}
			return pointsList;
		};
	}
	
	var $this = utils.extend(node, this);
	Components.componentsList.push($this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("component");