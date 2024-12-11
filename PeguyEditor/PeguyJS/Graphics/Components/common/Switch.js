function Switch($on)
{
	///////////////
	// Attributs //
	///////////////
	
	var on = $on;
	
	var html = '<div class="switch" >'
					+ '<div id="bar" class="switchBar" ></div>'
					+ '<div id="handler" class="switchHandler" ></div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var icon = Loader.getSVG('icons', 'slider-cursor-icon', 20, 20);
	component.getById('handler').appendChild(icon);
	
	// Variables d'animation
	var maxPosition = 0;
	var speed = 0;
	var currentPosition = 0;
	var animationTimer;
	
	//////////////
	// Méthodes //
	//////////////
	
	var animation = function()
	{
		currentPosition = currentPosition + speed;
		
		if (speed < 0 && currentPosition < 0)
		{
			clearTimeout(animationTimer);
			animationTimer = null;
			currentPosition = 0;
			speed = 0;
		}
		else if (speed > 0 && currentPosition > maxPosition)
		{
			clearTimeout(animationTimer);
			animationTimer = null;
			currentPosition = maxPosition;
			speed = 0;
		}
		
		component.getById('handler').style.left = currentPosition + 'px';
	};
	
	this.off = function()
	{
		on = false;
		maxPosition = component.getById('bar').offsetWidth;
		speed = -maxPosition/10;
		
		if (!utils.isset(animationTimer))
		{
			currentPosition = maxPosition;
			animationTimer = setInterval(animation, 20);
		}
		
		component.getById('bar').removeClass('switchBarOn');
		$this.onChange(on);
	};
	
	this.on = function()
	{
		on = true;
		maxPosition = component.getById('bar').offsetWidth;
		speed = maxPosition/10;
		
		if (!utils.isset(animationTimer))
		{
			currentPosition = 0;
			animationTimer = setInterval(animation, 20);
		}
		
		component.getById('bar').addClass('switchBarOn');
		$this.onChange(on);
	};
	
	this.autoResize = function()
	{
		var barWidth = component.getById('bar').offsetWidth;
		
		if (barWidth > 0)
		{
			maxPosition = barWidth;
			
			if (on === true)
			{
				component.getById('handler').style.left = maxPosition + 'px';
				component.getById('bar').addClass('switchBarOn');
			}
			else
			{
				component.getById('handler').style.left = '0px';
				component.getById('bar').removeClass('switchBarOn');
			}
		}
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($value) {};
	
	component.onClick = function()
	{
		console.log("Coucou switch ! ");
		
		if (currentPosition >= maxPosition || speed > 0)
			$this.off();
		else if (currentPosition <= 0 || speed < 0)
			$this.on();
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isOn = function() { return on; };
	
	// SET
	
	this.setOn = function($on)
	{
		if (on !== $on)
		{
			on = $on;
			
			if (on === true)
				$this.on();
			else
				$this.off();
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.autoResize();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("switch");