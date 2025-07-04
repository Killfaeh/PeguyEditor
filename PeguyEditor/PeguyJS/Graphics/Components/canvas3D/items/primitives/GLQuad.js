
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2023 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLQuad($verticesList)
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
		//glBuffer.setMode($context.QUADS);

		var vertices = [];

		for (var i = 0; i < 4; i++)
		{
			var vertex = verticesList[i];

			vertices.push(vertex.x);
			vertices.push(vertex.y);
			vertices.push(vertex.z);
		}

		var vector1 = new Vector([verticesList[1].x-verticesList[0].x, verticesList[1].y-verticesList[0].y, verticesList[1].z-verticesList[0].z]);
		var vector2 = new Vector([verticesList[3].x-verticesList[0].x, verticesList[3].y-verticesList[0].y, verticesList[3].z-verticesList[0].z]);
		var normal = Vectors.crossProduct(vector1, vector2).normalize();
		var tangentX = Vectors.crossProduct(new Vector([0.0, 1.0, 0.0]), normal).normalize();
		var tangentY = Vectors.crossProduct(normal, tangentX).normalize();
		
		glBuffer.setVertices(vertices);
		
		glBuffer.setNormals(
		[
			normal.x, normal.y, normal.z,
			normal.x, normal.y, normal.z,
			normal.x, normal.y, normal.z,
			normal.x, normal.y, normal.z
		]);
		
		glBuffer.setTangentsX(
		[
			tangentX.x, tangentX.y, tangentX.z,
			tangentX.x, tangentX.y, tangentX.z,
			tangentX.x, tangentX.y, tangentX.z,
			tangentX.x, tangentX.y, tangentX.z
		]);
		
		glBuffer.setTangentsY(
		[
			tangentY.x, tangentY.y, tangentY.z,
			tangentY.x, tangentY.y, tangentY.z,
			tangentY.x, tangentY.y, tangentY.z,
			tangentY.x, tangentY.y, tangentY.z
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
	this.getVerticesList = function() { return verticesList; };
	
	// SET
	this.setVerticesList = function($verticesList)
	{
		verticesList = $verticesList;
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
	Loader.hasLoaded("gl-quad");