
function Sprite2D($sourceImage, $nbAnimations, $nbFrames, $vertical, $targetX, $targetY, $targetWidth, $targetHeight)
{
	///////////////
	// Attributs //
	///////////////
	
	var sourceImage = $sourceImage;
	var nbAnimations = $nbAnimations;
	var nbFrames = $nbFrames;
	var vertical = $vertical;
	var targetX = $targetX;
	var targetY = $targetY;
	var targetWidth = $targetWidth;
	var targetHeight = $targetHeight;
	
	var spriteWidth = sourceImage.width/nbFrames;
	var spriteHeight = sourceImage.height/nbAnimations;
	var animationNum = 0;
	var frameNum = 0;
	
	var object2D = new Object2D();
	object2D.setX(targetX);
	object2D.setY(targetY);
	
	//////////////
	// Méthodes //
	//////////////
	
	var updateSprite = function()
	{
		spriteWidth = sourceImage.width/nbFrames;
		spriteHeight = sourceImage.height/nbAnimations;
		
		if (vertical === true)
		{
			spriteWidth = sourceImage.width/nbAnimations;
			spriteHeight = sourceImage.height/nbFrames;
		}
	};
	
	this.render = function($context)
	{
		var sourceX = frameNum*spriteWidth;
		var sourceY = animationNum*spriteHeight;
		
		if (vertical === true)
		{
			sourceX = animationNum*spriteWidth;
			sourceY = frameNum*spriteHeight;
		}
		
		$this['super'].render($context);
		$context.drawImage(sourceImage, sourceX, sourceY, spriteWidth, spriteHeight, targetX, targetY, targetWidth, targetHeight);
		$context.restore();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getSourceImage = function() { return sourceImage; };
	this.getNbAnimations = function() { return nbAnimations; };
	this.getNbFrames = function() { return nbFrames; };
	this.isVertical = function() { return vertical; };
	this.getSpriteWidth = function() { return spriteWidth; };
	this.getspriteHeight = function() { return spriteHeight; };
	this.getAnimationNum = function() { return animationNum; };
	this.getFrameNum = function() { return frameNum; };
	this.getTargetX = function() { return targetX; };
	this.getTargetY = function() { return targetY; };
	this.getTargetWidth = function() { return targetWidth; };
	this.getTargetHeight = function() { return targetHeight; };
	
	// SET
	
	this.setSourceImage = function($sourceImage)
	{
		sourceImage = $sourceImage;
		updateSprite();
	};
	
	this.setNbAnimations = function($nbAnimations)
	{
		nbAnimations = $nbAnimations;
		updateSprite();
	};
	
	this.setNbFrames = function($nbFrames)
	{
		nbFrames = $nbFrames;
		updateSprite();
	};
	
	this.setVertical = function($vertical)
	{
		vertical = $vertical;
		updateSprite();
	};
	
	this.setAnimationNum = function($animationNum){ animationNum = $animationNum%nbAnimations; };
	this.setFrameNum = function($frameNum) { frameNum = $frameNum%nbFrames; };
	
	this.setTargetX = function($targetX) { targetX = $targetX; };
	this.setTargetY = function($targetY) { targetY = $targetY; };
	this.setTargetWidth = function($targetWidth) { targetWidth = $targetWidth; };
	this.setTargetHeight = function($targetHeight) { targetHeight = $targetHeight; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(object2D, this);
	updateSprite();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("sprite2D");