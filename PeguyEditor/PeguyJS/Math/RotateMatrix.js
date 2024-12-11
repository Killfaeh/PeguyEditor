
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2016 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function RotateMatrix($x, $y, $z, $theta)
{
	///////////////
	// Attributs //
	///////////////
	
	var matrix = new Matrix(); 
	var x = $x; 
	var y = $y; 
	var z = $z; 
	var theta = $theta/180.0 * Math.PI; 
	
	matrix.identity(); 

	if ($theta === 0.0) {}
	else if ($theta === 90.0)
	{
		matrix.setItemMatrix(0, 0, x*x); 
		matrix.setItemMatrix(0, 1, x*y - z); 
		matrix.setItemMatrix(0, 2, x*z + y); 
		
		matrix.setItemMatrix(1, 0, y*x + z); 
		matrix.setItemMatrix(1, 1, y*y); 
		matrix.setItemMatrix(1, 2, y*z - x); 
		
		matrix.setItemMatrix(2, 0, x*z - y); 
		matrix.setItemMatrix(2, 1, y*z + x); 
		matrix.setItemMatrix(2, 2, z*z); 
	}
	else if ($theta === 180.0)
	{
		matrix.setItemMatrix(0, 0, 2.0*x*x - 1.0); 
		matrix.setItemMatrix(0, 1, 2.0*x*y); 
		matrix.setItemMatrix(0, 2, 2.0*x*z); 
		
		matrix.setItemMatrix(1, 0, 2.0*y*x); 
		matrix.setItemMatrix(1, 1, 2.0*y*y - 1.0); 
		matrix.setItemMatrix(1, 2, 2.0*y*z); 
		
		matrix.setItemMatrix(2, 0, 2.0*x*z); 
		matrix.setItemMatrix(2, 1, 2.0*y*z); 
		matrix.setItemMatrix(2, 2, 2.0*z*z - 1.0); 
	}
	else if ($theta === -90.0)
	{
		matrix.setItemMatrix(0, 0, x*x); 
		matrix.setItemMatrix(0, 1, x*y + z); 
		matrix.setItemMatrix(0, 2, x*z - y); 
		
		matrix.setItemMatrix(1, 0, y*x - z); 
		matrix.setItemMatrix(1, 1, y*y); 
		matrix.setItemMatrix(1, 2, y*z + x); 
		
		matrix.setItemMatrix(2, 0, x*z + y); 
		matrix.setItemMatrix(2, 1, y*z - x); 
		matrix.setItemMatrix(2, 2, z*z); 
	}
	else
	{
		matrix.setItemMatrix(0, 0, x*x * (1-Math.cos(theta)) + Math.cos(theta) ); 
		matrix.setItemMatrix(0, 1, x*y * (1-Math.cos(theta)) - z*Math.sin(theta) ); 
		matrix.setItemMatrix(0, 2, x*z * (1-Math.cos(theta)) + y*Math.sin(theta) ); 
		
		matrix.setItemMatrix(1, 0, y*x * (1-Math.cos(theta)) + z*Math.sin(theta) ); 
		matrix.setItemMatrix(1, 1, y*y * (1-Math.cos(theta)) + Math.cos(theta) ); 
		matrix.setItemMatrix(1, 2, y*z * (1-Math.cos(theta)) - x*Math.sin(theta) ); 
		
		matrix.setItemMatrix(2, 0, x*z * (1-Math.cos(theta)) - y*Math.sin(theta) ); 
		matrix.setItemMatrix(2, 1, y*z * (1-Math.cos(theta)) + x*Math.sin(theta) ); 
		matrix.setItemMatrix(2, 2, z*z * (1-Math.cos(theta)) + Math.cos(theta) ); 
	}
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	
	// SET 
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(matrix, this); 
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("rotateMatrix");