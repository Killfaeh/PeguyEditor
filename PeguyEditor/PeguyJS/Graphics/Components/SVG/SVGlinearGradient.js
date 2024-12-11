function SVGlinearGradient($x1, $y1, $x2, $y2, $colorsList)
{
	NB_SVG_GRADIENTS++;
	
	var gradientId = NB_SVG_GRADIENTS;
	var x1 = $x1;
	var y1 = $y1;
	var x2 = $x2;
	var y2 = $y2;
	var colorsList = $colorsList;
	
	var gradient = new Component('<linearGradient id="gradient_' + gradientId + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" ></linearGradient>');
	
	///////////////
	// Attributs //
	///////////////
	
	//////////////
	// Méthodes //
	//////////////
	
	this.update = function()
	{
		while (gradient.firstChild)
			gradient.removeChild(gradient.firstChild);
		
		gradient.setAttributeNS(null, "x1", x1);
		gradient.setAttributeNS(null, "y1", y1);
		gradient.setAttributeNS(null, "x2", x2);
		gradient.setAttributeNS(null, "y2", y2);
		
		for (var i = 0; i < colorsList.length; i++)
		{
			var stop = new Component('<stop offset="' + colorsList[i].offset + '" style="stop-color: ' + colorsList[i].color + '; stop-opacity: ' + colorsList[i].opacity + ';" />');
			gradient.appendChild(stop);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getGradientId = function() { return id; };
	this.getURL = function() { return 'url(#gradient_' + gradientId + gradient.getId() + ')'; };
	
	// SET
	
	this.setX1 = function($x1)
	{
		x1 = $x1;
		$this.update();
	};
	
	this.setY1 = function($y1)
	{
		y1 = $y1;
		$this.update();
	};
	
	this.setX2 = function($x2)
	{
		x2 = $x2;
		$this.update();
	};
	
	this.setY2 = function($y2)
	{
		y2 = $y2;
		$this.update();
	};
	
	this.setColorsList = function($colorsList)
	{
		colorsList = $colorsList;
		$this.update();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(gradient, this);
	$this.update();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("svgLinearGradient");