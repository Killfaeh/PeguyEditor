
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2023 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLLine($x1, $y1, $z1, $x2, $y2, $z2)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var x1 = $x1;
	var y1 = $y1;
	var z1 = $z1;
	var x2 = $x2;
	var y2 = $y2;
	var z2 = $z2;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		glBuffer.setVertices(
		[
			x1, y1, z1,
			x2, y2, z2
		]);
		
		glBuffer.setNormals(
		[
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0
		]);
		
		glBuffer.setTangentsX(
		[
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0
		]);
		
		glBuffer.setTangentsY(
		[
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0
		]);
		
		glBuffer.setColors(
		[
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		]);
		
		glBuffer.setTexture(
		[
			0.0, 0.0,
			0.0, 1.0
		]);
		
		glBuffer.setIndices([0, 1]);
	};

	this.init = function initialisation($context)
	{
		if (glBuffer.isInit() === false)
		{
			glBuffer.setMode($context.LINES);
			this.execSuper('init', [$context], initialisation);
		}
	};

	/*
	this.render = function render($context)
	{
		this.execSuper('render', [$context], render);
		console.log("Display line ! ");
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getX1 = function() { return x1; };
	this.getY1 = function() { return y1; };
	this.getZ1 = function() { return z1; };
	this.getX2 = function() { return x2; };
	this.getY2 = function() { return y2; };
	this.getZ2 = function() { return z2; };
	
	// SET
	this.setX1 = function($x1)
	{
		x1 = $x1;
		init();
	};

	this.setY1 = function($y1)
	{
		y1 = $y1;
		init();
	};

	this.setZ1 = function($z1)
	{
		z1 = $z1;
		init();
	};

	this.setX2 = function($x2)
	{
		x2 = $x2;
		init();
	};

	this.setY2 = function($y2)
	{
		y2 = $y2;
		init();
	};

	this.setZ2 = function($z2)
	{
		z2 = $z2;
		init();
	};

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
	Loader.hasLoaded("gl-line");