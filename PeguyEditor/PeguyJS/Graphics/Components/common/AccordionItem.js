function AccordionItem($label, $content)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	var content = $content;

	var html = '<li class="accordionItem" >'
					+ '<div id="header" class="accordionHeader" >'
						+ '<div id="icons" class="accordionIcons" ></div>'
						+ '<div id="label" class="accordionLabel" >' + label + '</div>'
					+ '</div>'
					+ '<div id="content" class="accordionContent" ></div>'
				+ '</li>';
				
	var component = new Component(html);
	
	var contentBlock = component.getById('content');
	contentBlock.appendChild(content);
	
	var plusIcon = Loader.getSVG('icons', 'plus-icon', 25, 25);
	var minusIcon = Loader.getSVG('icons', 'minus-icon', 25, 25);
	
	minusIcon.style.display = 'none';
	
	component.getById('icons').appendChild(plusIcon);
	component.getById('icons').appendChild(minusIcon);
	
	var open = false;
	var parent = null;
	
	// Variables d'animation
	var maxSize = 0;
	var speed = 0;
	var currentSize = 0;
	var animationTimer;
	
	//////////////
	// Méthodes //
	//////////////
	
	var animation = function()
	{
		currentSize = currentSize + speed;
		
		contentBlock.style.height = currentSize + 'px';
		
		if (speed < 0 && currentSize < 0)
		{
			clearTimeout(animationTimer);
			animationTimer = null;
			currentSize = 0;
			speed = 0;
			contentBlock.style.display = 'none';
		}
		else if (speed > 0 && currentSize > maxSize)
		{
			clearTimeout(animationTimer);
			animationTimer = null;
			currentSize = maxSize;
			speed = 0;
			contentBlock.style.height = 'unset';
		}
	};
	
	this.close = function()
	{
		speed = -maxSize/10;
		
		plusIcon.style.display = 'inline-block';
		minusIcon.style.display = 'none';
		
		if (!utils.isset(animationTimer))
		{
			currentSize = maxSize;
			animationTimer = setInterval(animation, 20);
		}
	};
	
	this.open = function()
	{
		//updateAnimationVariables();
		
		if (utils.isset(parent) && parent.getOpenOneCloseAll() === true)
			parent.closeAll();
		
		speed = maxSize/10;
		
		plusIcon.style.display = 'none';
		minusIcon.style.display = 'inline-block';
		contentBlock.style.display = 'block';
		
		if (!utils.isset(animationTimer))
		{
			currentSize = 0;
			animationTimer = setInterval(animation, 20);
		}
	};
	
	var updateAnimationVariables = function()
	{
		contentBlock.style.display = 'block';
		contentBlock.style.height = 'unset';
		contentBlock.style.position = 'absolute';
		contentBlock.style.left = '-1000000000px';
		contentBlock.style.top = '-1000000000px';
		
		document.getElementById('main').appendChild(contentBlock);
		
		maxSize = contentBlock.offsetHeight;
		
		console.log(content);
		console.log('maxSize : ' + maxSize);
		
		contentBlock.style.display = 'none';
		contentBlock.style.height = '0px';
		contentBlock.style.position = 'unset';
		contentBlock.style.left = 'unset';
		contentBlock.style.top = 'unset';
		
		component.appendChild(contentBlock);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	component.getById('header').onClick = function()
	{
		if (currentSize >= maxSize || speed > 0)
			$this.close();
		else if (currentSize <= 0 || speed < 0)
			$this.open();
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	this.setParent = function($parent) { parent = $parent; };
	
	this.setContent = function($content)
	{
		content = $content;
		contentBlock.removeAllChildren();
		contentBlock.appendChild(content);
		updateAnimationVariables();
	};
	
	this.setMaxSise = function($maxSize) { maxSize = $maxSize; };
	
	//////////////
	// Héritage //
	//////////////
	
	updateAnimationVariables();
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("accordionItem");