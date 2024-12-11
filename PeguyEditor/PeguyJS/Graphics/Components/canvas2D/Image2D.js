
function Image2D($sourceImage, $sourceX, $sourceY, $sourceWidth, $sourceHeight, $targetX, $targetY, $targetWidth, $targetHeight)
{
	///////////////
	// Attributs //
	///////////////
	
	var sourceImage = $sourceImage;
	var sourceX = $sourceX;
	var sourceY = $sourceY;
	var sourceWidth = $sourceWidth;
	var sourceHeight = $sourceHeight;
	var targetX = $targetX;
	var targetY = $targetY;
	var targetWidth = $targetWidth;
	var targetHeight = $targetHeight;
	
	var object2D = new Object2D();
	object2D.setX(targetX);
	object2D.setY(targetY);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		$this['super'].render($context);
		$context.drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
		$context.restore();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getSourceImage = function() { return sourceImage; };
	this.getSourceX = function() { return sourceX; };
	this.getSourceY = function() { return sourceY; };
	this.getSourceWidth = function() { return sourceWidth; };
	this.getSourceHeight = function() { return sourceHeight; };
	this.getTargetX = function() { return targetX; };
	this.getTargetY = function() { return targetY; };
	this.getTargetWidth = function() { return targetWidth; };
	this.getTargetHeight = function() { return targetHeight; };
	
	// SET
	
	this.setSourceImage = function($sourceImage) { sourceImage = $sourceImage; };
	this.setSourceX = function($sourceX) { sourceX = $sourceX; };
	this.setSourceY = function($sourceY) { sourceY = $sourceY; };
	this.setSourceWidth = function($sourceWidth) { sourceWidth = $sourceWidth; };
	this.setSourceHeight = function($sourceHeight) { sourceHeight = $sourceHeight; };
	this.setTargetX = function($targetX) { targetX = $targetX; };
	this.setTargetY = function($targetY) { targetY = $targetY; };
	this.setTargetWidth = function($targetWidth) { targetWidth = $targetWidth; };
	this.setTargetHeight = function($targetHeight) { targetHeight = $targetHeight; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(object2D, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("image2D");