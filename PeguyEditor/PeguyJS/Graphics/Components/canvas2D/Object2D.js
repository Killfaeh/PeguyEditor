
function Object2D()
{
	///////////////
	// Attributs //
	///////////////
	
	var x = 0;
	var y = 0;
	var angle = 0;
	
	var fillStyle = 'rgb(0, 0, 0)';
	var strokeStyle = 'rgb(0, 0, 0)';
	var lineWidth = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		// Déplacements
		
		$context.save();
		$context.translate(x, y);
		$context.rotate(angle/180.0*Math.PI);
		
		// Styles
		
		if (utils.isset(fillStyle))
			$context.fillStyle = fillStyle;
		
		if (utils.isset(strokeStyle))
			$context.strokeStyle = strokeStyle;
		
		if (utils.isset(lineWidth))
			$context.lineWidth = lineWidth;
		
		// Dessin dans la surcharge
		
		// $context.restore();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getAngle = function() { return angle; };

	this.getFillStyle = function() { return fillStyle; };
	this.getStrokeStyle = function() { return strokeStyle; };
	this.getLineWidth = function() { return lineWidth; };
	
	// SET
	
	this.setX = function($x) { x = $x; };
	this.setY = function($y) { y = $y; };
	this.setAngle = function($angle) { angle = $angle; };
	
	this.setFillStyle = function($fillStyle) { fillStyle = $fillStyle; };
	this.setStrokeStyle = function($strokeStyle) { strokeStyle = $strokeStyle; };
	this.setLineWidth = function($lineWidth) { lineWidth = $lineWidth; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("object2D");