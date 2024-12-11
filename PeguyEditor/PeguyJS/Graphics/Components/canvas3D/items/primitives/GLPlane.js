
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPlane($widthX, $widthY)
{
	///////////////
	// Attributs //
	///////////////
	
	var boundingBox = new GLBoundingBox();
	
	var widthX = $widthX;
	var widthY = $widthY;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (boundingBox.isInit() === false)
		{
			var halfX = widthX/2.0;
			var halfY = widthY/2.0;
			
			boundingBox.setVertices(
			[
				-halfX, -halfY, 0.0,
				 halfX, -halfY, 0.0,
				 halfX,  halfY, 0.0,
				-halfX,  halfY, 0.0
			]);
			
			boundingBox.setNormals(
			[
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0
			]);
			
			boundingBox.setTangentsX(
			[
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0
			]);
			
			boundingBox.setTangentsY(
			[
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0
			]);
			
			boundingBox.setColors(
			[
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 1.0, 1.0
			]);
			
			boundingBox.setTexture(
			[
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0
			]);
			
			boundingBox.setIndices([0, 2, 1, 0, 3, 2]);
			
			this.execSuper('init', [$context], initialisation);
		}
	};
	
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display plane ! ");
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getWidthX = function() { return widthX; };
	this.getWidthY = function() { return widthY; };
	
	// SET
	this.setWidthX = function($widthX) { widthX = $widthX; };
	this.setWidthY = function($widthY) { widthY = $widthY; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(boundingBox, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-plane");