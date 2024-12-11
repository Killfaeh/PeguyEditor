
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLCuboidSphere($radius, $resolution, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius = $radius;
	var resolution = $resolution;
	
	var textureMode = 0;
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////
	
	var init = function()
	{
		var sphereData = GLData.createCuboidSphereData(radius, resolution, textureMode);

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
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-cuboid-sphere");