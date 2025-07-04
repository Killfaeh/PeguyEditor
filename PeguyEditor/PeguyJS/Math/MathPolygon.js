
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function MathPolygon($verticesList)
{
	///////////////
	// Attributs //
	///////////////
	
	var verticesList = $verticesList;

	if (!utils.isset(verticesList))
		verticesList = [];

	for (var i = 0; i < verticesList.length; i++)
	{
		if (Array.isArray(verticesList[i]) || !utils.isset(verticesList[i].type) || verticesList[i].type !== 'Vector')
			verticesList[i] = new Vector(verticesList[i]);
	}
	
	var concave = false;
	var polygonDeterminant = 0.0;
	var polygonOrientation = 0.0;
	var triangulationVertices = [];
	var triangulationIndices = [];
	var centroid = new Vector([0.0, 0.0]);
	
	//////////////
	// Méthodes //
	//////////////
	
	// (x2 − x1)(y2 + y1)

	this.updateOrientation = function($verticesList)
	{
		//console.log("UPDATE ORIENTATION");

		var globalOrientation = 0.0;
		var positive = 0; 
		var negative = 0;
		var isConcave = false;

		for (var i = 0; i < $verticesList.length; i++)
		{
			var nextI = i+1;

			if (i === $verticesList.length-1)
				nextI = 0;

			var vertex1 = $verticesList[i];
			var vertex2 = $verticesList[nextI];

			var orientation = (vertex2.x - vertex1.x)*(vertex2.y - vertex1.y);

			//console.log("Orientation : " + orientation);

			if (orientation > 0.0)
				positive++; 
			else if (orientation < 0.0)
				negative++; 

			globalOrientation = globalOrientation + orientation;
		}

		if (positive > 0 && negative > 0)
			isConcave = true; 
		else
			isConcave = false; 

		//console.log("Orientation globale : " + globalOrientation);

		return { orientation: globalOrientation, concave: isConcave};
	};

	this.updateDeterminant = function()
	{
		//console.log("UPDATE DETERMINANT");

		polygonDeterminant = 0.0;
		var positive = 0; 
		var negative = 0; 
		
		for (var i = 0; i < verticesList.length; i++)
		{
			var j = 0;
			var k = 0;
			
			if (i === verticesList.length-1)
			{
				j = 0;
				k = 1;
			}
			else if (i === verticesList.length-2)
			{
				j = i+1;
				k = 0;
			}
			else
			{
				j = i+1;
				k = i+2;
			}
			
			var vertexI = verticesList[i];
			var vertexJ = verticesList[j];
			var vertexK = verticesList[k];
			
			var determinant = Vectors.pointsDeterminant2D(vertexI, vertexJ, vertexK);

			//console.log("Determinant : " + determinant);
			
			if (determinant > 0.0)
				positive++; 
			else if (determinant < 0.0)
				negative++; 
			
			polygonDeterminant = polygonDeterminant + determinant;
		}
		
		if (positive > 0 && negative > 0)
			concave = true; 
		else
			concave = false; 
		
		/*
		if (positive > negative)
			polygonDeterminant = 1.0;
		else if (positive < negative)
			polygonDeterminant = -1.0;
		else
			polygonDeterminant = 0.0; // Ça ne devrait pas arriver
		//*/
		
		//console.log("Déterminant global : " + polygonDeterminant);
	};
	
	this.updateIndices = function($reroll)
	{
		triangulationVertices = [];
		
		var verticesStack = [];
		
		for (var i = 0; i < verticesList.length; i++)
		{
			verticesList[i].index = i;
			verticesStack.push(verticesList[i]);
		}

		var loop = true;

		while (loop === true)
		{
			//console.log("Vertices stack length : " + verticesStack.length);
			//console.log(verticesStack);

			var minAngle = 2.0*Math.PI;
			var minVertex = null;
			var minVertexPrev = null;
			var minVertexNext = null;
			var minDeterminant = 0.0;

			for (var i = 0; i < verticesStack.length; i++)
			{
				//console.log(i + '/' + verticesStack.length);

				var prevI = 0;
				var nextI = 0;

				if (i === 0)
				{
					prevI = verticesStack.length-1;
					nextI = 1;
				}
				else if (i === verticesStack.length-1)
				{
					prevI = verticesStack.length-2;
					nextI = 0;
				}
				else
				{
					prevI = i-1;
					nextI = i+1;
				}
				
				var vertex = verticesStack[i];
				var vertexPrev = verticesStack[prevI];
				var vertexNext = verticesStack[nextI];

				var valid = true;
				var determinant = Vectors.pointsDeterminant2D(vertexPrev, vertex, vertexNext);

				//console.log("Determinant : " + determinant + ', ' + polygonDeterminant + ', ' + (determinant*polygonDeterminant) + ', ' + concave);

				if (determinant*polygonDeterminant < 0)
					valid = false;

				if (valid)
				{
					var angle1 = Trigo.atan(vertex.y-vertexPrev.y, vertex.x-vertexPrev.x);
					var angle2 = Trigo.atan(vertexNext.y-vertex.y, vertexNext.x-vertex.x);
					var angle = Math.abs(angle2 - angle1);

					if (isNaN(angle))
						angle = 0.0;

					//console.log("Angle : " + angle);

					if (angle < minAngle)
					{
						var vertexInTriangle = false;

						for (var j = 0; j < verticesStack.length; j++)
						{
							if (j !== i && j !== prevI && j !== nextI)
							{
								vertexInTriangle = Vectors.pointInTriangle(verticesStack[j], [vertexPrev, vertex, vertexNext]);

								if (vertexInTriangle === true)
									j = verticesStack.length;
							}
						}

						if (vertexInTriangle === false)
						{
							minAngle = angle;
							minVertex = vertex;
							minVertexPrev = vertexPrev;
							minVertexNext = vertexNext;
							minDeterminant = determinant;
						}
					}
				}
			}

			//console.log("Minvertex : ");
			//console.log(minVertex);

			if (minDeterminant !== 0.0)
			{
				triangulationVertices.push(minVertexPrev);
				triangulationVertices.push(minVertex);
				triangulationVertices.push(minVertexNext);
			}

			var index = verticesStack.indexOf(minVertex);
		
			//console.log("Vertex to remove index : " + index);

			if (index >= 0)
				verticesStack.splice(index, 1);
			else
				loop = false;

			if (verticesStack.length <= 3)
				loop = false;
		}
		
		//console.log($reroll);
		//console.log("Rest in stack : " + verticesStack.length);
		//console.log(verticesStack);
		//Debug.callstack();

		//*
		if (verticesStack.length > 3 && $reroll === true)
		{
			polygonOrientation = -polygonOrientation;
			polygonDeterminant = -polygonDeterminant;
			$this.updateIndices(false);
		}
		else if (verticesStack.length === 3)
		{
			for (var i = 0; i < verticesStack.length; i++)
				triangulationVertices.push(verticesStack[i]);

			triangulationIndices = [];
			
			for (var i = 0; i < triangulationVertices.length; i++)
				triangulationIndices.push(triangulationVertices[i].index);
		}
		else
		{
			triangulationIndices = [];
			
			for (var i = 0; i < triangulationVertices.length; i++)
				triangulationIndices.push(triangulationVertices[i].index);
			
			//console.log("Indices de triangulation");
			//console.log(triangulationVertices);
			//console.log(triangulationIndices);
		}
	};

	this.updateCentroid = function()
	{
		centroid = new Vector([0.0, 0.0]);
			
		for (var i = 0; i < verticesList.length; i++)
		{
			centroid.setX(centroid.x + verticesList[i].x);
			centroid.setY(centroid.y + verticesList[i].y);
		}
		
		centroid.setX(centroid.x/verticesList.length);
		centroid.setY(centroid.y/verticesList.length);

		return centroid;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getVertices = function() { return verticesList; };
	this.isConcave = function() { return concave; };
	this.getDeterminant = function() { return polygonDeterminant; };
	this.getOrientation = function() { return polygonOrientation; };

	this.getIndices = function()
	{
		var listToReturn = triangulationIndices;

		if (polygonOrientation < 0.0 || polygonDeterminant < 0.0)
		{
			listToReturn = [];

			for (var i = triangulationIndices.length-1; i >= 0; i--)
				listToReturn.push(triangulationIndices[i]);
		}

		return listToReturn;
	};

	this.getCentroid = function() { return centroid; };

	this.getMaxRadius = function()
	{
		var maxRadius = 0.0;
			
		for (var i = 0; i < verticesList.length; i++)
		{
			var deltaX = verticesList[i].x - centroid.x;
			var deltaY = verticesList[i].y - centroid.y;
			var radius = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
			
			if (radius > maxRadius)
				maxRadius = radius;
		}

		return maxRadius;
	};
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = this;
	$this.updateCentroid();
	$this.updateDeterminant();
	//var orientation = $this.updateOrientation(verticesList);
	//polygonOrientation = orientation.orientation;
	//concave = orientation.concave;
	$this.updateIndices(true);
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("math-polygon");