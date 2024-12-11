function SVGhtml($width, $height, $html)
{
	var width = $width;
	var height = $height;
	var html = $html;
	
	if (!utils.isset(html))
		html = '';
	
	//var component = new Component('<foreignObject x="0" y="0" width="' + width + '" height="' + height + '" >' + html + '</foreignObject>');
	var component = new Component('<foreignObject x="0" y="0" >' + html + '</foreignObject>');
	
	///////////////
	// Attributs //
	///////////////
	
	//////////////
	// Méthodes //
	//////////////
	
	var updateSize = function()
	{
		if (width !== 'auto')
			component.setAttributeNS(null, 'width', width);
	
		if (height !== 'auto')
			component.setAttributeNS(null, 'height', height);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	
	// SET
	
	this.setWidth = function($width)
	{
		width = $width;
		updateSize();
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		updateSize();
	};
	
	updateSize();
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("svgHTML");