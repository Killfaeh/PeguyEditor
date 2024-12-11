
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2023 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPolyline($verticesList)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var verticesList = $verticesList;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var colors = [];
		var textures = [];
		var indices = [];

		for (var  i = 0; i < verticesList.length; i++)
		{
			vertices.push(verticesList[i].x);
			vertices.push(verticesList[i].y);
			vertices.push(verticesList[i].z);
			normals.push(0.0);
			normals.push(0.0);
			normals.push(1.0);
			tangentsX.push(1.0);
			tangentsX.push(0.0);
			tangentsX.push(0.0);
			tangentsY.push(0.0);
			tangentsY.push(1.0);
			tangentsY.push(0.0);
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
			textures.push(0.0);
			textures.push(0.0);
		}

		for (var  i = 0; i < verticesList.length-1; i++)
		{
			indices.push(i);
			indices.push(i+1);
		}

		glBuffer.setVertices(vertices);
		glBuffer.setNormals(normals);
		glBuffer.setTangentsX(tangentsX);
		glBuffer.setTangentsY(tangentsY);
		glBuffer.setColors(colors);
		glBuffer.setTexture(textures);
		glBuffer.setIndices(indices);
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
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-polyline");