function SVGradialGradient($cx, $cy, $r, $colorsList)
{
	NB_SVG_GRADIENTS++;
	
	var gradientId = NB_SVG_GRADIENTS;
	var cx = $cx;
	var cy = $cy;
	var r = $r;
	var colorsList = $colorsList;
	
	var gradient = new Component('<radialGradient id="gradient_' + gradientId + '" gradientUnits="objectBoundingBox" ></radialGradient>');
	
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
		
		//gradient.setAttributeNS(null, "cx", cx);
		//gradient.setAttributeNS(null, "cy", cy);
		//gradient.setAttributeNS(null, "r", r);
		
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
	
	this.setCx = function($cx)
	{
		cx = $cx;
		$this.update();
	};
	
	this.setCy = function($cy)
	{
		cy = $cy;
		$this.update();
	};
	
	this.setR = function($r)
	{
		r = $r;
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
	Loader.hasLoaded("svgRadialGradient");