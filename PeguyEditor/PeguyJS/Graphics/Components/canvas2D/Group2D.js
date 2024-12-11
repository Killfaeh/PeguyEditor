
function Group2D()
{
	///////////////
	// Attributs //
	///////////////
	
	var objectsList = [];
	
	var x = 0;
	var y = 0;
	var angle = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function($context)
	{
		$context.save();
		$context.translate(x, y);
		$context.rotate(angle/180.0*Math.PI);
		
		for (var i = 0; i < objectsList.length; i++)
			objectsList[i].render(context);
		
		$context.restore();
	};
	
	this.addObject = function($object)
	{
		var index = objectsList.indexOf($object);
		
		if (index < 0)
			objectsList.push($object);
	};
	
	this.insertObjectInto = function($object, $index)
	{
		var index = objectsList.indexOf($object);
		
		if (index >= 0)
			objectsList.splice(index, 1);
		
		objectsList.splice($index, 0, $object);
	};
	
	this.removeObject = function($element)
	{
		var index = elementsList.indexOf($object);
		
		if (index >= 0)
			objectsList.splice(index, 1);
	};
	
	this.removeAllObjects = function() { objectsList = []; };
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getAngle = function() { return angle; };
	
	// SET
	
	this.setX = function($x) { x = $x; };
	this.setY = function($y) { y = $y; };
	this.setAngle = function($angle) { angle = $angle; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("group2D");