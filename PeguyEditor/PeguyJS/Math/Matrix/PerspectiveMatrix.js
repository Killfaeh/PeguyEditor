
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2016 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function PerspectiveMatrix($angle, $ratio, $near, $far)
{
	///////////////
	// Attributs //
	///////////////
	
	var matrix = new Matrix();
	var angleDeg = $angle;
	var angleRad = $angle/360.0 * Math.PI;
	var ratio = $ratio;
	var near = $near;
	var far = $far;

	//////////////
	// Méthodes //
	//////////////
	
	this.update = function()
	{
		var yLimit = near*Math.tan(angleRad);
		var A = (far+near)/(near-far);
		var B = 2*far*near/(near-far);
		var C = near/(yLimit*ratio);
		var D = near/yLimit;
		
		matrix.nullMatrix();
		matrix.setItemMatrix(0, 0, C);
		matrix.setItemMatrix(1, 1, D);
		matrix.setItemMatrix(2, 2, A);
		matrix.setItemMatrix(2, 3, -1.0);
		matrix.setItemMatrix(3, 2, B);
	};
	
	this.update();
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	
	// SET 
	
	this.setAngleDeg = function($angleDeg)
	{
		angleDeg = $angleDeg;
		angleRad = $angle/360.0 * Math.PI;
		this.update();
	};
	
	this.setRatio = function($ratio)
	{
		ratio = $ratio;
		this.update();
	};
	
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
	Loader.hasLoaded("perspectiveMatrix");