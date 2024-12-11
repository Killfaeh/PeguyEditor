function ProgressBar($currentValue)
{
	///////////////
	// Attributs //
	///////////////
	
	var currentValue = $currentValue; // En pourcent
	
	if (!utils.isset(currentValue))
		currentValue = 0;
	else if (currentValue < 0)
		currentValue = 0;
	else if (currentValue > 100)
		currentValue = 100;

	var html = '<div class="progressBar" >'
					+ '<div id="bar" class="progressBarBar" ></div>'
				+ '</div>';
				
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	var updateBar = function()
	{
		var maxWidth = $this.offsetWidth 
						- parseInt(component.getStyle('border-left-width').replace('px', '')) - parseInt(component.getStyle('padding-left').replace('px', ''))
						- parseInt(component.getStyle('border-right-width').replace('px', '')) - parseInt(component.getStyle('padding-right').replace('px', ''))
						- parseInt(component.getById('bar').getStyle('border-left-width').replace('px', '')) - parseInt(component.getById('bar').getStyle('padding-left').replace('px', ''))
						- 2*parseInt(component.getById('bar').getStyle('left').replace('px', ''));
		
		var barWidth = maxWidth*currentValue/100.0;
		
		component.getById('bar').style.width = barWidth + 'px';
	};
	
	this.autoResize = function()
	{
		var barWidth = component.offsetWidth;
		
		if (barWidth > 0)
			updateBar();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	// SET
	
	this.setCurrentValue = function($value)
	{
		currentValue = $value;
		
		if (!utils.isset(currentValue))
			currentValue = 0;
		else if (currentValue < 0)
			currentValue = 0;
		else if (currentValue > 100)
			currentValue = 100;
		
		updateBar();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.autoResize();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("progressBar");