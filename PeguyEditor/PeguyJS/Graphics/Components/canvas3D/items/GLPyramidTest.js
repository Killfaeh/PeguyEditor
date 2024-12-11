
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPyramidTest()
{
	///////////////
	// Attributs //
	///////////////
	
	var boundingBox = new GLBoundingBox();
	//boundingBox.setShaderName('color3d');
	boundingBox.setVertexShaderName('vertex-color');
	boundingBox.setFragmentShaderName('fragment-color');
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (boundingBox.isInit() === false)
		{
			boundingBox.setVertices(
			[
				//Front face
				0.0,   0.0,  1.0,
				-1.0, -1.0, -1.0,
				1.0,  -1.0, -1.0,

				// Right face
				0.0,  0.0,  1.0,
				1.0, -1.0, -1.0,
				1.0,  1.0, -1.0,

				// Back face
				0.0,  0.0,  1.0,
				-1.0, 1.0, -1.0,
				1.0,  1.0, -1.0,

				// Left face
				0.0,   0.0,  1.0,
				-1.0, -1.0, -1.0,
				-1.0,  1.0, -1.0
			]);
					
			boundingBox.setColors(
			[
				//Front face
				1.0, 0.0, 0.0, 1.0,
				1.0, 0.0, 0.0, 1.0,
				1.0, 0.0, 0.0, 1.0,

				// Right face
				0.0, 1.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,

				// Back face
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 1.0, 1.0,

				// Left face
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0
			]);
					
			/*
			// Version jolie mais pas pratique pour débuguer
			boundingBox.setColors(
			[
				//Front face
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,

				// Right face
				1.0, 0.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 1.0, 0.0, 1.0,

				// Back face
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,

				// Left face
				1.0, 0.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 1.0, 0.0, 1.0
			]);
			//*/

			boundingBox.setIndices([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
			
			this.execSuper('init', [$context], initialisation);
		}
	}
	
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display pyramid test ! ");
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(boundingBox, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-pyramid-test");