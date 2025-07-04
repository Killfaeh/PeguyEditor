
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2016 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function OrthoMatrix($left, $right, $top, $bottom, $near, $far)
{
	///////////////
	// Attributs //
	///////////////
	
	var matrix = new Matrix();
	var left = $left;
	var right = $right;
	var top = $top;
	var bottom = $bottom;
	var width = right-left;
	var height = bottom-top;
	var ratio = width/height;
	var near = $near;
	var far = $far;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.update = function()
	{
		var A = (near+far)/(near-far);
		var B = 2.0/(near-far);
		var C = 2.0/width;
		var D = 2.0/height;
		var E = -(left+right)/width;
		var F = -(top+bottom)/height;
		
		matrix.nullMatrix();
		matrix.setItemMatrix(0, 0, C);
		matrix.setItemMatrix(1, 1, D);
		matrix.setItemMatrix(2, 2, B);
		matrix.setItemMatrix(3, 0, E);
		matrix.setItemMatrix(3, 1, F);
		matrix.setItemMatrix(3, 2, A);
		matrix.setItemMatrix(3, 3, 1.0);
	};
	
	this.update();
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	
	// SET 
	
	this.setNear = function($near)
	{
		near = $near;
		this.update();
	};
	
	this.setFar = function($far)
	{
		far = $far;
		this.update();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(matrix, this); 
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("orthoMatrix");