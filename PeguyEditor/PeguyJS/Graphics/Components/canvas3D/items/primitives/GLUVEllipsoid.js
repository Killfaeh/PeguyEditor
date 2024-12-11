
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLUVEllipsoid($radiusX, $radiusY, $radiusZ, $resolution)
{
	///////////////
	// Attributs //
	///////////////
	
	var radiusX = $radiusX;
	var radiusY = $radiusY;
	var radiusZ = $radiusZ;
	var resolution = $resolution;

	var sphere = new GLUVSphere(1.0, 360.0, 180.0, 0.0, resolution, resolution);
	sphere.setScaleX(radiusX);
	sphere.setScaleY(radiusY);
	sphere.setScaleZ(radiusZ);
	sphere.applyAllTransform();

	//////////////
	// Méthodes //
	//////////////
	
	/*
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display cylinder ! ");
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(sphere, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-uv-ellipsoid");