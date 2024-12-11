
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                https://www.suiseipark.com/                 ////
////////////////////////////////////////////////////////////////////

function GLCone($radius, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill, $bottomClosed, $radiusResolution, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var cylinder = new GLCylinder($radius, 0.0, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill, $bottomClosed, false, true, $radiusResolution, $textureMode);
	
	//////////////
	// Méthodes //
	//////////////
	
	/*
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display cone ! ");
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET

	this.setColor = function($red, $green, $blue, $alpha)
	{
		var colors = [];
		var nbVertices = this.getNbVertices();

		for (var i = 0; i < nbVertices; i++)
		{
			colors.push($red);
			colors.push($green);
			colors.push($blue);
			colors.push($alpha);
		}

		this.setColors(colors);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(cylinder, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-cone");