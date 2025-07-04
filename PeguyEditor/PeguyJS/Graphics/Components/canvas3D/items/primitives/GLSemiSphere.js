
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////               https://www.suiseipark.com/                  ////
////////////////////////////////////////////////////////////////////

function GLSemiSphere($radius, $height, $angleTheta, $thetaResolution, $phiResolution, $fill, $closeBottom)
{
	///////////////
	// Attributs //
	///////////////
	
	var boundingBox = new GLBoundingBox();
	
	var radius = $radius;
	var height = $height;
	
	var angleTheta = $angleTheta;
	
	if (angleTheta <= 0.0 || angleTheta > 360.0)
		angleTheta = 360.0;
	
	var thetaResolution = $thetaResolution;
	var phiResolution = $phiResolution;
	
	var fill = $fill;
	var closeBottom = $closeBottom;
	
	var phi = 2.0*Trigo.atan(height, radius);
	var R = Math.sqrt(radius*radius + height*height)/2.0/Math.sin(phi/2.0);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (boundingBox.isInit() === false)
		{
			var vertices = [];
			var normals = [];
			var tangentsX = [];
			var tangentsY = [];
			//var textureTangentsX = [];
			//var textureTangentsY = [];
			var texture = [];
			var colors = [];
			var indices = [];
			
			var angleThetaRad = angleTheta/180.0*Math.PI;
			
			var thetaStep = angleThetaRad/thetaResolution;
			var phiStep = phi/phiResolution;
			
			for (var i = 0; i < phiResolution+1; i++)
			{
				var cosPhi = Math.cos(Math.PI/2.0 - phi + phiStep*i);
				var sinPhi = Math.sin(Math.PI/2.0 - phi + phiStep*i);
				
				for (var j = 0; j < thetaResolution+1; j++)
				{
					var cosTheta = Math.cos(thetaStep*j);
					var sinTheta = Math.sin(thetaStep*j);
					
					var normal = new Vector([cosTheta*cosPhi, sinTheta*cosPhi, sinPhi]);
					var tangentX = Vectors.crossProduct(normal, new Vector([0.0, -1.0, 0.0 ])).normalize();
					var tangentY = Vectors.crossProduct(normal, tangentX).normalize();
					
					normals.push(normal.x);
					normals.push(normal.y);
					normals.push(normal.z);
					
					tangentsX.push(tangentX.x);
					tangentsX.push(tangentX.y);
					tangentsX.push(tangentX.z);
					
					tangentsY.push(tangentY.x);
					tangentsY.push(tangentY.y);
					tangentsY.push(tangentY.z);
					
					vertices.push(R*cosTheta*cosPhi);
					vertices.push(R*sinTheta*cosPhi);
					vertices.push(R*sinPhi - R + height);
					
					texture.push(cosTheta*cosPhi/Math.cos(Math.PI/2.0 - phi)/2.0 + 0.5);
					texture.push(sinTheta*cosPhi/Math.cos(Math.PI/2.0 - phi)/2.0 + 0.5);
				}
			}
			
			for (var i = 0; i < phiResolution; i++)
			{
				for (var j = 0; j < thetaResolution; j++)
				{
					indices.push(i*(thetaResolution+1) + j);
					indices.push((i+1)*(thetaResolution+1) + j);
					indices.push(i*(thetaResolution+1) + j + 1);
					
					indices.push((i+1)*(thetaResolution+1) + j);
					indices.push((i+1)*(thetaResolution+1) + j + 1);
					indices.push(i*(thetaResolution+1) + j + 1);
				}
			}
			
			var indicesOffset = (thetaResolution+1) * (phiResolution+1);
			
			if (closeBottom === true)
			{
				var cosPhi = Math.cos(Math.PI/2.0 - phi);
				var sinPhi = Math.sin(Math.PI/2.0 - phi);
				
				normals.push(0.0);
				normals.push(0.0);
				normals.push(-1.0);
				
				tangentsX.push(1.0);
				tangentsX.push(0.0);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(1.0);
				tangentsY.push(0.0);
				
				vertices.push(0.0);
				vertices.push(0.0);
				vertices.push(0.0);
				
				texture.push(0.5);
				texture.push(0.5);
				
				var nbVertex = thetaResolution;
				
				if (angleTheta < 360.0)
					nbVertex = thetaResolution + 1;
				
				for (var i = 0; i < nbVertex; i++)
				{
					var cosTheta = Math.cos(thetaStep*i);
					var sinTheta = Math.sin(thetaStep*i);
					
					normals.push(0.0);
					normals.push(0.0);
					normals.push(-1.0);
					
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					tangentsY.push(0.0);
					
					vertices.push(R*cosTheta*cosPhi);
					vertices.push(R*sinTheta*cosPhi);
					vertices.push(0.0);
					
					texture.push(cosTheta*cosPhi/Math.cos(Math.PI/2.0 - phi)/2.0 + 0.5);
					texture.push(sinTheta*cosPhi/Math.cos(Math.PI/2.0 - phi)/2.0 + 0.5);
				}
				
				for (var i = 0; i < thetaResolution; i++)
				{
					if (i < thetaResolution-1 || angleTheta < 360.0)
					{
						indices.push(indicesOffset);
						indices.push(indicesOffset + i + 1);
						indices.push(indicesOffset + i + 2);
					}
					else
					{
						indices.push(indicesOffset);
						indices.push(indicesOffset + i + 1);
						indices.push(indicesOffset + 1);
					}
				}
				
				if (angleTheta === 360.0)
					indicesOffset = indicesOffset + thetaResolution + 1;
				else
					indicesOffset = indicesOffset + thetaResolution + 2;
			}
			
			if (fill === true && angleTheta < 360.0)
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
				
				vertices.push(0.0);
				vertices.push(0.0);
				vertices.push(0.0);
				
				texture.push(0.5);
				texture.push((R-height)/R);
				
				for (var i = 0; i < phiResolution+1; i++)
				{
					var textureX = Math.cos(Math.PI/2.0 - phi + phiStep*i);
					var textureY = Math.sin(Math.PI/2.0 - phi + phiStep*i);
					
					normals.push(0.0);
					normals.push(-1.0);
					normals.push(0.0);
					
					tangentsX.push(1.0);
					tangentsX.push(0.0);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					
					vertices.push(R*textureX);
					vertices.push(0.0);
					vertices.push(R*textureY - R + height);
					
					texture.push(0.5*textureX+0.5);
					texture.push(0.5*textureY+0.5);
				}
				
				for (var i = 0; i < phiResolution; i++)
				{
					indices.push(indicesOffset);
					indices.push(indicesOffset + i + 2);
					indices.push(indicesOffset + i + 1);
				}
				
				indicesOffset = indicesOffset + phiResolution + 2;
				//*/
				
				//*
				var normalX = -Math.sin(angleThetaRad);
				var normalY = Math.cos(angleThetaRad);
				
				normals.push(normalX);
				normals.push(normalY);
				normals.push(0.0);
				
				tangentsX.push(-normalY);
				tangentsX.push(normalX);
				tangentsX.push(0.0);
				
				tangentsY.push(0.0);
				tangentsY.push(0.0);
				tangentsY.push(1.0);
				
				vertices.push(0.0);
				vertices.push(0.0);
				vertices.push(0.0);
				
				texture.push(0.5);
				texture.push((R-height)/R);
				
				for (var i = 0; i < phiResolution+1; i++)
				{
					var textureX = Math.cos(Math.PI/2.0 - phi + phiStep*i);
					var textureY = Math.sin(Math.PI/2.0 - phi + phiStep*i);
					
					normals.push(normalX);
					normals.push(normalY);
					normals.push(0.0);
					
					tangentsX.push(-normalY);
					tangentsX.push(normalX);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					
					vertices.push(R*textureX*normalY);
					vertices.push(-R*textureX*normalX);
					vertices.push(R*textureY - R + height);
					
					texture.push(0.5*textureX+0.5);
					texture.push(0.5*textureY+0.5);
				}
				
				for (var i = 0; i < phiResolution; i++)
				{
					indices.push(indicesOffset);
					indices.push(indicesOffset + i + 1);
					indices.push(indicesOffset + i + 2);
				}
				
				indicesOffset = indicesOffset + phiResolution + 2;
				//*/
			}
			
			boundingBox.setVertices(vertices);
			
			for (var i = 0; i < vertices.length/3; i++)
			{
				colors.push(1.0);
				colors.push(1.0);
				colors.push(1.0);
				colors.push(1.0);
			}
			
			boundingBox.setNormals(normals);
			boundingBox.setTangentsX(tangentsX);
			boundingBox.setTangentsY(tangentsY);
			boundingBox.setTexture(texture);
			boundingBox.setIndices(indices);
			
			this.execSuper('init', [$context], initialisation);
		}
	};
	
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display sphere ! ");
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(boundingBox, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-semi-sphere");