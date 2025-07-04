function GLRibbonFromCurve($verticesList, $width, $axis, $cornerMode, $cornerAngle, $cornerResolution)
{
	///////////////
	// Attributs //
	///////////////

	var glBuffer = new GLBuffer();

	var verticesList = $verticesList;

	var width = Math.abs($width);

	if (!utils.isset(width))
		width = 0.1;

	var axis = $axis;

	if (axis !== 'x' && axis !== 'y' && axis !== 'z')
		axis = 'z';

	// 0: On laisse l'angle naturel
	// 1: Mode biseauté
	// 2: Mode arrondi
	var cornerMode = $cornerMode;

	var cornerAngle = $cornerAngle;

	if (!utils.isset(cornerAngle))
		cornerAngle = 0.0;

	if (cornerAngle >= 180.0)
		cornerAngle = 180.0-PEGUY.glPrecision;

	var cornerResolution = $cornerResolution;

	if (!utils.isset(cornerResolution))
		cornerResolution = 16;

	if (cornerResolution < 1)
		cornerResolution = 1;

	var polygonVertices = [];

	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		console.log(verticesList);

		var polygon = new MathPolygon(verticesList);

		var bandData = $this.computeBandData(0.0);

		glBuffer.setVertices(bandData.vertices);
		glBuffer.setNormals(bandData.normals);
		glBuffer.setTangentsX(bandData.tangentsX);
		glBuffer.setTangentsY(bandData.tangentsY);
		glBuffer.setTexture(bandData.texture);
		glBuffer.setColors(bandData.colors);
		glBuffer.setIndices(bandData.indices);
	};

	this.computeBandData = function($z)
	{
		var computedVertices = $this.computeVertices();
		var vertices1 = computedVertices[0];
		var vertices2 = computedVertices[1];
		var angles = computedVertices[2];
		var tmpVertices = computedVertices[3];

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var texture = [];
		var colors = [];
		var indices = [];
		var polygonVertices1 = [];
		var polygonVertices2 = [];
		polygonVertices = [];

		var offsetIndices = 0;

		for (var i = 0; i < vertices1.length; i++)
		{
			if (cornerMode > 0 && cornerAngle > Math.abs(Trigo.deg(angles[i])))
			{
				if (i === 0)
				{
					var vertex1 = tmpVertices[0][0][1];
					var vertex2 = vertices2[0];

					if (angles[0] < 0.0)
					{
						vertex1 = vertices1[0];
						vertex2 = tmpVertices[0][1][1];
					}

					if (axis === 'x')
					{
						vertices.push($z);
						vertices.push(vertex1.x);
						vertices.push(vertex1.y);
						vertices.push($z);
						vertices.push(vertex2.x);
						vertices.push(vertex2.y);
					}
					else if (axis === 'y')
					{
						vertices.push(vertex1.x);
						vertices.push($z);
						vertices.push(vertex1.y);
						vertices.push(vertex2.x);
						vertices.push($z);
						vertices.push(vertex2.y);
					}
					else
					{
						vertices.push(vertex1.x);
						vertices.push(vertex1.y);
						vertices.push($z);
						vertices.push(vertex2.x);
						vertices.push(vertex2.y);
						vertices.push($z);
					}

					indices.push(offsetIndices);
					indices.push(offsetIndices + 1);
					indices.push(offsetIndices + 2);
					indices.push(offsetIndices + 1);
					indices.push(offsetIndices + 3);
					indices.push(offsetIndices + 2);

					offsetIndices = offsetIndices+2;

					polygonVertices1.push(vertex1.values());
					polygonVertices2.push(vertex2.values());
				}

				// Arrondi
				if (cornerMode === 2)
				{
					if (i > 0)
					{
						var triangle = [];
						var pivot = vertices2[i];
						var out1 = tmpVertices[i][0][0];
						var out2 = tmpVertices[i][0][1];

						if (angles[i] < 0.0)
						{
							pivot = vertices1[i];
							out1 = tmpVertices[i][1][0];
							out2 = tmpVertices[i][1][1];
						}

						var f1 = new LinearFunction();
						f1.coefFromPoints([tmpVertices[i][0][0].values(), tmpVertices[i][1][0].values()]);
						var f2 = new LinearFunction();
						f2.coefFromPoints([tmpVertices[i][0][1].values(), tmpVertices[i][1][1].values()]);
						var cornerPivotArray = Polynomials.linearIntersection(f1, f2);
						var cornerPivot = new Vector(cornerPivotArray);

						var cornerVertices = $this.computeRoundCorner(cornerPivot, out1, out2);

						if (angles[i] < 0.0)
						{
							triangle.push(pivot);
							triangle.push(cornerVertices[0]);

							polygonVertices1.push(pivot.values());
							polygonVertices2.push(cornerVertices[0].values());
						}
						else
						{
							triangle.push(cornerVertices[0]);
							triangle.push(pivot);

							polygonVertices1.push(cornerVertices[0].values());
							polygonVertices2.push(pivot.values());
						}

						for (var j = 1; j < cornerVertices.length; j++)
						{
							triangle.push(cornerVertices[j]);

							if (angles[i] < 0.0)
								polygonVertices2.push(cornerVertices[j].values());
							else
								polygonVertices1.push(cornerVertices[j].values());
						}

						for (var j = 0; j < triangle.length; j++)
						{
							if (axis === 'x')
							{
								vertices.push($z);
								vertices.push(triangle[j].x);
								vertices.push(triangle[j].y);
							}
							else if (axis === 'y')
							{
								vertices.push(triangle[j].x);
								vertices.push($z);
								vertices.push(triangle[j].y);
							}
							else
							{
								vertices.push(triangle[j].x);
								vertices.push(triangle[j].y);
								vertices.push($z);
							}
						}

						indices.push(offsetIndices);
						indices.push(offsetIndices + 1);
						indices.push(offsetIndices + 2);

						for (var j = 0; j < triangle.length-3; j++)
						{
							if (angles[i] < 0.0)
							{
								indices.push(offsetIndices);
								indices.push(offsetIndices + 2 + j);
								indices.push(offsetIndices + 3 + j);
							}
							else
							{
								indices.push(offsetIndices + 2 + j);
								indices.push(offsetIndices + 1);
								indices.push(offsetIndices + 3 + j);
							}
						}

						if (i < vertices1.length-1)
						{
							if (angles[i] < 0.0)
							{
								indices.push(offsetIndices);
								indices.push(offsetIndices + triangle.length - 1);
								indices.push(offsetIndices + triangle.length);

								indices.push(offsetIndices + triangle.length - 1);
								indices.push(offsetIndices + 1 + triangle.length);
								indices.push(offsetIndices + triangle.length);
							}
							else
							{
								indices.push(offsetIndices + triangle.length);
								indices.push(offsetIndices + 1);
								indices.push(offsetIndices + 1 + triangle.length);

								indices.push(offsetIndices + triangle.length);
								indices.push(offsetIndices + triangle.length - 1);
								indices.push(offsetIndices + 1);
							}

							offsetIndices = offsetIndices+triangle.length;
						}
					}
				}
				// Biseau
				else
				{
					if (i > 0)
					{
						var triangle = [];
						var pivot = vertices2[i];
						var out1 = tmpVertices[i][0][0];
						var out2 = tmpVertices[i][0][1];

						if (angles[i] < 0.0)
						{
							pivot = vertices1[i];
							out1 = tmpVertices[i][1][0];
							out2 = tmpVertices[i][1][1];

							triangle.push(pivot);
							triangle.push(out1);
							triangle.push(out2);

							polygonVertices1.push(pivot.values());
							polygonVertices2.push(out1.values());
							polygonVertices2.push(out2.values());
						}
						else
						{
							triangle.push(out1);
							triangle.push(pivot);
							triangle.push(out2);

							polygonVertices1.push(out1.values());
							polygonVertices1.push(out2.values());
							polygonVertices2.push(pivot.values());
						}

						for (var j = 0; j < triangle.length; j++)
						{
							if (axis === 'x')
							{
								vertices.push($z);
								vertices.push(triangle[j].x);
								vertices.push(triangle[j].y);
							}
							else if (axis === 'y')
							{
								vertices.push(triangle[j].x);
								vertices.push($z);
								vertices.push(triangle[j].y);
							}
							else
							{
								vertices.push(triangle[j].x);
								vertices.push(triangle[j].y);
								vertices.push($z);
							}
						}

						indices.push(offsetIndices);
						indices.push(offsetIndices + 1);
						indices.push(offsetIndices + 2);

						if (i < vertices1.length-1)
						{
							if (angles[i] < 0.0)
							{
								indices.push(offsetIndices);
								indices.push(offsetIndices + 2);
								indices.push(offsetIndices + 3);

								indices.push(offsetIndices + 2);
								indices.push(offsetIndices + 4);
								indices.push(offsetIndices + 3);
							}
							else
							{
								indices.push(offsetIndices + 2);
								indices.push(offsetIndices + 1);
								indices.push(offsetIndices + 3);

								indices.push(offsetIndices + 4);
								indices.push(offsetIndices + 3);
								indices.push(offsetIndices + 1);
							}

							offsetIndices = offsetIndices+triangle.length;
						}
					}
				}
			}
			else
			{
				polygonVertices1.push(vertices1[i].values());
				polygonVertices2.push(vertices2[i].values());

				if (axis === 'x')
				{
					vertices.push($z);
					vertices.push(vertices1[i].x);
					vertices.push(vertices1[i].y);
					vertices.push($z);
					vertices.push(vertices2[i].x);
					vertices.push(vertices2[i].y);
				}
				else if (axis === 'y')
				{
					vertices.push(vertices1[i].x);
					vertices.push($z);
					vertices.push(vertices1[i].y);
					vertices.push(vertices2[i].x);
					vertices.push($z);
					vertices.push(vertices2[i].y);
				}
				else
				{
					vertices.push(vertices1[i].x);
					vertices.push(vertices1[i].y);
					vertices.push($z);
					vertices.push(vertices2[i].x);
					vertices.push(vertices2[i].y);
					vertices.push($z);
				}

				if (i < vertices1.length-1)
				{
					indices.push(offsetIndices);
					indices.push(offsetIndices + 1);
					indices.push(offsetIndices + 2);
					indices.push(offsetIndices + 1);
					indices.push(offsetIndices + 3);
					indices.push(offsetIndices + 2);
				}

				offsetIndices = offsetIndices+2;
			}
		}

		for (var i = 0; i < polygonVertices1.length; i++)
			polygonVertices.push(polygonVertices1[i]);

		for (var i = polygonVertices2.length-1; i >= 0; i--)
			polygonVertices.push(polygonVertices2[i]);
		
		for (var i = 0; i < vertices.length/3; i++)
		{
			if (axis === 'x')
			{
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

			/*
			var textureX = verticesList[i].x/maxRadius;
			var textureY = verticesList[i].y/maxRadius;

			texture.push(0.5*textureX+0.5);
			texture.push(0.5*textureY+0.5);
			//*/

			texture.push(0.0);
			texture.push(0.0);

			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
			colors.push(1.0);
		}

		var output = 
		{ 
			'vertices': vertices, 
			'normals': normals, 
			'tangentsX': tangentsX, 
			'tangentsY': tangentsY, 
			//'textureTangentsX': textureTangentsX, 
			//'textureTangentsY': textureTangentsY, 
			//'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices,
			'polygonVertices': polygonVertices
		};
		
		return output;
	};

	this.computeRoundCorner = function($pivot, $startOut, $endOut)
	{
		var vertices = [];

		var vectStart = Vectors.delta($pivot, $startOut);
		var vectEnd = Vectors.delta($pivot, $endOut);
		var radius = vectStart.norm();
		var offsetPolar = vectStart.toPolar();
		var angle = Vectors.angle(new Vector([vectStart.x, vectStart.y]), new Vector([vectEnd.x, vectEnd.y]));
		var stepAngle = angle/cornerResolution;

		for (var i = 0; i <= cornerResolution; i++)
		{
			var x = $pivot.x + radius*Math.cos(i*stepAngle + offsetPolar.theta);
			var y = $pivot.y + radius*Math.sin(i*stepAngle + offsetPolar.theta);
			vertices.push(new Vector([x, y, 0.0]));
		}

		return vertices;
	};

	this.computeVertices = function()
	{
		var vertices1 = [];
        var vertices2 = [];
		var angles = [];
		var tmpVertices = [];

        for (var i = 0; i < verticesList.length; i++)
        {
            if (i === 0)
            {
				var vertex = verticesList[0].values();
				var normal = Vectors.delta(verticesList[0], verticesList[1]).normal().values();
                var vertex1 = new Vector([vertex[0]+normal[0]*width/2.0, vertex[1]+normal[1]*width/2.0, 0.0]);
                var vertex2 = new Vector([vertex[0]-normal[0]*width/2.0, vertex[1]-normal[1]*width/2.0, 0.0]);
                vertices1.push(vertex1);
                vertices2.push(vertex2);
                angles.push(360.0);
				tmpVertices.push([[vertex1, vertex1], [vertex2, vertex2]]);
            }
			else if (i === verticesList.length-1)
            {
				var vertex = verticesList[verticesList.length-1].values();
				var normal = Vectors.delta(verticesList[verticesList.length-2], verticesList[verticesList.length-1]).normal().values();
                var vertex1 = new Vector([vertex[0]+normal[0]*width/2.0, vertex[1]+normal[1]*width/2.0, 0.0]);
                var vertex2 = new Vector([vertex[0]-normal[0]*width/2.0, vertex[1]-normal[1]*width/2.0, 0.0]);
                vertices1.push(vertex1);
                vertices2.push(vertex2);
				angles.push(360.0);
				tmpVertices.push([[vertex1, vertex1], [vertex2, vertex2]]);
            }
            else
            {
                var join = getPathJoin(verticesList[i-1], verticesList[i], verticesList[i+1]);
                vertices1.push(join[0]);
                vertices2.push(join[1]);
                angles.push(join[2]);
				tmpVertices.push(join[3]);
            }
        }

		if (Vectors.equal(verticesList[0], verticesList[verticesList.length-1], Math.pow(10, -PEGUY.glPrecision)))
		{
			var join = getPathJoin(verticesList[verticesList.length-2], verticesList[0], verticesList[1]);
			vertices1[0] = join[0];
            vertices2[0] = join[1];
            angles[0] = join[2];
			tmpVertices[0] = join[3];
			vertices1[vertices1.length-1] = join[0];
            vertices2[vertices2.length-1] = join[1];
            angles[angles.length-1] = join[2];
            tmpVertices[tmpVertices.length-1] = join[3];
		}

		return [vertices1, vertices2, angles, tmpVertices];
	};

	var getPathJoin = function($prevVertex, $vertex, $nextVertex)
    {
		var vertex = $vertex.values();
		var prevVertex = $prevVertex.values();
		var nextVertex = $nextVertex.values();

		var prev = Vectors.delta($prevVertex, $vertex);
		var next = Vectors.delta($vertex, $nextVertex);

		var prevNormal = prev.normal().values();
        var nextNormal = next.normal().values();

		prev = new Vector([prev.x, prev.y]);
		next = new Vector([next.x, next.y]);
		var angle = Vectors.angle(next, prev.opposite());

        var prevVertex1 = [Math.roundToDigit(prevVertex[0]+prevNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(prevVertex[1]+prevNormal[1]*width/2.0, PEGUY.glPrecision)];

        var prevVertex2 = [Math.roundToDigit(prevVertex[0]-prevNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(prevVertex[1]-prevNormal[1]*width/2.0, PEGUY.glPrecision)];

        var cur1Vertex1 = [Math.roundToDigit(vertex[0]+prevNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(vertex[1]+prevNormal[1]*width/2.0, PEGUY.glPrecision)];

        var cur1Vertex2 = [Math.roundToDigit(vertex[0]-prevNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(vertex[1]-prevNormal[1]*width/2.0, PEGUY.glPrecision)];

        var cur2Vertex1 = [Math.roundToDigit(vertex[0]+nextNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(vertex[1]+nextNormal[1]*width/2.0, PEGUY.glPrecision)];

        var cur2Vertex2 = [Math.roundToDigit(vertex[0]-nextNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(vertex[1]-nextNormal[1]*width/2.0, PEGUY.glPrecision)];

        var nextVertex1 = [Math.roundToDigit(nextVertex[0]+nextNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(nextVertex[1]+nextNormal[1]*width/2.0, PEGUY.glPrecision)];

        var nextVertex2 = [Math.roundToDigit(nextVertex[0]-nextNormal[0]*width/2.0, PEGUY.glPrecision), 
							Math.roundToDigit(nextVertex[1]-nextNormal[1]*width/2.0, PEGUY.glPrecision)];

        var prevF1 = new LinearFunction();
        prevF1.coefFromPoints([prevVertex1, cur1Vertex1]);
        var nextF1 = new LinearFunction();
        nextF1.coefFromPoints([cur2Vertex1, nextVertex1]);
        var vertex1 = Polynomials.linearIntersection(prevF1, nextF1);

		if (vertex1.length <= 0)
			vertex1 = cur1Vertex1;

        var prevF2 = new LinearFunction();
        prevF2.coefFromPoints([prevVertex2, cur1Vertex2]);
        var nextF2 = new LinearFunction();
        nextF2.coefFromPoints([cur2Vertex2, nextVertex2]);
        var vertex2 = Polynomials.linearIntersection(prevF2, nextF2);

		if (vertex2.length <= 0)
			vertex2 = cur1Vertex2;

		vertex1[0] = parseFloat(parseFloat(vertex1[0]).toFixed(PEGUY.glPrecision));
		vertex1[1] = parseFloat(parseFloat(vertex1[1]).toFixed(PEGUY.glPrecision));
		vertex2[0] = parseFloat(parseFloat(vertex2[0]).toFixed(PEGUY.glPrecision));
		vertex2[1] = parseFloat(parseFloat(vertex2[1]).toFixed(PEGUY.glPrecision));

        return [new Vector(vertex1), new Vector(vertex2), angle, [[new Vector(cur1Vertex1), new Vector(cur2Vertex1)], [new Vector(cur1Vertex2), new Vector(cur2Vertex2)]]];
    };

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getPolygonVertices = function() { return polygonVertices; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(glBuffer, this);
	init();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-ribbon-from-curve");