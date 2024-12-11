
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2016 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function TranslateMatrix($x, $y, $z)
{
	///////////////
	// Attributs //
	///////////////
	
	var matrix = new Matrix(); 
	var x = $x; 
	var y = $y; 
	var z = $z; 
	
	matrix.identity(); 
	matrix.setItemMatrix(3, 0, x); 
	matrix.setItemMatrix(3, 1, y); 
	matrix.setItemMatrix(3, 2, z); 
	
	//////////////
	// Méthodes //
	//////////////
	
	// Translation d'un vecteur 
	this.translate = function($vector)
	{
		/*
		matrix.identity(); 
		matrix.setItemMatrix(3, 0, this.x); 
		matrix.setItemMatrix(3, 1, this.y); 
		matrix.setItemMatrix(3, 2, this.z); 
		//*/
		
		return this.matrix.multiplyVect($vector); 
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getX = function() { return x; }; 
	this.getY = function() { return y; }; 
	this.getZ = function() { return z; }; 
	
	// SET 
	this.setItemMatrix = function($i, $j, $value) {}; 
	this.setItemTable = function($index, $value) {}; 
	
	this.setX = function($x)
	{
		x = $x; 
		matrix.setItemMatrix(3, 0, x); 
	}; 
	
	this.setY = function($y)
	{
		y = $y; 
		matrix.setItemMatrix(3, 1, y); 
	}; 
	
	this.setZ = function($z)
	{
		z = $z; 
		matrix.setItemMatrix(3, 2, z); 
	}; 
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(matrix, this); 
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("translateMatrix");