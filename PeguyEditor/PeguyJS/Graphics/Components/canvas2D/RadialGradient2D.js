
function RadialGradient2D($colors, $startCenterX, $startCenterY, $startRadius, $endCenterX, $endCenterY, $endRadius)
{
	///////////////
	// Attributs //
	///////////////
	
	var colors = $colors;
	var startCenterX = $startCenterX;
	var startCenterY = $startCenterY;
	var startRadius = $startRadius;
	var endCenterX = $endCenterX;
	var endCenterY = $endCenterY;
	var endRadius = $endRadius;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		var gradient = $context.createRadialGradient(startCenterX, startCenterY, startRadius, endCenterX, endCenterY, endRadius);
		
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
	this.getStartCenterX = function() { return startCenterX; };
	this.getStartCenterY = function() { return startCenterY; };
	this.getStartRadius = function() { return startRadius; };
	this.getEndCenterX = function() { return endCenterX; };
	this.getEndCenterY = function() { return endCenterY; };
	this.getEndRadius = function() { return endRadius; };
	
	// SET
	
	this.setColors = function($colors) { colors = $colors; };
	this.setStartCenterX = function($startCenterX) { startCenterX = $startCenterX; };
	this.setStartCenterY = function($startCenterY) { startCenterY = $startCenterY; };
	this.setStartRadius = function($startRadius) { startRadius = $startRadius; };
	this.setEndCenterX = function($endCenterX) { endCenterX = $endCenterX; };
	this.setEndCenterY = function($endCenterY) { endCenterY = $endCenterY; };
	this.setEndRadius = function($endRadius) { endRadius = $endRadius; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("radialGradient2D");