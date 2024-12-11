
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2023 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLRect($widthX, $widthY)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var widthX = $widthX;
	var widthY = $widthY;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var halfX = widthX/2.0;
		var halfY = widthY/2.0;
		
		//console.log($context);
		
		//glBuffer.setMode($context.QUADS);
		
		glBuffer.setVertices(
		[
			-halfX, -halfY, 0.0,
			 halfX, -halfY, 0.0,
			 halfX,  halfY, 0.0,
			-halfX,  halfY, 0.0
		]);
		
		glBuffer.setNormals(
		[
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		]);
		
		glBuffer.setTangentsX(
		[
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0
		]);
		
		glBuffer.setTangentsY(
		[
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0
		]);
		
		glBuffer.setColors(
		[
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		]);

		glBuffer.setTexture(
		[
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0
		]);
		
		glBuffer.setIndices([0, 2, 1, 0, 3, 2]);
	};

	/*
	this.render = function render($context)
	{
		this.execSuper('render', [$context], render);
		console.log("Display rect ! ");
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getWidthX = function() { return widthX; };
	this.getWidthY = function() { return widthY; };
	
	// SET
	this.setWidthX = function($widthX)
	{
		widthX = $widthX;
		init();
	};

	this.setWidthY = function($widthY)
	{
		widthY = $widthY;
		init();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-rect");