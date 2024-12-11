
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

SPHERE_MAPPING = 
{
	SYMMETRICAL_PLAN: 0,
	PLANAR: 1,
	CYLINDRICAL: 2,
	CUBE: 3,
	OCTAHEDRON: 4,
	CYLINDRICAL_AND_PLANAR: 5
};

function GLSphere($radius, $resolution)
{
	///////////////
	// Attributs //
	///////////////
	
	var boundingBox = new GLBoundingBox();
	
	var radius = $radius;
	var resolution = $resolution;
	var mapping = SPHERE_MAPPING.SYMMETRICAL_PLAN;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (boundingBox.isInit() === false)
		{
			var thetaResolution = resolution;
			var phiResolution = resolution;
			
			if (mapping === SPHERE_MAPPING.OCTAHEDRON)
				thetaResolution = 4*resolution;
			
			var thetaStep = 2.0*Math.PI/thetaResolution;
			var phiStep = Math.PI/2.0/phiResolution;
			
			var vertices1 = [];
			var normals1 = [];
			var tangentsX1 = [];
			var tangentsY1 = [];
			var textureTangentsX1 = [];
			var textureTangentsY1 = [];
			var textureTangentsZ1 = [];
			var texture1 = [];
			
			var vertices2 = [];
			var normals2 = [];
			var tangentsX2 = [];
			var tangentsY2 = [];
			var textureTangentsX2 = [];
			var textureTangentsY2 = [];
			var textureTangentsZ2 = [];
			var texture2 = [];
			
			for (var i = 0; i < phiResolution+1; i++)
			{
				var phi = -Math.PI/2.0 + i*phiStep;
				
				var normCos = Math.cos(phi);
				var normSin = Math.sin(phi);
				
				var zRadius = normCos*radius;
				
				var z = normSin*radius;
				
				var textureY = i/(phiResolution)/2.0;
				//textureY = (z+radius)/(2.0*radius);
				
				for (var j = 0; j < thetaResolution+1; j++)
				{
					var theta = j*thetaStep;
					
					var normalX = Math.cos(theta);
					var normalY = Math.sin(theta);
					
					var x = radius*normCos*normalX;
					var y = radius*normCos*normalY;
					
					var textureX = j/(thetaResolution);
				
					if (j == 0)
						textureX = 0.0;
					else if (j == thetaResolution)
						textureX = 1.0;
					
					//mapping = SPHERE_MAPPING.CYLINDRICAL;
					//mapping = SPHERE_MAPPING.SYMMETRICAL_PLAN;
					
					if (mapping == SPHERE_MAPPING.SYMMETRICAL_PLAN)
					{
						textureX = x/radius/2.0 + 0.5;
						textureY = y/radius/2.0 + 0.5;
						
						texture1.push(textureX);
						texture1.push(textureY);
						
						texture2.push(textureX);
						texture2.push(textureY);
						
						textureTangentsX1.push(normalX);
						textureTangentsX1.push(normalY);
						textureTangentsX1.push(0.0);
						
						textureTangentsX2.push(normalX);
						textureTangentsX2.push(normalY);
						textureTangentsX2.push(0.0);
						
						textureTangentsY1.push(-normalY);
						textureTangentsY1.push(normalX);
						textureTangentsY1.push(0.0);
						
						textureTangentsY2.push(normalY);
						textureTangentsY2.push(normalX);
						textureTangentsY2.push(0.0);
					}
					else if (mapping == SPHERE_MAPPING.PLANAR)
					{
						if (i === 0)
						{
							textureX = 0.25;
							textureY = 0.5;
						}
						else if (i === phiResolution)
						{
							if (j === 0 || j === thetaResolution)
							{
								textureX = 0.5;
								textureY = 0.5;
							}
							else
							{
								textureX = normalX/4.0 + 0.25;
								textureY = normalY/2.0 + 0.5;
							}
						}
						else
						{
							textureX = x/radius/4.0 + 0.25;
							textureY = y/radius/2.0 + 0.5;
						}
						
						texture1.push(textureX);
						texture1.push(textureY);
						
						texture2.push(textureX + 0.5);
						texture2.push(textureY);
						
						textureTangentsX1.push(normalX);
						textureTangentsX1.push(normalY);
						textureTangentsX1.push(0.0);
						
						textureTangentsX2.push(normalX);
						textureTangentsX2.push(normalY);
						textureTangentsX2.push(0.0);
						
						textureTangentsY1.push(-normalY);
						textureTangentsY1.push(normalX);
						textureTangentsY1.push(0.0);
						
						textureTangentsY2.push(normalY);
						textureTangentsY2.push(normalX);
						textureTangentsY2.push(0.0);
					}
					else if (mapping == SPHERE_MAPPING.CYLINDRICAL)
					{
						texture1.push(textureX);
						texture2.push(textureX);
						
						if (i === phiResolution)
						{
							texture1.push(0.5);
							texture2.push(0.5);
						}
						else if (i === 0)
						{
							texture1.push(0.0);
							texture2.push(1.0);
						}
						else
						{
							texture1.push(textureY);
							texture2.push(1.0 - textureY);
						}
						
						textureTangentsX1.push(1.0);
						textureTangentsX1.push(0.0);
						textureTangentsX1.push(0.0);
						
						textureTangentsX2.push(1.0);
						textureTangentsX2.push(0.0);
						textureTangentsX2.push(0.0);
						
						textureTangentsY1.push(0.0);
						textureTangentsY1.push(1.0);
						textureTangentsY1.push(0.0);
						
						textureTangentsY2.push(0.0);
						textureTangentsY2.push(1.0);
						textureTangentsY2.push(0.0);
					}
					else if (mapping === SPHERE_MAPPING.OCTAHEDRON)
					{
						var projX = 0.0;
						var projY = 0.0;
						
						if (i === 0)
						{
							texture1.push(0.25);
							texture1.push(0.5);
							
							texture2.push(0.75);
							texture2.push(0.5);
						}
						else if (i === phiResolution)
						{
							var a = 0.0;
							
							if (x !== 0.0)
								a = y/x;
							
							if (j < resolution)
							{
								projX = x;
								projY = 0.0;
								
								if (a+1.0 !== 0.0)
								{
									projX = 1.0/(a+1.0);
									projY = a/(a+1.0);
								}
							}
							else if (j < 2*resolution)
							{
								projX = 0.0;
								projY = y;
								
								if (a-1.0 !== 0.0)
								{
									projX = 1.0/(a-1.0);
									projY = a/(a-1.0);
								}
							}
							else if (j < 3*resolution)
							{
								projX = x;
								projY = 0.0;
								
								if (a+1.0 !== 0.0)
								{
									projX = -1.0/(a+1.0);
									projY = -a/(a+1.0);
								}
							}
							else
							{
								projX = 0.0;
								projY = y;
								
								if (1.0-a !== 0.0)
								{
									projX = 1.0/(1.0-a);
									projY = a/(1.0-a);
								}
							}
							
							texture1.push(projX/4.0 + 0.25);
							texture1.push(projY/2.0 + 0.5);
							
							texture2.push(projX/4.0 + 0.75);
							texture2.push(projY/2.0 + 0.5);
						}
						else
						{
							var a = x/z;
							var b = y/z;
							
							if (j < resolution)
							{
								projX = 1.0/(a+1.0);
								projY = 0.0;
								
								if (a+b-1.0 !== 0.0)
								{
									projX = a/(a+b-1.0);
									projY = b/(a+b-1.0);
								}
							}
							else if (j < 2*resolution)
							{
								if (b-a-1.0 !== 0.0)
								{
									projX = a/(b-a-1.0);
									projY = b/(b-a-1.0);
								}
							}
							else if (j < 3*resolution)
							{
								projX = -a*z;
								projY = 0.0;
								
								if (a+b+1.0 !== 0.0)
								{
									projX = -a/(a+b+1.0);
									projY = -b/(a+b+1.0);
								}
							}
							else
							{
								projX = 0.0;
								projY = -b*z;
								
								if (a-b-1.0 !== 0.0)
								{
									projX = a/(a-b-1.0);
									projY = b/(a-b-1.0);
								}
							}
							
							texture1.push(projX/4.0 + 0.25);
							texture1.push(projY/2.0 + 0.5);
							
							texture2.push(projX/4.0 + 0.75);
							texture2.push(projY/2.0 + 0.5);
						}
						
						if (j < resolution)
						{
							textureTangentsX1.push(-1.0);
							textureTangentsX1.push(1.0);
							textureTangentsX1.push(0.0);
							
							textureTangentsX2.push(-1.0);
							textureTangentsX2.push(1.0);
							textureTangentsX2.push(0.0);
							
							textureTangentsY1.push(1.0);
							textureTangentsY1.push(1.0);
							textureTangentsY1.push(0.0);
							
							textureTangentsY2.push(-1.0);
							textureTangentsY2.push(-1.0);
							textureTangentsY2.push(0.0);
						}
						else if (j < 2*resolution)
						{
							textureTangentsX1.push(-1.0);
							textureTangentsX1.push(-1.0);
							textureTangentsX1.push(0.0);
							
							textureTangentsX2.push(-1.0);
							textureTangentsX2.push(-1.0);
							textureTangentsX2.push(0.0);
							
							textureTangentsY1.push(-1.0);
							textureTangentsY1.push(1.0);
							textureTangentsY1.push(0.0);
							
							textureTangentsY2.push(1.0);
							textureTangentsY2.push(-1.0);
							textureTangentsY2.push(0.0);
						}
						else if (j < 3*resolution)
						{
							textureTangentsX1.push(1.0);
							textureTangentsX1.push(-1.0);
							textureTangentsX1.push(0.0);
							
							textureTangentsX2.push(1.0);
							textureTangentsX2.push(-1.0);
							textureTangentsX2.push(0.0);
							
							textureTangentsY1.push(-1.0);
							textureTangentsY1.push(-1.0);
							textureTangentsY1.push(0.0);
							
							textureTangentsY2.push(1.0);
							textureTangentsY2.push(1.0);
							textureTangentsY2.push(0.0);
						}
						else
						{
							textureTangentsX1.push(1.0);
							textureTangentsX1.push(1.0);
							textureTangentsX1.push(0.0);
							
							textureTangentsX2.push(1.0);
							textureTangentsX2.push(1.0);
							textureTangentsX2.push(0.0);
							
							textureTangentsY1.push(1.0);
							textureTangentsY1.push(-1.0);
							textureTangentsY1.push(0.0);
							
							textureTangentsY2.push(-1.0);
							textureTangentsY2.push(1.0);
							textureTangentsY2.push(0.0);
						}
					}
					
					normals1.push(normalX*normCos);
					normals1.push(normalY*normCos);
					normals1.push(normSin);
					
					normals2.push(normalX*normCos);
					normals2.push(normalY*normCos);
					normals2.push(-normSin);
					
					tangentsX1.push(-normalY);
					tangentsX1.push(normalX);
					tangentsX1.push(0.0);
					
					tangentsX2.push(-normalY);
					tangentsX2.push(normalX);
					tangentsX2.push(0.0);
					
					tangentsY1.push(-normalX*normSin);
					tangentsY1.push(-normalY*normSin);
					tangentsY1.push(normCos);
					
					tangentsY2.push(normalX*normSin);
					tangentsY2.push(normalY*normSin);
					tangentsY2.push(normCos);
					
					vertices1.push(x);
					vertices1.push(y);
					vertices1.push(z);
					
					vertices2.push(x);
					vertices2.push(y);
					vertices2.push(-z);
				}
			}
			
			var vertices = vertices1.concat(vertices2);
			var normals = normals1.concat(normals2);
			var tangentsX = tangentsX1.concat(tangentsX2);
			var tangentsY = tangentsY1.concat(tangentsY2);
			var textureTangentsX = textureTangentsX1.concat(textureTangentsX2);
			var textureTangentsY = textureTangentsY1.concat(textureTangentsY2);
			var texture = texture1.concat(texture2);
			var colors = [];
			var indices = [];
			
			for (var i = 0; i < vertices.length/3; i++)
			{
				colors.push(1.0);
				colors.push(1.0);
				colors.push(1.0);
				colors.push(1.0);
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
			
			var offsetIndices = vertices1.length/3;
			
			for (var i = 0; i < phiResolution; i++)
			{
				for (var j = 0; j < thetaResolution; j++)
				{
					indices.push(i*(thetaResolution+1) + j + offsetIndices);
					indices.push(i*(thetaResolution+1) + j + 1 + offsetIndices);
					indices.push((i+1)*(thetaResolution+1) + j + offsetIndices);
					
					indices.push((i+1)*(thetaResolution+1) + j + offsetIndices);
					indices.push(i*(thetaResolution+1) + j + 1 + offsetIndices);
					indices.push((i+1)*(thetaResolution+1) + j + 1 + offsetIndices);
				}
			}
			
			boundingBox.setVertices(vertices);
			boundingBox.setNormals(normals);
			boundingBox.setTangentsX(tangentsX);
			boundingBox.setTangentsY(tangentsY);
			boundingBox.setTextureTangentsX(textureTangentsX);
			boundingBox.setTextureTangentsY(textureTangentsY);
			boundingBox.setTexture(texture);
			boundingBox.setIndices(indices);
			
			this.execSuper('init', [$context], initialisation);
		}
	}
	
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
	
	this.setMapping = function($mapping) { mapping = $mapping; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(boundingBox, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-sphere");