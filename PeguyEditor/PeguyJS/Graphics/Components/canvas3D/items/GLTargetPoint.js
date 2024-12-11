
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLTargetPoint()
{
	///////////////
	// Attributs //
	///////////////
	
	var buffer = new GLBuffer();
	buffer.setVertexShaderName('vertex-color');
	buffer.setFragmentShaderName('fragment-color');
	
	var size = 0.25;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (buffer.isInit() === false)
		{
			buffer.setMode($context.LINES);
			
			buffer.setVertices(
			[
				-size, 0.0, 0.0,
				size, 0.0, 0.0,
				
				0.0, -size, 0.0,
				0.0, size, 0.0,
				
				0.0, 0.0, -size,
				0.0, 0.0, size
			]);
			
			buffer.setColors(
			[
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 0.0, 1.0
			]);
			
			buffer.setIndices([0, 1, 2, 3, 4, 5]);
			
			this.execSuper('init', [$context], initialisation);
		}
	}
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(buffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-target-point");