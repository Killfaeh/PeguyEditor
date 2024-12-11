
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLBoundingBox()
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	var boundingBox = new GLBuffer();
	glBuffer.setVertexShaderName('vertex-color');
	glBuffer.setFragmentShaderName('fragment-color');
	boundingBox.setVertexShaderName('vertex-color');
	boundingBox.setFragmentShaderName('fragment-color');
	
	var displayed = false;
	
	var minX = Number.MAX_VALUE;
	var maxX = -Number.MAX_VALUE;
	var minY = Number.MAX_VALUE;
	var maxY = -Number.MAX_VALUE;
	var minZ = Number.MAX_VALUE;
	var maxZ = -Number.MAX_VALUE;
	
	this.isBoundingBox = true;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		
		
		if (glBuffer.isInit() === false)
		{
			var vertices = glBuffer.getVertices();
			var nbVertices = vertices.length/3;
			
			for (var i = 0; i < nbVertices; i++)
			{
				var index = i*3;
				
				if (vertices[index] < minX)
					minX = vertices[index];
				else if (vertices[index] > maxX)
					maxX = vertices[index];
				
				if (vertices[index+1] < minY)
					minY = vertices[index+1];
				else if (vertices[index+1] > maxY)
					maxY = vertices[index+1];
				
				if (vertices[index+2] < minZ)
					minZ = vertices[index+2];
				else if (vertices[index+2] > maxZ)
					maxZ = vertices[index+2];
			}
			
			boundingBox.setMode($context.LINES);
			
			boundingBox.setVertices(
			[
				// Front face
				minX, minY, minZ,
				maxX, minY, minZ,
				maxX, minY, maxZ,
				minX, minY, maxZ,
				
				// Back face
				minX, maxY, minZ,
				maxX, maxY, minZ,
				maxX, maxY, maxZ,
				minX, maxY, maxZ
			]);
			
			boundingBox.setColors(
			[
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0,
				1.0, 0.0, 1.0, 1.0
			]);
			
			boundingBox.setIndices(
			[
				0, 1,
				1, 2,
				2, 3,
				3, 0,
				4, 5,
				5, 6,
				6, 7,
				7, 4,
				0, 4,
				1, 5,
				2, 6,
				3, 7
			]);
			
			boundingBox.init($context);

			this.execSuper('init', [$context], initialisation);
		}
	};
	
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		
		if (displayed === true)
		{
			boundingBox.linkShaders($context);
			boundingBox.setX(glBuffer.getX());
			boundingBox.setY(glBuffer.getY());
			boundingBox.setZ(glBuffer.getZ());
			boundingBox.setTheta(glBuffer.getTheta());
			boundingBox.setPhi(glBuffer.getPhi());
			boundingBox.setOmega(glBuffer.getOmega());
			boundingBox.setScaleX(glBuffer.getScaleX());
			boundingBox.setScaleY(glBuffer.getScaleY());
			boundingBox.setScaleZ(glBuffer.getScaleZ());
			boundingBox.display($context);
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.isDisplayed = function() { return displayed; };
	this.getMinX = function() { return minX; };
	this.getMaxX = function() { return maxX; };
	this.getMinY = function() { return minY; };
	this.getMaxY = function() { return maxY; };
	this.getMinZ = function() { return minZ; };
	this.getMaxZ = function() { return maxZ; };
	
	// SET
	this.setDisplayBoundingBox = function($displayed) { displayed = $displayed; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-bounding-box");