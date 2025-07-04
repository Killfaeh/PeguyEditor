GLData = 
{
	concatArray: function($array1, $array2)
	{
		var output = [];

		for (var i = 0; i < $array1.length; i++)
			output.push($array1[i]);
		
		for (var i = 0; i < $array2.length; i++)
			output.push($array2[i]);

		return output;
	},

	concatData: function($data1, $data2)
	{
		var nbVertices = $data1.vertices.length/3;

		var vertices = GLData.concatArray($data1.vertices, $data2.vertices);
		var normals = GLData.concatArray($data1.normals, $data2.normals);
		var tangentsX = GLData.concatArray($data1.tangentsX, $data2.tangentsX);
		var tangentsY = GLData.concatArray($data1.tangentsY, $data2.tangentsY);
		var textureTangentsX = GLData.concatArray($data1.textureTangentsX, $data2.textureTangentsX);
		var textureTangentsY = GLData.concatArray($data1.textureTangentsY, $data2.textureTangentsY);
		var textureTangentsZ = GLData.concatArray($data1.textureTangentsZ, $data2.textureTangentsZ);
		var texture = GLData.concatArray($data1.texture, $data2.texture);
		var colors = GLData.concatArray($data1.colors, $data2.colors);

		var indicesToAdd = [];

		for (var j = 0; j < $data2.indices.length; j++)
			indicesToAdd.push($data2.indices[j]+nbVertices);
		
		var indices = GLData.concatArray($data1.indices, indicesToAdd);

		var output = 
		{ 
			'vertices': vertices, 
			'normals': normals, 
			'tangentsX': tangentsX, 
			'tangentsY': tangentsY, 
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createDiscData: function($radius, $angle, $radiusResolution, $thetaResolution)
	{
		var radius = $radius;
		var angle = $angle;
		var radiusResolution = $radiusResolution;
		var thetaResolution = $thetaResolution;

		if (radius <= 0.0)
			radius = 0.000001;

		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
		
		if (radiusResolution < 1)
			radiusResolution = 1;
		
		if (thetaResolution < 3)
			thetaResolution = 3;
		
		var stepRadius = radius/radiusResolution;
		var radAngle = angle/180.0*Math.PI;
		var stepAngle = radAngle/thetaResolution;
		
		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		vertices.push(0.0);
		vertices.push(0.0);
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
		
		texture.push(0.5);
		texture.push(0.5);

		var nbThetaStep = thetaResolution;

		if (angle < 360.0)
			nbThetaStep = thetaResolution+1;

		for (var i = 0; i < radiusResolution; i++)
		{
			var tmpRadius = (i+1)*stepRadius;

			for (var j = 0; j < nbThetaStep; j++)
			{
				var tmpAngle = j*stepAngle;

				var x = tmpRadius*Math.cos(tmpAngle);
				var y = tmpRadius*Math.sin(tmpAngle);
				
				normals.push(0.0);
				normals.push(0.0);
				normals.push(1.0);
				
				tangentsX.push(1.0);
				tangentsX.push(0.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(1.0);
				tangentsY.push(0.0);
				
				vertices.push(x);
				vertices.push(y);
				vertices.push(0.0);
				
				texture.push(0.5*(tmpRadius/radius)*Math.cos(tmpAngle)+0.5);
				texture.push(0.5*(tmpRadius/radius)*Math.sin(tmpAngle)+0.5);
			}
		}

		for (var i = 0; i < radiusResolution; i++)
		{
			for (var j = 0; j < thetaResolution; j++)
			{
				if (i === 0)
				{
					if (j < thetaResolution-1 || angle < 360.0)
					{
						indices.push(0);
						indices.push(j + 2);
						indices.push(j + 1);
					}
					else
					{
						indices.push(0);
						indices.push(1);
						indices.push(j+1);
					}
				}
				else
				{
					if (angle < 360.0)
					{
						indices.push((i-1)*thetaResolution+j+i);
						indices.push(i*thetaResolution+j+2+i);
						indices.push(i*thetaResolution+j+1+i);
						indices.push((i-1)*thetaResolution+j+i);
						indices.push((i-1)*thetaResolution+j+1+i);
						indices.push(i*thetaResolution+j+2+i);
					}
					else
					{
						if (j < thetaResolution-1)
						{
							indices.push((i-1)*thetaResolution+j+1);
							indices.push(i*thetaResolution+j+2);
							indices.push(i*thetaResolution+j+1);
							indices.push((i-1)*thetaResolution+j+1);
							indices.push((i-1)*thetaResolution+j+2);
							indices.push(i*thetaResolution+j+2);
						}
						else
						{
							indices.push((i-1)*thetaResolution+j+1);
							indices.push(i*thetaResolution+1);
							indices.push(i*thetaResolution+j+1);
							indices.push((i-1)*thetaResolution+j+1);
							indices.push((i-1)*thetaResolution+1);
							indices.push(i*thetaResolution+1);
						}
					}
				}
			}
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createCylinderData: function($radius1, $radius2, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill)
	{
		var radius1 = $radius1;
		var radius2 = $radius2;
		var height = $height;
		var angle = $angle;
		var deltaX = $deltaX;
		var deltaY = $deltaY;
		var thetaResolution = $thetaResolution;
		var heightResolution = $heightResolution;
		var fill = $fill;

		if (radius1 < 0.0)
			radius1 = 0.0;
		
		if (radius2 < 0.0)
			radius2 = 0.0;
		
		if (height < 0.0)
			height = 0.0;

		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
		
		if (thetaResolution < 3)
			thetaResolution = 3;
		
		if (heightResolution < 1)
			heightResolution = 1;

		var deltaRadius = radius2-radius1;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var radAngle = angle/180.0*Math.PI;
		var stepAngle = radAngle/thetaResolution;
		var stepHeight = height/heightResolution;
		var stepDeltaX = deltaX/heightResolution;
		var stepDeltaY = deltaY/heightResolution;
		var stepRadius = deltaRadius/heightResolution;

		var nbThetaStep = thetaResolution;

		if (angle < 360.0)
			nbThetaStep = thetaResolution+1;

		for (var i = 0; i < heightResolution+1; i++)
		{
			var z = -height/2.0 + i*stepHeight;
			var tmpRadius = radius1 + i*stepRadius;
			var tmpDeltaX = -deltaX/2.0 + i*stepDeltaX;
			var tmpDeltaY = -deltaY/2.0 + i*stepDeltaY;

			var zBis = -height/2.0 + (i+1)*stepHeight;
			var radiusBis = radius1 + (i+1)*stepRadius;
			var tmpDeltaXBis = -deltaX/2.0 + (i+1)*stepDeltaX;
			var tmpDeltaYBis = -deltaY/2.0 + (i+1)*stepDeltaY;

			for (var j = 0; j < nbThetaStep; j++)
			{
				var x = tmpRadius*Math.cos(j*stepAngle) + tmpDeltaX;
				var y = tmpRadius*Math.sin(j*stepAngle) + tmpDeltaY;

				var xBis = radiusBis*Math.cos(j*stepAngle) + tmpDeltaXBis;
				var yBis = radiusBis*Math.sin(j*stepAngle) + tmpDeltaYBis;

				vertices.push(x);
				vertices.push(y);
				vertices.push(z);

				var tangentX = new Vector([-Math.sin(j*stepAngle), Math.cos(j*stepAngle), 0.0]);
				var tangentY = (new Vector([xBis - x, yBis - y, zBis - z])).normalize();
				var normal = Vectors.crossProduct(tangentX, tangentY).normalize();

				var textureX = j/thetaResolution;
				
				if (j == 0)
					textureX = 0.0;
				else if (j == thetaResolution)
					textureX = 1.0;
				
				var textureY = i/heightResolution;

				if (i == 0)
					textureY = 0.0;
				else if (i == heightResolution)
					textureY = 1.0;
				
				normals.push(normal.x);
				normals.push(normal.y);
				normals.push(normal.z);
				
				tangentsX.push(tangentX.x);
				tangentsX.push(tangentX.y);
				tangentsX.push(tangentX.z);
				
				tangentsY.push(tangentY.x);
				tangentsY.push(tangentY.y);
				tangentsY.push(tangentY.z);

				texture.push(textureX);
				texture.push(textureY);
			}
		}

		for (var i = 0; i < heightResolution; i++)
		{
			for (var j = 0; j < thetaResolution; j++)
			{
				if (angle < 360.0)
				{
					indices.push(i*thetaResolution + j+i);
					indices.push((i+1)*thetaResolution + j+1+i);
					indices.push(i*thetaResolution + j+1+i);
					indices.push(i*thetaResolution + j+i+1);
					indices.push((i+1)*thetaResolution + j+i+1);
					indices.push((i+1)*thetaResolution + j+2+i);
				}
				else
				{
					if (j < thetaResolution-1)
					{
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j+1);
						indices.push(i*thetaResolution + j+1);
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j+1);
					}
					else
					{
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution);
						indices.push(i*thetaResolution);
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j);
						indices.push((i+1)*thetaResolution);
					}
				}
			}
		}

		var nbVertices = vertices.length/3;

		if (angle < 360.0 && fill === true)
		{
			vertices.push(-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius1-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius2+deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);
			vertices.push(deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);

			vertices.push(-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius1*Math.cos(radAngle)-deltaX/2.0);
			vertices.push(radius1*Math.sin(radAngle)-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius2*Math.cos(radAngle)+deltaX/2.0);
			vertices.push(radius2*Math.sin(radAngle)+deltaY/2.0);
			vertices.push(height/2.0);
			vertices.push(deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);

			for (var i = 0; i < 4; i++)
			{
				normals.push(0.0);
				normals.push(-1.0);
				normals.push(0.0);
				
				tangentsX.push(1.0);
				tangentsX.push(0.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
			}

			for (var i = 0; i < 4; i++)
			{
				normals.push(-Math.sin(radAngle));
				normals.push(Math.cos(radAngle));
				normals.push(0.0);
				
				tangentsX.push(-Math.cos(radAngle));
				tangentsX.push(-Math.sin(radAngle));
				tangentsX.push(0.0);

				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
			}

			texture.push(0.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(1.0);
			texture.push(0.0);
			texture.push(1.0);

			texture.push(1.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(1.0);
			texture.push(1.0);

			indices.push(nbVertices);
			indices.push(nbVertices+2);
			indices.push(nbVertices+1);
			indices.push(nbVertices);
			indices.push(nbVertices+3);
			indices.push(nbVertices+2);

			indices.push(nbVertices+4);
			indices.push(nbVertices+5);
			indices.push(nbVertices+6);
			indices.push(nbVertices+4);
			indices.push(nbVertices+6);
			indices.push(nbVertices+7);
		}

		nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createPrismData: function($radius1, $radius2, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $fill)
	{
		var radius1 = $radius1;
		var radius2 = $radius2;
		var height = $height;
		var angle = $angle;
		var deltaX = $deltaX;
		var deltaY = $deltaY;
		var thetaResolution = $thetaResolution;
		var heightResolution = $heightResolution;
		var fill = $fill;

		if (radius1 < 0.0)
			radius1 = 0.0;
		
		if (radius2 < 0.0)
			radius2 = 0.0;
		
		if (height < 0.0)
			height = 0.0;

		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
		
		if (thetaResolution < 3)
			thetaResolution = 3;
		
		if (heightResolution < 1)
			heightResolution = 1;

		var deltaRadius = radius2-radius1;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var radAngle = angle/180.0*Math.PI;
		var stepAngle = radAngle/thetaResolution;
		var stepHeight = height/heightResolution;
		var stepDeltaX = deltaX/heightResolution;
		var stepDeltaY = deltaY/heightResolution;
		var stepRadius = deltaRadius/heightResolution;

		var nbThetaStep = thetaResolution;

		if (angle < 360.0)
			nbThetaStep = thetaResolution;

		for (var i = 0; i < heightResolution+1; i++)
		{
			var z = -height/2.0 + i*stepHeight;
			var tmpRadius = radius1 + i*stepRadius;
			var tmpDeltaX = -deltaX/2.0 + i*stepDeltaX;
			var tmpDeltaY = -deltaY/2.0 + i*stepDeltaY;

			var zBis = -height/2.0 + (i+1)*stepHeight;
			var radiusBis = radius1 + (i+1)*stepRadius;
			var tmpDeltaXBis = -deltaX/2.0 + (i+1)*stepDeltaX;
			var tmpDeltaYBis = -deltaY/2.0 + (i+1)*stepDeltaY;

			for (var j = 0; j < nbThetaStep; j++)
			{
				var x1 = tmpRadius*Math.cos(j*stepAngle) + tmpDeltaX;
				var y1 = tmpRadius*Math.sin(j*stepAngle) + tmpDeltaY;
				var x2 = tmpRadius*Math.cos((j+1)*stepAngle) + tmpDeltaX;
				var y2 = tmpRadius*Math.sin((j+1)*stepAngle) + tmpDeltaY;

				var x1Bis = radiusBis*Math.cos(j*stepAngle) + tmpDeltaXBis;
				var y1Bis = radiusBis*Math.sin(j*stepAngle) + tmpDeltaYBis;
				var x2Bis = radiusBis*Math.cos((j+1)*stepAngle) + tmpDeltaXBis;
				var y2Bis = radiusBis*Math.sin((j+1)*stepAngle) + tmpDeltaYBis;

				vertices.push(x1);
				vertices.push(y1);
				vertices.push(z);
				vertices.push(x2);
				vertices.push(y2);
				vertices.push(z);

				var tangentX = (new Vector([x2 - x1, y2 - y1, 0.0])).normalize();
				var tangentY = (new Vector([(x1Bis + x2Bis - x1 - x2)/2.0, (y1Bis + y2Bis - y1 - y2)/2.0, zBis - z])).normalize();
				var normal = Vectors.crossProduct(tangentX, tangentY).normalize();

				var textureX1 = j/thetaResolution;
				var textureX2 = (j+1)/thetaResolution;
				
				if (j == 0)
					textureX1 = 0.0;
				else if (j == thetaResolution-1)
					textureX2 = 1.0;
				
				var textureY = i/heightResolution;

				if (i == 0)
					textureY = 0.0;
				else if (i == heightResolution)
					textureY = 1.0;
				
				normals.push(normal.x);
				normals.push(normal.y);
				normals.push(normal.z);
				normals.push(normal.x);
				normals.push(normal.y);
				normals.push(normal.z);
				
				tangentsX.push(tangentX.x);
				tangentsX.push(tangentX.y);
				tangentsX.push(tangentX.z);
				tangentsX.push(tangentX.x);
				tangentsX.push(tangentX.y);
				tangentsX.push(tangentX.z);
				
				tangentsY.push(tangentY.x);
				tangentsY.push(tangentY.y);
				tangentsY.push(tangentY.z);
				tangentsY.push(tangentY.x);
				tangentsY.push(tangentY.y);
				tangentsY.push(tangentY.z);

				texture.push(textureX1);
				texture.push(textureY);
				texture.push(textureX2);
				texture.push(textureY);
			}
		}

		for (var i = 0; i < heightResolution; i++)
		{
			for (var j = 0; j < thetaResolution; j++)
			{
				indices.push(2*i*thetaResolution + 2*j);
				indices.push(2*(i+1)*thetaResolution + 2*j+1);
				indices.push(2*i*thetaResolution + 2*j+1);
				indices.push(2*i*thetaResolution + 2*j);
				indices.push(2*(i+1)*thetaResolution + 2*j);
				indices.push(2*(i+1)*thetaResolution + 2*j+1);
			}
		}

		var nbVertices = vertices.length/3;

		if (angle < 360.0 && fill === true)
		{
			vertices.push(-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius1-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius2+deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);
			vertices.push(deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);

			vertices.push(-deltaX/2.0);
			vertices.push(-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius1*Math.cos(radAngle)-deltaX/2.0);
			vertices.push(radius1*Math.sin(radAngle)-deltaY/2.0);
			vertices.push(-height/2.0);
			vertices.push(radius2*Math.cos(radAngle)+deltaX/2.0);
			vertices.push(radius2*Math.sin(radAngle)+deltaY/2.0);
			vertices.push(height/2.0);
			vertices.push(deltaX/2.0);
			vertices.push(deltaY/2.0);
			vertices.push(height/2.0);

			for (var i = 0; i < 4; i++)
			{
				normals.push(0.0);
				normals.push(-1.0);
				normals.push(0.0);
				
				tangentsX.push(1.0);
				tangentsX.push(0.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
			}

			for (var i = 0; i < 4; i++)
			{
				normals.push(-Math.sin(radAngle));
				normals.push(Math.cos(radAngle));
				normals.push(0.0);
				
				tangentsX.push(-Math.cos(radAngle));
				tangentsX.push(-Math.sin(radAngle));
				tangentsX.push(0.0);

				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
			}

			texture.push(0.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(1.0);
			texture.push(0.0);
			texture.push(1.0);

			texture.push(1.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(0.0);
			texture.push(1.0);
			texture.push(1.0);
			texture.push(1.0);

			indices.push(nbVertices);
			indices.push(nbVertices+2);
			indices.push(nbVertices+1);
			indices.push(nbVertices);
			indices.push(nbVertices+3);
			indices.push(nbVertices+2);

			indices.push(nbVertices+4);
			indices.push(nbVertices+5);
			indices.push(nbVertices+6);
			indices.push(nbVertices+4);
			indices.push(nbVertices+6);
			indices.push(nbVertices+7);
		}

		nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createPrismFromPolygonData: function($radius1, $radius2, $height, $deltaX, $deltaY, $verticesList, $heightResolution, $axis)
	{
		var axis = $axis;

		if (axis !== 'x' && axis !== 'y' && axis !== 'z')
			axis = 'z';

		var radius1 = $radius1;
		var radius2 = $radius2;
		var height = $height;
		var deltaX = $deltaX;
		var deltaY = $deltaY;
		var verticesList = $verticesList;
		var heightResolution = $heightResolution;

		if (radius1 < 0.0)
			radius1 = 0.0;
		
		if (radius2 < 0.0)
			radius2 = 0.0;
		
		if (height < 0.0)
			height = 0.0;
		
		if (heightResolution < 1)
			heightResolution = 1;

		var deltaRadius = radius2-radius1;

		var polygon = new MathPolygon($verticesList);
		var centroid = polygon.getCentroid();
		centroid.setX(0.0);
		centroid.setY(0.0);
		var maxRadius = polygon.getMaxRadius();
		
		var scale1 = 1.0;
		var scale2 = 1.0;

		if (utils.isset(radius1))
			scale1 = radius1/maxRadius;

		if (utils.isset(radius2))
			scale2 = radius2/maxRadius;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var stepHeight = height/heightResolution;
		var stepDeltaX = deltaX/heightResolution;
		var stepDeltaY = deltaY/heightResolution;
		var stepRadius = deltaRadius/heightResolution;
		var stepScale = (scale2-scale1)/heightResolution;

		var displayedVertices = 0;

		for (var i = 0; i < heightResolution+1; i++)
		{
			var z = -height/2.0 + i*stepHeight;
			var tmpScale = scale1 + i*stepScale;
			var tmpDeltaX = -deltaX/2.0 + i*stepDeltaX;
			var tmpDeltaY = -deltaY/2.0 + i*stepDeltaY;

			var zBis = -height/2.0 + (i+1)*stepHeight;
			var tmpScaleBis = scale2 + (i+1)*stepScale;
			var tmpDeltaXBis = -deltaX/2.0 + (i+1)*stepDeltaX;
			var tmpDeltaYBis = -deltaY/2.0 + (i+1)*stepDeltaY;

			displayedVertices = 0;

			for (var j = 0; j < verticesList.length; j++)
			{
				var nextJ = j+1;

				if (nextJ >= verticesList.length)
					nextJ = 0;

				var x1 = (verticesList[j].x-centroid.x)*tmpScale + tmpDeltaX;
				var y1 = (verticesList[j].y-centroid.y)*tmpScale + tmpDeltaY;
				var x2 = (verticesList[nextJ].x-centroid.x)*tmpScale + tmpDeltaX;
				var y2 = (verticesList[nextJ].y-centroid.y)*tmpScale + tmpDeltaY;

				var x1Bis = (verticesList[j].x-centroid.x)*tmpScaleBis + tmpDeltaXBis;
				var y1Bis = (verticesList[j].y-centroid.y)*tmpScaleBis + tmpDeltaYBis;
				var x2Bis = (verticesList[nextJ].x-centroid.x)*tmpScaleBis + tmpDeltaXBis;
				var y2Bis = (verticesList[nextJ].y-centroid.y)*tmpScaleBis + tmpDeltaYBis;

				if (x1 !== x2 || y1 !== y2)
				{
					displayedVertices++;

					var tangentX = (new Vector([x2 - x1, y2 - y1, 0.0])).normalize();
					var tangentY = (new Vector([(x1Bis + x2Bis - x1 - x2)/2.0, (y1Bis + y2Bis - y1 - y2)/2.0, zBis - z])).normalize();
					var normal = Vectors.crossProduct(tangentX, tangentY).normalize();

					var textureX1 = j/verticesList.length;
					var textureX2 = (nextJ)/verticesList.length;
					
					if (j == 0)
						textureX1 = 0.0;
					else if (j == verticesList.length-1)
						textureX2 = 1.0;
					
					var textureY = i/heightResolution;

					if (i == 0)
						textureY = 0.0;
					else if (i == heightResolution)
						textureY = 1.0;

					if (axis === 'x')
					{
						vertices.push(z);
						vertices.push(x1);
						vertices.push(y1);
						vertices.push(z);
						vertices.push(x2);
						vertices.push(y2);

						normals.push(normal.z);
						normals.push(normal.x);
						normals.push(normal.y);
						normals.push(normal.z);
						normals.push(normal.x);
						normals.push(normal.y);
						
						tangentsX.push(tangentX.z);
						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.y);
						tangentsX.push(tangentX.z);
						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.y);
						
						tangentsY.push(tangentY.z);
						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.y);
						tangentsY.push(tangentY.z);
						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.y);
					}
					else if (axis === 'y')
					{
						vertices.push(x1);
						vertices.push(z);
						vertices.push(y1);
						vertices.push(x2);
						vertices.push(z);
						vertices.push(y2);

						normals.push(-normal.x);
						normals.push(-normal.z);
						normals.push(-normal.y);
						normals.push(-normal.x);
						normals.push(-normal.z);
						normals.push(-normal.y);

						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.z);
						tangentsX.push(tangentX.y);
						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.z);
						tangentsX.push(tangentX.y);

						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.z);
						tangentsY.push(tangentY.y);
						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.z);
						tangentsY.push(tangentY.y);
					}
					else
					{
						vertices.push(x1);
						vertices.push(y1);
						vertices.push(z);
						vertices.push(x2);
						vertices.push(y2);
						vertices.push(z);
			
						normals.push(normal.x);
						normals.push(normal.y);
						normals.push(normal.z);
						normals.push(normal.x);
						normals.push(normal.y);
						normals.push(normal.z);
						
						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.y);
						tangentsX.push(tangentX.z);
						tangentsX.push(tangentX.x);
						tangentsX.push(tangentX.y);
						tangentsX.push(tangentX.z);
						
						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.y);
						tangentsY.push(tangentY.z);
						tangentsY.push(tangentY.x);
						tangentsY.push(tangentY.y);
						tangentsY.push(tangentY.z);
					}

					texture.push(textureX1);
					texture.push(textureY);
					texture.push(textureX2);
					texture.push(textureY);
				}
			}
		}

		for (var i = 0; i < heightResolution; i++)
		{
			for (var j = 0; j < displayedVertices; j++)
			{
				indices.push(2*i*displayedVertices + 2*j);
				indices.push(2*(i+1)*displayedVertices + 2*j+1);
				indices.push(2*i*displayedVertices + 2*j+1);
				indices.push(2*i*displayedVertices + 2*j);
				indices.push(2*(i+1)*displayedVertices + 2*j);
				indices.push(2*(i+1)*displayedVertices + 2*j+1);
			}
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createRingData: function($radius1, $radius2, $angle, $resolution)
	{
		var radius1 = $radius1;
		var radius2 = $radius2;
		
		var innerRadius = Math.min(radius1, radius2);
		var outerRadius = Math.max(radius1, radius2);
		
		var angle = $angle;
		
		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
		
		var resolution = $resolution;

		var radius1 = $radius1;
		var radius2 = $radius2;
		
		var innerRadius = Math.min(radius1, radius2);
		var outerRadius = Math.max(radius1, radius2);
		
		var angle = $angle;
		
		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
		
		var resolution = $resolution;

		var angleStep = angle/180*Math.PI/resolution;

		var nbVertex = resolution;
			
		if (angle < 360.0)
			nbVertex = resolution + 1;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		for (var i = 0; i < nbVertex; i++)
		{
			var innerX = innerRadius*Math.cos(i*angleStep);
			var innerY = innerRadius*Math.sin(i*angleStep);
			var outerX = outerRadius*Math.cos(i*angleStep);
			var outerY = outerRadius*Math.sin(i*angleStep);
			
			for (var j = 0; j < 2; j++)
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
			
			vertices.push(innerX);
			vertices.push(innerY);
			vertices.push(0.0);
			vertices.push(outerX);
			vertices.push(outerY);
			vertices.push(0.0);
			
			texture.push(0.5*innerRadius/outerRadius*Math.cos(i*angleStep)+0.5);
			texture.push(0.5*innerRadius/outerRadius*Math.sin(i*angleStep)+0.5);
			texture.push(0.5*Math.cos(i*angleStep)+0.5);
			texture.push(0.5*Math.sin(i*angleStep)+0.5);
		}

		for (var i = 0; i < resolution; i++)
		{
			if (i < resolution-1 || angle < 360.0)
			{
				indices.push(i*2);
				indices.push(i*2 + 2);
				indices.push(i*2 + 1);
				indices.push(i*2 + 1);
				indices.push(i*2 + 2);
				indices.push(i*2 + 3);
			}
			else
			{
				indices.push(i*2);
				indices.push(0);
				indices.push(i*2 + 1);
				indices.push(i*2 + 1);
				indices.push(0);
				indices.push(1);
			}
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createUVSphereData: function($radius, $angleTheta, $anglePhi, $offsetAnglePhi, $thetaResolution, $phiResolution)
	{
		var radius = $radius;
		var angleTheta = $angleTheta;
		var anglePhi = $anglePhi;
		var offsetAnglePhi = $offsetAnglePhi;
		var thetaResolution = $thetaResolution;
		var phiResolution = $phiResolution;

		if (radius < 0.0)
			radius = 0.0;

		if (angleTheta <= 0.0 || angleTheta > 360.0)
			angleTheta = 360.0;
		
		if (anglePhi <= 0.0 || anglePhi > 180.0)
			anglePhi = 180.0;

		if (offsetAnglePhi <= 0.0 || offsetAnglePhi > 180.0)
			offsetAnglePhi = 0.0;

		if (offsetAnglePhi + anglePhi > 180.0)
			anglePhi = 180.0 - offsetAnglePhi;
		
		if (thetaResolution < 3)
			thetaResolution = 3;
		
		if (phiResolution < 3)
			phiResolution = 3;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var radTheta = angleTheta/180.0*Math.PI;
		var radPhi = anglePhi/180.0*Math.PI;
		var stepTheta = radTheta/thetaResolution;
		var stepPhi = radPhi/phiResolution;
		var offsetAnglePhiRad = offsetAnglePhi/180.0*Math.PI;

		var nbThetaStep = thetaResolution;

		if (angleTheta < 360.0)
			nbThetaStep = thetaResolution+1;
		
		//console.log("offsetAnglePhi : " + offsetAnglePhi);
		//console.log("anglePhi : " + anglePhi);

		for (var i = 0; i < phiResolution+1; i++)
		{
			var phi = offsetAnglePhiRad - Math.PI/2.0 + i*stepPhi;
			
			var normCos = Math.cos(phi);
			var normSin = Math.sin(phi);
			
			var z = normSin*radius;
			
			var textureY = i/phiResolution;
			
			if (i === 0)
				textureY = 0.0;
			else if (i === phiResolution)
				textureY = 1.0;

			for (var j = 0; j < nbThetaStep; j++)
			{
				var theta = j*stepTheta;
				
				var normalX = Math.cos(theta);
				var normalY = Math.sin(theta);
				
				var x = radius*normCos*normalX;
				var y = radius*normCos*normalY;
				
				var textureX = j/thetaResolution;
			
				if (j == 0)
					textureX = 0.0;
				else if (j == thetaResolution)
					textureX = 1.0;

				texture.push(textureX);
				texture.push(textureY);
				
				normals.push(normalX*normCos);
				normals.push(normalY*normCos);
				normals.push(normSin);
				
				tangentsX.push(-normalY);
				tangentsX.push(normalX);
				tangentsX.push(0.0);
				
				tangentsY.push(-normalX*normSin);
				tangentsY.push(-normalY*normSin);
				tangentsY.push(normCos);
				
				vertices.push(x);
				vertices.push(y);
				vertices.push(z);
			}
		}

		for (var i = 0; i < phiResolution; i++)
		{
			for (var j = 0; j < thetaResolution; j++)
			{
				if (angleTheta < 360.0)
				{
					indices.push(i*thetaResolution + j+i);
					indices.push((i+1)*thetaResolution + j+1+i);
					indices.push(i*thetaResolution + j+1+i);
					
					indices.push(i*thetaResolution + j+i+1);
					indices.push((i+1)*thetaResolution + j+i+1);
					indices.push((i+1)*thetaResolution + j+2+i);
					
				}
				else
				{
					if (j < thetaResolution-1)
					{
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j+1);
						indices.push(i*thetaResolution + j+1);
						
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j+1);
						
					}
					else
					{
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution);
						indices.push(i*thetaResolution);
						
						indices.push(i*thetaResolution + j);
						indices.push((i+1)*thetaResolution + j);
						indices.push((i+1)*thetaResolution);
						
						
					}
				}
			}
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createCuboidSphereData: function($radius, $resolution, $textureMode)
	{
		var radius = $radius;
		var resolution = $resolution;

		if (radius < 0.0)
			radius = 0.0;

		if (resolution < 1)
			resolution = 1;
		
		var textureMode = 0;
	
		if (utils.isset($textureMode))
			textureMode = $textureMode;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var squareXStep = 1.0/resolution;
		var squareYStep = 1.0/resolution;
		
		for (var i = 0; i < resolution+1; i++)
		{
			var squareY = -0.5 + i * squareYStep;
			
			for (var j = 0; j < resolution+1; j++)
			{
				var squareX = -0.5 + j * squareXStep;
				
				var cubes = []
				cubes.push({ x: squareX, y: -0.5, z: squareY});
				cubes.push({ x: 0.5, y: squareX, z: squareY});
				cubes.push({ x: -squareX, y: 0.5, z: squareY});
				cubes.push({ x: -0.5, y: -squareX, z: squareY});
				cubes.push({ x: squareX, y: squareY, z: 0.5});
				cubes.push({ x: squareX, y: -squareY, z: -0.5});
				
				//console.log("Square : " + squareX + ", " + squareY);
				
				for (var k = 0; k < cubes.length; k++)
				{
					var cube = cubes[k];
					var r = Math.sqrt(cube.x*cube.x + cube.y*cube.y);
					
					var theta = Math.PI/2.0;
					
					if (cube.x !== 0.0)
						theta = Trigo.atan(cube.y, cube.x);
					else if (k === 0)
						theta = -Math.PI/2.0;
					else if ((k === 4 || k === 5) && cube.y < 0)
						theta = -Math.PI/2.0;
					
					var phi = Math.PI/2.0;
					
					if (r !== 0.0)
						phi = Trigo.atan(cube.z, r);
					else if (k === 5)
						phi = -Math.PI/2.0;
					
					var normCos = Math.cos(phi);
					var normSin = Math.sin(phi);
					var normalX = Math.cos(theta);
					var normalY = Math.sin(theta);
					
					var z = normSin*radius;
					var x = radius*normCos*normalX;
					var y = radius*normCos*normalY;
					
					normals.push(normCos*normalX);
					normals.push(normCos*normalY);
					normals.push(normSin);
					
					tangentsX.push(-normalY);
					tangentsX.push(normalX);
					tangentsX.push(0.0);
					
					tangentsY.push(-normalX*normSin);
					tangentsY.push(-normalY*normSin);
					tangentsY.push(normCos);
					
					if (k === 4)
					{
						textureTangentsX.push(1.0);
						textureTangentsX.push(0.0);
						textureTangentsX.push(0.0);
						
						textureTangentsY.push(0.0);
						textureTangentsY.push(-1.0);
						textureTangentsY.push(0.0);
					}
					else
					{
						textureTangentsX.push(1.0);
						textureTangentsX.push(0.0);
						textureTangentsX.push(0.0);
						
						textureTangentsY.push(0.0);
						textureTangentsY.push(1.0);
						textureTangentsY.push(0.0);
					}
					
					vertices.push(x);
					vertices.push(y);
					vertices.push(z);
					
					texture.push(squareX + 0.5);
						
					if (textureMode === 1)
					{
						if (k === 0)
							texture.push((squareY + 0.5)/6.0);
						else if (k === 1)
							texture.push((squareY + 1.5)/6.0);
						else if (k === 2)
							texture.push((squareY + 2.5)/6.0);
						else if (k === 3)
							texture.push((squareY + 3.5)/6.0);
						else if (k === 4)
							texture.push((squareY + 4.5)/6.0);
						else if (k === 5)
							texture.push((squareY + 5.5)/6.0);
					}
					else
						texture.push(squareY + 0.5);
				}
			}
		}

		for (var i = 0; i < resolution; i++)
		{
			for (var j = 0; j < resolution; j++)
			{
				for (var k = 0; k < 6; k++)
				{
					indices.push((i*(resolution+1) + j)*6 + k);
					indices.push(((i+1)*(resolution+1) + j)*6 + k);
					indices.push((i*(resolution+1) + j + 1)*6 + k);
					
					indices.push(((i+1)*(resolution+1) + j)*6 + k);
					indices.push(((i+1)*(resolution+1) + j + 1)*6 + k);
					indices.push((i*(resolution+1) + j + 1)*6 + k);
				}
			}
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createRevolutionData: function($verticesList, $angle, $smoothTheta, $resolution, $closeStart, $closeEnd, $axis)
	{
		var axis = $axis;

		if (axis !== 'x' && axis !== 'y' && axis !== 'z')
			axis = 'z';

		var verticesList = $verticesList;
		var angle = $angle;
	
		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
	
		var smoothTheta = $smoothTheta;
		var resolution = $resolution;
	
		var closeStart = $closeStart;
		var closeEnd = $closeEnd;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var radAngle = angle/180.0*Math.PI;
		var angleStep = radAngle/resolution;

		var nbThetaStep = resolution;

		if (angle < 360.0)
			nbThetaStep = resolution+1;

		var minX = Number.MAX_SAFE_INTEGER;
		var maxX = Number.MIN_SAFE_INTEGER;
		var minZ = Number.MAX_SAFE_INTEGER;
		var maxZ = Number.MIN_SAFE_INTEGER;
			
		for (var i = 0; i < verticesList.length; i++)
		{
			if (Math.abs(verticesList[i].x) < minX)
				minX = verticesList[i].x;
				
			if (Math.abs(verticesList[i].x) > maxX)
				maxX = Math.abs(verticesList[i].x);
			
			if (Math.abs(verticesList[i].z) < minZ)
				minZ = verticesList[i].z;
			
			if (Math.abs(verticesList[i].z) > maxZ)
				maxZ = verticesList[i].z;
		}
		
		var deltaX = maxX - minX;
		var deltaZ = maxZ - minZ;

		for (var i = 0; i < verticesList.length; i++)
		{
			var index0 = i-1;
			var index1 = i;
			var index2 = i+1;
			var index3 = i+2;
			
			if (i === verticesList.length-1)
			{
				index2 = 0;
				index3 = 1;
			}
			else if (i === verticesList.length-2)
				index3 = 0;
			else if (i === 0)
				index0 = verticesList.length-1;

			var vertex0 = verticesList[index0];
			var vertex1 = verticesList[index1];
			var vertex2 = verticesList[index2];
			var vertex3 = verticesList[index3];
		
			var normal0X = vertex1.z - vertex0.z;
			var normal0Z = vertex0.x - vertex1.x;
			var normal1X = vertex2.z - vertex1.z;
			var normal1Z = vertex1.x - vertex2.x;
			var normal2X = normal1X;
			var normal2Z = normal1Z;
			var normal3X = vertex3.z - vertex2.z;
			var normal3Z = vertex2.x - vertex3.x;
			
			var oldNormal1X = normal1X;
			var oldNormal1Z = normal1Z;
			var oldNormal2X = normal2X;
			var oldNormal2Z = normal2Z;

			if (vertex1.smoothZ === true)
			{
				var normalX = (normal0X+normal1X)/2.0;
				var normalZ = (normal0Z+normal1Z)/2.0;
				normal1X = normalX;
				normal1Z = normalZ;
			}

			if (vertex2.smoothZ === true)
			{
				var normalX = (normal2X+normal3X)/2.0;
				var normalZ = (normal2Z+normal3Z)/2.0;
				normal2X = normalX;
				normal2Z = normalZ;
			}

			for (var j = 0; j < resolution+1; j++)
			{
				var normCos = Math.cos(j*angleStep);
				var normSin = Math.sin(j*angleStep);
					
				var texture1X = j/(resolution);
				var texture2X = j/(resolution);

				if (j == 0)
				{
					texture1X = 0.0;
					texture2X = 0.0;
				}
				else if (j == resolution)
				{
					texture1X = 1.0;
					texture2X = 1.0;
				}

				var texture1Y = (vertex1.z-minZ)/deltaZ;
				var texture2Y = (vertex2.z-minZ)/deltaZ;
				
				/*
				if (Math.abs(oldNormal1Z) > Math.abs(oldNormal1X))
				{
					texture1X = vertex1.x*normCos/maxX/2.0 + 0.5;
					texture2X = vertex2.x*normCos/maxX/2.0 + 0.5;
						
					texture1Y = vertex1.x*normSin/maxX/2.0 + 0.5;
					texture2Y = vertex2.x*normSin/maxX/2.0 + 0.5;
				}
				//*/

				if (axis === 'x')
				{
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
				}
				else if (axis === 'y')
				{
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
				}
				else
				{
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
				}				

				if (Math.abs(oldNormal1Z) > Math.abs(oldNormal1X))
				{
					if (oldNormal1Z > 0.0)
					{
						if (axis === 'x')
						{
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
						}
						else if (axis === 'y')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
						}
						else
						{
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
						}
					}
					else
					{
						if (axis === 'x')
						{
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
						}
						else if (axis === 'y')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
						}
						else
						{
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
						}
					}
				}
				else
				{
					if (oldNormal1X < 0.0)
					{
						if (axis === 'x')
						{
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
						}
						else if (axis === 'y')
						{
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
						
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
						}
						else
						{
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
						
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
						}
					}
					else
					{
						if (axis === 'x')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
						}
						else if (axis === 'y')
						{
							
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
						}
						else
						{
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
						}
					}
				}

				if (axis === 'x')
				{
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
				}
				else if (axis === 'y')
				{
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
				}
				else
				{
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
				}

				texture.push(texture1X);
				texture.push(texture1Y);
				texture.push(texture2X);
				texture.push(texture2Y);
			}
		}

		for (var i = 0; i < verticesList.length; i++)
		{
			for (var j = 0; j < resolution; j++)
			{

				indices.push((i*(resolution+1) + j)*2 + 1);
				indices.push((i*(resolution+1) + j)*2);
				indices.push((i*(resolution+1) + j)*2 + 2);
				indices.push((i*(resolution+1) + j)*2 + 3);
				indices.push((i*(resolution+1) + j)*2 + 1);
				indices.push((i*(resolution+1) + j)*2 + 2);
			}
		}

		var indicesOffset = verticesList.length*(resolution+1)*2;

		if (angle < 360.0)
		{
			var angleRad = angle/180*Math.PI;
			var normalX = -Math.sin(angleRad);
			var normalY = Math.cos(angleRad);
			
			for (var i = 0; i < verticesList.length; i++)
				verticesList[i].y = verticesList[i].z;

			var polygon = new MathPolygon(verticesList);
			var polygonTriangles = polygon.getIndices();

			for (var i = 0; i < verticesList.length; i++)
			{
				var textureX = (verticesList[i].x-minX)/deltaX;
				var textureY = (verticesList[i].z-minZ)/deltaZ;

				if (axis === 'x')
				{
					normals.push(0.0);
					normals.push(normalX);
					normals.push(normalY);
					
					tangentsX.push(0.0);
					tangentsX.push(normalY);
					tangentsX.push(-normalX);
					
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x*normalY);
					vertices.push(-verticesList[i].x*normalX);
				}
				else if (axis === 'y')
				{
					normals.push(normalY);
					normals.push(0.0);
					normals.push(normalX);
					
					tangentsX.push(-normalX);
					tangentsX.push(0.0);
					tangentsX.push(normalY);
					
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					
					vertices.push(-verticesList[i].x*normalX);
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x*normalY);
				}
				else
				{
					normals.push(normalX);
					normals.push(normalY);
					normals.push(0.0);
					
					tangentsX.push(normalY);
					tangentsX.push(-normalX);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					
					vertices.push(verticesList[i].x*normalY);
					vertices.push(-verticesList[i].x*normalX);
					vertices.push(verticesList[i].z);
				}

				texture.push(textureX);
				texture.push(textureY);
			}

			for (var i = 0; i < polygonTriangles.length; i++)
				indices.push(indicesOffset + polygonTriangles[i]);
				
			indicesOffset = indicesOffset + verticesList.length;

			for (var i = 0; i < verticesList.length; i++)
			{
				var textureX = (verticesList[i].x-minX)/deltaX;
				var textureY = (verticesList[i].z-minZ)/deltaZ;
				
				if (axis === 'x')
				{
					normals.push(0.0);
					normals.push(0.0);
					normals.push(-1.0);
					
					tangentsX.push(0.0);	
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x);
					vertices.push(0.0);
				}
				else if (axis === 'y')
				{
					normals.push(-1.0);
					normals.push(0.0);
					normals.push(0.0);
						
					tangentsX.push(0.0);
					tangentsX.push(0.0);
					tangentsX.push(1.0);
						
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
						
					vertices.push(0.0);
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x);
				}
				else
				{
					normals.push(0.0);
					normals.push(-1.0);
					normals.push(0.0);
						
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					tangentsX.push(0.0);
						
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
						
					vertices.push(verticesList[i].x);
					vertices.push(0.0);
					vertices.push(verticesList[i].z);
				}
					
				texture.push(textureX);
				texture.push(textureY);
			}

			for (var i = polygonTriangles.length-1; i >= 0; i--)
				indices.push(indicesOffset + polygonTriangles[i]);
				
			indicesOffset = indicesOffset + verticesList.length;
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},

	createPrismRevolutionData: function($verticesList, $angle, $smoothTheta, $resolution, $closeStart, $closeEnd, $axis)
	{
		var axis = $axis;

		if (axis !== 'x' && axis !== 'y' && axis !== 'z')
			axis = 'z';

		var verticesList = $verticesList;
		var angle = $angle;
	
		if (angle <= 0.0 || angle > 360.0)
			angle = 360.0;
	
		var smoothTheta = $smoothTheta;
		var resolution = $resolution;
	
		var closeStart = $closeStart;
		var closeEnd = $closeEnd;

		var vertices = [];
		var normals = [];
		var tangentsX = [];
		var tangentsY = [];
		var textureTangentsX = [];
		var textureTangentsY = [];
		var textureTangentsZ = [];
		var texture = [];
		var colors = [];
		var indices = [];

		var radAngle = angle/180.0*Math.PI;
		var angleStep = radAngle/resolution;

		var nbThetaStep = resolution;

		if (angle < 360.0)
			nbThetaStep = resolution+1;

		var minX = Number.MAX_SAFE_INTEGER;
		var maxX = Number.MIN_SAFE_INTEGER;
		var minZ = Number.MAX_SAFE_INTEGER;
		var maxZ = Number.MIN_SAFE_INTEGER;
			
		for (var i = 0; i < verticesList.length; i++)
		{
			if (Math.abs(verticesList[i].x) < minX)
				minX = verticesList[i].x;
				
			if (Math.abs(verticesList[i].x) > maxX)
				maxX = Math.abs(verticesList[i].x);
			
			if (Math.abs(verticesList[i].z) < minZ)
				minZ = verticesList[i].z;
			
			if (Math.abs(verticesList[i].z) > maxZ)
				maxZ = verticesList[i].z;
		}
		
		var deltaX = maxX - minX;
		var deltaZ = maxZ - minZ;

		for (var i = 0; i < verticesList.length; i++)
		{
			var index0 = i-1;
			var index1 = i;
			var index2 = i+1;
			var index3 = i+2;
			
			if (i === verticesList.length-1)
			{
				index2 = 0;
				index3 = 1;
			}
			else if (i === verticesList.length-2)
				index3 = 0;
			else if (i === 0)
				index0 = verticesList.length-1;

			var vertex0 = verticesList[index0];
			var vertex1 = verticesList[index1];
			var vertex2 = verticesList[index2];
			var vertex3 = verticesList[index3];
		
			var normal0X = vertex1.z - vertex0.z;
			var normal0Z = vertex0.x - vertex1.x;
			var normal1X = vertex2.z - vertex1.z;
			var normal1Z = vertex1.x - vertex2.x;
			var normal2X = normal1X;
			var normal2Z = normal1Z;
			var normal3X = vertex3.z - vertex2.z;
			var normal3Z = vertex2.x - vertex3.x;
			
			var oldNormal1X = normal1X;
			var oldNormal1Z = normal1Z;
			var oldNormal2X = normal2X;
			var oldNormal2Z = normal2Z;

			if (vertex1.smoothZ === true)
			{
				var normalX = (normal0X+normal1X)/2.0;
				var normalZ = (normal0Z+normal1Z)/2.0;
				normal1X = normalX;
				normal1Z = normalZ;
			}

			if (vertex2.smoothZ === true)
			{
				var normalX = (normal2X+normal3X)/2.0;
				var normalZ = (normal2Z+normal3Z)/2.0;
				normal2X = normalX;
				normal2Z = normalZ;
			}

			for (var j = 0; j < resolution+1; j++)
			{
				var normCos = Math.cos(j*angleStep);
				var normSin = Math.sin(j*angleStep);
					
				var texture1X = j/(resolution);
				var texture2X = j/(resolution);
				var texture3X = (j+1)/(resolution);
				var texture4X = (j+1)/(resolution);

				if (j == 0)
				{
					texture1X = 0.0;
					texture2X = 0.0;
				}
				else if (j == resolution-1)
				{
					texture3X = 1.0;
					texture4X = 1.0;
				}
				else if (j == resolution)
				{
					texture1X = 1.0;
					texture2X = 1.0;
				}

				var texture1Y = (vertex1.z-minZ)/deltaZ;
				var texture2Y = (vertex2.z-minZ)/deltaZ;
				var texture3Y = (vertex1.z-minZ)/deltaZ;
				var texture4Y = (vertex2.z-minZ)/deltaZ;
				
				/*
				if (Math.abs(oldNormal1Z) > Math.abs(oldNormal1X))
				{
					texture1X = vertex1.x*normCos/maxX/2.0 + 0.5;
					texture2X = vertex2.x*normCos/maxX/2.0 + 0.5;
						
					texture1Y = vertex1.x*normSin/maxX/2.0 + 0.5;
					texture2Y = vertex2.x*normSin/maxX/2.0 + 0.5;
				}
				//*/

				normCos = Math.cos((j+1)*angleStep);
				normSin = Math.sin((j+1)*angleStep);

				/*
				if (Math.abs(oldNormal1Z) > Math.abs(oldNormal1X))
				{
					texture3X = vertex1.x*normCos/maxX/2.0 + 0.5;
					texture4X = vertex2.x*normCos/maxX/2.0 + 0.5;
						
					texture3Y = vertex1.x*normSin/maxX/2.0 + 0.5;
					texture4Y = vertex2.x*normSin/maxX/2.0 + 0.5;
				}
				//*/

				normCos = Math.cos((j+0.5)*angleStep);
				normSin = Math.sin((j+0.5)*angleStep);

				if (axis === 'x')
				{
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
				}
				else if (axis === 'y')
				{
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal2X*normCos);
				}
				else
				{
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
					normals.push(-normal1X*normCos);
					normals.push(-normal1X*normSin);
					normals.push(-normal1Z);
					normals.push(-normal2X*normCos);
					normals.push(-normal2X*normSin);
					normals.push(-normal2Z);
				}				

				if (Math.abs(oldNormal1Z) > Math.abs(oldNormal1X))
				{
					if (oldNormal1Z > 0.0)
					{
						if (axis === 'x')
						{
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
						}
						else if (axis === 'y')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal2Z);
							
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
						}
						else
						{
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(normal2Z);
							tangentsY.push(-normal2X*normSin);
						}
						
					}
					else
					{
						if (axis === 'x')
						{
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
						}
						else if (axis === 'y')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal2Z);
							
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
						}
						else
						{
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(-normal1Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(-normal2Z);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal1Z);
							tangentsY.push(-normal1X*normSin);
							tangentsY.push(0.0);
							tangentsY.push(-normal2Z);
							tangentsY.push(-normal2X*normSin);
						}
					}
				}
				else
				{
					if (oldNormal1X < 0.0)
					{
						if (axis === 'x')
						{
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
						}
						else if (axis === 'y')
						{
							
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
						
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal2Z*normCos);
						}
						else
						{
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal1X*normSin);
							tangentsX.push(-normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(normal2X*normSin);
							tangentsX.push(-normal2X*normCos);
							tangentsX.push(0.0);
						
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(-normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(-normal2X);
						}
					}
					else
					{
						if (axis === 'x')
						{
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
						}
						else if (axis === 'y')
						{
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal2Z*normCos);
						}
						else
						{
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal1X*normSin);
							tangentsX.push(normal1X*normCos);
							tangentsX.push(0.0);
							tangentsX.push(-normal2X*normSin);
							tangentsX.push(normal2X*normCos);
							tangentsX.push(0.0);
							
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
							tangentsY.push(-normal1Z*normCos);
							tangentsY.push(-normal1Z*normSin);
							tangentsY.push(normal1X);
							tangentsY.push(-normal2Z*normCos);
							tangentsY.push(-normal2Z*normSin);
							tangentsY.push(normal2X);
						}
					}
				}

				normCos = Math.cos(j*angleStep);
				normSin = Math.sin(j*angleStep);

				if (axis === 'x')
				{
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
				}
				else if (axis === 'y')
				{
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
				}
				else
				{
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
				}

				

				normCos = Math.cos((j+1)*angleStep);
				normSin = Math.sin((j+1)*angleStep);

				if (axis === 'x')
				{
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
				}
				else if (axis === 'y')
				{
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
					vertices.push(vertex2.x*normCos);
				}
				else
				{
					vertices.push(vertex1.x*normCos);
					vertices.push(vertex1.x*normSin);
					vertices.push(vertex1.z);
					vertices.push(vertex2.x*normCos);
					vertices.push(vertex2.x*normSin);
					vertices.push(vertex2.z);
				}

				texture.push(texture1X);
				texture.push(texture1Y);
				texture.push(texture2X);
				texture.push(texture2Y);
				texture.push(texture3X);
				texture.push(texture3Y);
				texture.push(texture4X);
				texture.push(texture4Y);
			}
		}

		for (var i = 0; i < verticesList.length; i++)
		{
			for (var j = 0; j < 2*resolution; j++)
			{
				indices.push((i*2*(resolution+1) + j)*2 + 1);
				indices.push((i*2*(resolution+1) + j)*2);
				indices.push((i*2*(resolution+1) + j)*2 + 2);
				indices.push((i*2*(resolution+1) + j)*2 + 3);
				indices.push((i*2*(resolution+1) + j)*2 + 1);
				indices.push((i*2*(resolution+1) + j)*2 + 2);
			}
		}

		var indicesOffset = verticesList.length*(resolution+1)*4;

		if (angle < 360.0)
		{
			var angleRad = angle/180*Math.PI;
			var normalX = -Math.sin(angleRad);
			var normalY = Math.cos(angleRad);
			
			for (var i = 0; i < verticesList.length; i++)
				verticesList[i].y = verticesList[i].z;

			var polygon = new MathPolygon(verticesList);
			var polygonTriangles = polygon.getIndices();

			for (var i = 0; i < verticesList.length; i++)
			{
				var textureX = (verticesList[i].x-minX)/deltaX;
				var textureY = (verticesList[i].z-minZ)/deltaZ;
				
				if (axis === 'x')
				{
					normals.push(0.0);
					normals.push(normalX);
					normals.push(normalY);
					
					tangentsX.push(0.0);
					tangentsX.push(normalY);
					tangentsX.push(-normalX);
					
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x*normalY);
					vertices.push(-verticesList[i].x*normalX);
				}
				else if (axis === 'y')
				{
					normals.push(normalY);
					normals.push(0.0);
					normals.push(normalX);
					
					tangentsX.push(-normalX);
					tangentsX.push(0.0);
					tangentsX.push(normalY);
					
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					
					vertices.push(-verticesList[i].x*normalX);
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x*normalY);
				}
				else
				{
					normals.push(normalX);
					normals.push(normalY);
					normals.push(0.0);
					
					tangentsX.push(normalY);
					tangentsX.push(-normalX);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					
					vertices.push(verticesList[i].x*normalY);
					vertices.push(-verticesList[i].x*normalX);
					vertices.push(verticesList[i].z);
				}
				
				texture.push(textureX);
				texture.push(textureY);
			}

			for (var i = 0; i < polygonTriangles.length; i++)
				indices.push(indicesOffset + polygonTriangles[i]);
				
			indicesOffset = indicesOffset + verticesList.length;

			for (var i = 0; i < verticesList.length; i++)
			{
				var textureX = (verticesList[i].x-minX)/deltaX;
				var textureY = (verticesList[i].z-minZ)/deltaZ;
				
				if (axis === 'x')
				{
					normals.push(0.0);
					normals.push(0.0);
					normals.push(-1.0);
					
					tangentsX.push(0.0);
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					
					vertices.push(verticesList[i].z);	
					vertices.push(verticesList[i].x);
					vertices.push(0.0);
				}
				else if (axis === 'y')
				{
					normals.push(-1.0);
					normals.push(0.0);
					normals.push(0.0);
						
					tangentsX.push(0.0);
					tangentsX.push(0.0);
					tangentsX.push(1.0);
						
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
						
					vertices.push(0.0);
					vertices.push(verticesList[i].z);
					vertices.push(verticesList[i].x);
				}
				else
				{
					normals.push(0.0);
					normals.push(-1.0);
					normals.push(0.0);
						
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					tangentsX.push(0.0);
						
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
						
					vertices.push(verticesList[i].x);
					vertices.push(0.0);
					vertices.push(verticesList[i].z);
				}
				
				texture.push(textureX);
				texture.push(textureY);
			}

			for (var i = polygonTriangles.length-1; i >= 0; i--)
				indices.push(indicesOffset + polygonTriangles[i]);
				
			indicesOffset = indicesOffset + verticesList.length;
		}

		var nbVertices = vertices.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
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
			'textureTangentsX': textureTangentsX, 
			'textureTangentsY': textureTangentsY, 
			'textureTangentsZ': textureTangentsZ, 
			'texture': texture, 
			'colors': colors, 
			'indices': indices
		};
		
		return output;
	},
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-data");