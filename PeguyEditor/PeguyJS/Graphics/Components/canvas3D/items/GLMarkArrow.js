
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLMarkArrow($size, $color)
{
	///////////////
	// Attributs //
	///////////////
	
	var size = $size;
	var color = $color;
	
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
				0.0,    0.0,   size,
				-size, -size, -size,
				size,  -size, -size,

				// Right face
				0.0,   0.0,   size,
				size, -size, -size,
				size,  size, -size,

				// Back face
				0.0,   0.0,   size,
				-size, size, -size,
				size,  size, -size,

				// Left face
				0.0,    0.0,   size,
				-size, -size, -size,
				-size,  size, -size
			]);
			
			colors = [];
			
			for (var i = 0; i < 12; i++)
			{
				for (var j = 0; j < color.length; j++)
					colors.push(color[j]);
			}
			
			boundingBox.setColors(colors);

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
	Loader.hasLoaded("gl-mark-arrow");