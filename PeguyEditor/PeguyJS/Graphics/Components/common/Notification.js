function Notification($manager, $content, $persistent)
{
	///////////////
	// Attributs //
	///////////////

	var manager = $manager;
	var content = $content;
	var persistent = $persistent;

	var html = '<div class="notification" >'
					+ '<div id="innerNotification" class="innerNotification" >'
						+ content
						+ '<div id="closeIcon" class="close" ></div>'
					+ '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
	component.getById('closeIcon').appendChild(closeIcon);
	
	// Données d'animation
	
	var persistenceTime = 10000;
	
	var mouseOverDate = new Date();
	
	var pushTimer = null;
	var removeTimer = null;
	
	var width = 300;
	var height = 20;
	
	var yPosition = 0;
	var xPosition = 0;
	
	var stepX = 0;
	var stepY = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var pushAnimation = function()
	{
		yPosition = yPosition + stepY;
		
		if (yPosition >= height)
		{
			yPosition = height;
			clearTimeout(pushTimer);
			pushTimer = null;
		}
		
		$this.style.width = width + 'px';
		$this.style.height = yPosition + 'px';
		$this.getById('innerNotification').style.position = "absolute";
		$this.getById('innerNotification').style.left = "0px";
		$this.getById('innerNotification').style.bottom = "0px";
	};
	
	this.startPush = function()
	{
		if (!utils.isset(pushTimer))
		{
			width = $this.offsetWidth;
			height = $this.offsetHeight;
			stepY = $this.offsetHeight/40;
			yPosition = 0;
			pushTimer = setInterval(function() { pushAnimation(); }, 8);
		}
	};
	
	var removeAnimation = function()
	{
		
		xPosition = xPosition + stepX;
		
		if (xPosition >= width)
		{
			xPosition = width;
			yPosition = yPosition - stepY;
			
			if (yPosition <= 0)
			{
				yPosition = 0;
				clearTimeout(removeTimer);
				removeTimer = null;
				$this.remove();
			}
		}
		
		$this.style.left = xPosition + 'px';
		$this.style.height = yPosition + 'px';
	};
	
	this.remove = function() { manager.removeNotification($this); };
	
	this.startRemove = function()
	{
		var currentDate = new Date();
		
		if (!utils.isset(removeTimer) && currentDate.getTime() - mouseOverDate.getTime() >= persistenceTime)
		{
			width = $this.offsetWidth;
			height = $this.offsetHeight;
			stepX = $this.offsetWidth/40;
			stepY = $this.offsetHeight/40;
			yPosition = height;
			xPosition = 0;
			removeTimer = setInterval(function() { removeAnimation(); }, 8);
		}
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onMouseOver = function()
	{
		mouseOverDate = new Date();
	};
	
	this.onMouseOut = function()
	{
		if (persistent === false)
			setTimeout(function() { $this.startRemove(); }, persistenceTime);
	};
	
	component.getById('closeIcon').onClick = function()
	{
		console.log("FERMER NOTIF");
		mouseOverDate = new Date(1000, 0, 1);
		$this.startRemove();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	if (persistent === false)
		setTimeout(function() { $this.startRemove(); }, persistenceTime);
	
	var $this = utils.extend(component, this);
	manager.addNotification($this);
	$this.startPush();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("notification");