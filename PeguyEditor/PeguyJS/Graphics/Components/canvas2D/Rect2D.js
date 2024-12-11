
function Rect2D($x, $y, $width, $height)
{
	///////////////
	// Attributs //
	///////////////
	
	var width = $width;
	var height = $height;
	
	var object2D = new Object2D();
	object2D.setX($x);
	object2D.setY($y);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		$this['super'].render($context);
		
		$context.fillRect(0, 0, width, height);
		
		var lineWidth = object2D.getLineWidth();
		
		if (lineWidth > 0)
			$context.strokeRect(0, 0, width, height);
		
		$context.restore();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	
	// SET
	
	this.setWidth = function($width) { width = $width; };
	this.setHeight = function($height) { height = $height; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(object2D, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("rect2D");