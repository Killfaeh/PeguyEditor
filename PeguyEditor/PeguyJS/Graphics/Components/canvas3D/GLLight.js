
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2020 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var LIGHT_TYPES = 
{
	directional: 0,
	point: 1,
	spot: 2
};

function GLLight()
{
	///////////////
	// Attributs //
	///////////////
	
	var type = LIGHT_TYPES.directionnal;
	var color = [1.0, 1.0, 1.0, 1.0];
	var position = [-10.0, -10.0, 10.0];
	var direction = [1.0, 1.0, -1.0];
	var limit = Math.PI/4.0;
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getType = function() { return type; };
	this.getColor = function() { return color; };
	this.getGreyScale = function() { return (color[0] + color[1] + color[2])/3.0; };
	this.getPosition = function() { return position; };
	this.getDirection = function() { return (new Vector(direction)).normalize().values(); };
	this.getLimit = function() { return limit; };
	
	// SET 
	this.setType = function($type) { type = $type; };
	this.setColor = function($color) { color = $color; };
	this.setPosition = function($position) { position = $position; };
	this.setDirection = function($direction) { direction = (new Vector($direction)).normalize().values(); };
	this.setLimit = function($limit) { limit = $limit; };
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-light");