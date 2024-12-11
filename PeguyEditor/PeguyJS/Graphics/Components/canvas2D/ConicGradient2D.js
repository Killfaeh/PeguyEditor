
function ConicGradient2D($colors, $startAngle, $x, $y)
{
	///////////////
	// Attributs //
	///////////////
	
	var colors = $colors;
	var startAngle = $startAngle;
	var x = $x;
	var y = $y;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		var gradient = $context.createConicGradient(startAngle, x, y);
		
		for (var i = 0; i < colors.length; i++)
			gradient.addColorStop(colors[i].stop, colors[i].color);
		
		$context.fillStyle = gradient;
		
		return gradient;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getColors = function() { return colors; };
	this.getStartAngle = function() { return startAngle; };
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	
	// SET
	
	this.setColors = function($colors) { colors = $colors; };
	this.setStartAngle = function($startAngle) { startAngle = $startAngle; };
	this.setX = function($x) { x = $x; };
	this.setY = function($y) { y = $y; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("conicGradient2D");