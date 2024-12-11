
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2020 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLDisc($radius, $angle, $radiusResolution, $thetaResolution)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius = $radius;
	var angle = $angle;
	var radiusResolution = $radiusResolution;
	var thetaResolution = $thetaResolution;
	
	if (radius <= 0.0)
		radius = 0.000001;

	if (angle <= 0.0 || angle > 360.0)
		angle = 360.0;
	
	if (radiusResolution < 1)
		radiusResolution = 1;
	
	if (thetaResolution < 3)
		thetaResolution = 3;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var discData = GLData.createDiscData(radius, angle, radiusResolution, thetaResolution);

		glBuffer.setVertices(discData.vertices);
		glBuffer.setNormals(discData.normals);
		glBuffer.setTangentsX(discData.tangentsX);
		glBuffer.setTangentsY(discData.tangentsY);
		glBuffer.setTexture(discData.texture);
		glBuffer.setColors(discData.colors);
		glBuffer.setIndices(discData.indices);
	};
	
	/*
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display circle ! ");
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
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-disc");