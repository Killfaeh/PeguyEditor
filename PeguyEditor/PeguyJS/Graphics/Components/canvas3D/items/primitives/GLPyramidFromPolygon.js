
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPyramidFromPolygon($radius, $height, $deltaX, $deltaY, $verticesList, $heightResolution, $bottomClosed, $textureMode, $axis)
{
	///////////////
	// Attributs //
	///////////////

	var axis = $axis;

	if (axis !== 'x' && axis !== 'y' && axis !== 'z')
		axis = 'z';
	
	var prism = new GLPrismFromPolygon($radius, Math.pow(10, -PEGUY.glPrecision), $height, $deltaX, $deltaY, $verticesList, $heightResolution, $bottomClosed, false, $textureMode, axis);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(prism, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-pyramid-from-polygon");