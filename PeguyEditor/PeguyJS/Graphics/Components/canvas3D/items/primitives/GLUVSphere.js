
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLUVSphere($radius, $angleTheta, $anglePhi, $offsetAnglePhi, $thetaResolution, $phiResolution, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius = $radius;
	
	var angleTheta = $angleTheta;
	
	if (angleTheta <= 0.0 || angleTheta > 360.0)
		angleTheta = 360.0;
	
	var anglePhi = $anglePhi;
	
	if (anglePhi <= 0.0 || anglePhi > 180.0)
		anglePhi = 180.0;
	
	var offsetAnglePhi = $offsetAnglePhi;
	
	if (offsetAnglePhi <= 0.0 || offsetAnglePhi > 180.0)
		offsetAnglePhi = 0.0;
	
	if (offsetAnglePhi + anglePhi > 180.0)
		anglePhi = 180.0 - offsetAnglePhi;
	
	var innerRadius = 0.0;
	
	var thetaResolution = $thetaResolution;
	var phiResolution = $phiResolution;
	
	var textureMode = 0;
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var sphereData = GLData.createUVSphereData(radius, angleTheta, anglePhi, offsetAnglePhi, thetaResolution, phiResolution);

		glBuffer.setVertices(sphereData.vertices);
		glBuffer.setNormals(sphereData.normals);
		glBuffer.setTangentsX(sphereData.tangentsX);
		glBuffer.setTangentsY(sphereData.tangentsY);
		glBuffer.setTexture(sphereData.texture);
		glBuffer.setColors(sphereData.colors);
		glBuffer.setIndices(sphereData.indices);
	};
	
	/*
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display sphere ! ");
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
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-uv-sphere");