
function LinearGradient2D($colors, $x1, $y1, $x2, $y2)
{
	///////////////
	// Attributs //
	///////////////
	
	var colors = $colors;
	var x1 = $x1;
	var y1 = $y1;
	var x2 = $x2;
	var y2 = $y2;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		var gradient = $context.createLinearGradient(x1, y1, x2, y2);
		
		for (var i = 0; i < colors.length; i++)
			gradient.addColorStop(colors[i].stop, colors[i].color);
		
		console.log(gradient);

		$context.fillStyle = gradient;
		
		return gradient;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getColors = function() { return colors; };
	this.getX1 = function() { return x1; };
	this.getY1 = function() { return y1; };
	this.getX2 = function() { return x2; };
	this.getY2 = function() { return y2; };
	
	// SET
	
	this.setColors = function($colors) { colors = $colors; };
	this.setX1 = function($x1) { x1 = $x1; };
	this.setY1 = function($y1) { y1 = $y1; };
	this.setX2 = function($x2) { x2 = $x2; };
	this.setY2 = function($y2) { y2 = $y2; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("linearGradient2D");