
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPolygon($verticesList, $axis, $center)
{
	///////////////
	// Attributs //
	///////////////

	var glBuffer = new GLBuffer();

	var verticesList = $verticesList;

	var axis = $axis;

	if (axis !== 'x' && axis !== 'y' && axis !== 'z')
		axis = 'z';

	var center = $center;

	if (!utils.isset(center) || center !== true)
		center = false;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var polygon = new MathPolygon(verticesList);

		// Calcul du barycentre du polygon
			
		var centroid = polygon.getCentroid();
		
		// Déplacement des points pour placer le barycentre sur l'origine
		
		if (center === true)
		{
			for (var i = 0; i < verticesList.length; i++)
			{
				verticesList[i].setX(verticesList[i].x - centroid.x);
				verticesList[i].setY(verticesList[i].y - centroid.y);
			}
		}
		
		//$this.updateDeterminant();
		
		// Calcul de le distance la plus éloignée
		
		var maxRadius = 0.0;
		
		for (var i = 0; i < verticesList.length; i++)
		{
			var radius = Math.sqrt(verticesList[i].x*verticesList[i].x + verticesList[i].y*verticesList[i].y);
			
			if (radius > maxRadius)
				maxRadius = radius;
		}
		
		// Calcul des points des normales et tout...
		
		var polygonTriangles = polygon.getIndices();
		
		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var texture = [];
		var colors = [];
		var indices = [];
		
		for (var i = 0; i < verticesList.length; i++)
		{
			if (axis === 'x')
			{
				vertices.push(0.0);
				vertices.push(verticesList[i].x);
				vertices.push(verticesList[i].y);

				normals.push(1.0);
				normals.push(0.0);
				normals.push(0.0);

				tangentsX.push(0.0);
				tangentsX.push(1.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
			}
			else if (axis === 'y')
			{
				vertices.push(verticesList[i].x);
				vertices.push(0.0);
				vertices.push(verticesList[i].y);

				normals.push(0.0);
				normals.push(-1.0);
				normals.push(0.0);

				tangentsX.push(0.0);
				tangentsX.push(0.0);
				tangentsX.push(1.0);
				
				tangentsY.push(1.0);
				tangentsY.push(0.0);
				tangentsY.push(0.0);
			}
			else
			{
				vertices.push(verticesList[i].x);
				vertices.push(verticesList[i].y);
				vertices.push(0.0);

				normals.push(0.0);
				normals.push(0.0);
				normals.push(1.0);

				tangentsX.push(1.0);
				tangentsX.push(0.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(1.0);
				tangentsY.push(0.0);
			}

			var textureX = verticesList[i].x/maxRadius;
			var textureY = verticesList[i].y/maxRadius;
			
			texture.push(0.5*textureX+0.5);
			texture.push(0.5*textureY+0.5);
		}
		
		for (var i = polygonTriangles.length-1; i >= 0; i--)
			indices.push(polygonTriangles[i]);

		glBuffer.setVertices(vertices);
		
		for (var i = 0; i < glBuffer.getNbVertices(); i++)
		{
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
		}
		
		glBuffer.setNormals(normals);
		glBuffer.setTangentsX(tangentsX);
		glBuffer.setTangentsY(tangentsY);
		glBuffer.setTexture(texture);
		glBuffer.setIndices(indices);
	};
	
	/*
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display polygon ! ");
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
	Loader.hasLoaded("gl-polygon");