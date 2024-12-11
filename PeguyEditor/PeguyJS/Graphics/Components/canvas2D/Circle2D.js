
function Circle2D($x, $y, $radius)
{
	///////////////
	// Attributs //
	///////////////
	
	var radius = $radius;
	
	var object2D = new Object2D();
	object2D.setX($x);
	object2D.setY($y);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		$this['super'].render($context);
		
		$context.beginPath();
        $context.arc(0, 0, radius, 0, 2 * Math.PI, false);

        var fillColor = object2D.getFillStyle();

        if (utils.isset(fillColor))
            $context.fill();
		
        $context.stroke();
		
		$context.restore();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getRadius = function() { return radius; };
	
	// SET
	
	this.setRadius = function($radius) { radius = $radius; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(object2D, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("circle2D");