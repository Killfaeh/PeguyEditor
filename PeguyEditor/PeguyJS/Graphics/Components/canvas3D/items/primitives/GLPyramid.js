
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPyramid($radius, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill, $bottomClosed, $radiusResolution, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var prism = new GLPrism($radius, 0.000001, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill, $bottomClosed, false, $radiusResolution, $textureMode);
	
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
	Loader.hasLoaded("gl-pyramid");