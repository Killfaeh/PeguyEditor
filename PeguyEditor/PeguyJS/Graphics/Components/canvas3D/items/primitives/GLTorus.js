
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLTorus($mainRadius, $pipeRadius, $angle1, $angle2, $offsetAngle2, $offsetR, $offsetZ, $resolution1, $resolution2, $closeStart, $closeEnd, $flat, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var boundingBox = new GLBoundingBox();
	
	var mainRadius = $mainRadius;
	var pipeRadius = $pipeRadius;
	var angle1 = $angle1;
	var angle2 = $angle2;
	var offsetAngle2 = $offsetAngle2;
	var offsetR = $offsetR;
	var offsetZ = $offsetZ;
	var flat = $flat;
	
	if (angle1 <= 0.0 || angle1 >= 360.0)
		angle1 = 360.0;
	
	if (angle2 <= 0.0 || angle2 >= 360.0)
	{
		angle2 = 360.0;
		offsetAngle2 = -180.0;
		offsetR = 0.0;
		offsetZ = 0.0;
	}
	
	if (offsetR*offsetR + offsetZ*offsetZ > 1.0)
	{
		var dist = Math.sqrt(offsetR*offsetR + offsetZ*offsetZ);
		offsetR = offsetR/dist;
		offsetZ = offsetZ/dist;
	}
	
	if (flat === true)
	{
		offsetR = (Math.cos(offsetAngle2/180*Math.PI) + Math.cos((offsetAngle2+angle2)/180*Math.PI)) / 2.0;
		offsetZ = (Math.sin(offsetAngle2/180*Math.PI) + Math.sin((offsetAngle2+angle2)/180*Math.PI)) / 2.0;
	}
	
	var resolution1 = $resolution1;
	var resolution2 = $resolution2;
	
	var closeStart = $closeStart;
	var closeEnd = $closeEnd;
	
	var textureMode = 0;
	// 0 : Même texture sur les 3 faces (texture en une partie)
	// 1 : Une texture pour le cylindre une autre pour les couvercle (texture en 2 parties)
	// 2 : Une texture pour le cylindre une par couvercle (texture en 3 parties)
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (boundingBox.isInit() === false)
		{
			var angleStep = angle1/180*Math.PI/resolution1;
			var pipeAngleStep = angle2/180*Math.PI/resolution2;
			
			var vertices = [];
			var normals = [];
			var tangentsX = [];
			var tangentsY = [];
			var texture = [];
			var colors = [];
			var indices = [];
			
			for (var i = 0; i < resolution2+1; i++)
			{
				var normalR = Math.cos(i*pipeAngleStep + offsetAngle2/180*Math.PI);
				var normalZ = Math.sin(i*pipeAngleStep + offsetAngle2/180*Math.PI);
				var textureY = i/resolution2;
				
				if (i === 0)
					textureY = 0.0;
				else if (i === resolution2)
					textureY = 1.0;
				
				if (textureMode === 1)
					textureY = textureY/2.0;
				else if (textureMode === 2)
					textureY = textureY/3.0;
				
				for (var j = 0; j < resolution1+1; j++)
				{
					var normCos = Math.cos(j*angleStep);
					var normSin = Math.sin(j*angleStep);
					
					var textureX = j/resolution1;
					
					if (j === 0.0)
						textureX = 0.0;
					else if (j === resolution1)
						textureX = 1.0;
					
					normals.push(normalR*normCos);
					normals.push(normalR*normSin);
					normals.push(normalZ);
					
					if (normalR >= 0.0)
					{
						tangentsX.push(-normalR*normSin);
						tangentsX.push(normalR*normCos);
					}
					else
					{
						tangentsX.push(normalR*normSin);
						tangentsX.push(-normalR*normCos);
					}
					
					tangentsX.push(0.0);
					
					tangentsY.push(-normalZ*normCos);
					tangentsY.push(-normalZ*normSin);
					tangentsY.push(normalR);
					
					vertices.push((mainRadius + pipeRadius*normalR)*normCos);
					vertices.push((mainRadius + pipeRadius*normalR)*normSin);
					vertices.push(pipeRadius*normalZ);
					
					texture.push(textureX);
					texture.push(textureY);
				}
			}
			
			for (var i = 0; i < resolution2; i++)
			{
				for (var j = 0; j < resolution1; j++)
				{
					indices.push(i*(resolution1+1) + j);
					indices.push((i+1)*(resolution1+1) + j);
					indices.push(i*(resolution1+1) + j + 1);
					
					indices.push((i+1)*(resolution1+1) + j);
					indices.push((i+1)*(resolution1+1) + j + 1);
					indices.push(i*(resolution1+1) + j + 1);
				}
			}
			
			var indicesOffset = (resolution1+1) * (resolution2+1);
			
			if (angle2 < 360.0)
			{
				if (flat === true)
				{
					var deltaR = Math.cos((angle2+offsetAngle2)/180.0*Math.PI) - Math.cos(offsetAngle2/180.0*Math.PI);
					var deltaZ = Math.sin((angle2+offsetAngle2)/180.0*Math.PI) - Math.sin(offsetAngle2/180.0*Math.PI);
					var deltaNorm = Math.sqrt(deltaR*deltaR + deltaZ*deltaZ);
					deltaR = deltaR/deltaNorm;
					deltaZ = deltaZ/deltaNorm;
					
					var normalR = -deltaZ;
					var normalZ = deltaR;
					
					for (var i = 0; i < resolution1+1; i++)
					{
						var normCos = Math.cos(i*angleStep);
						var normSin = Math.sin(i*angleStep);
						var normalX = normCos*normalR;
						var normalY = normSin*normalR;
						
						var textureX = i/resolution1;
						
						if (i === 0.0)
							textureX = 0.0;
						else if (i === resolution1)
							textureX = 1.0;
						
						for (var j = 0; j < 2; j++)
						{
							normals.push(normalX);
							normals.push(normalY);
							normals.push(normalZ);
							
							tangentsX.push(-normSin);
							tangentsX.push(normCos);
							tangentsX.push(0.0);
							
							tangentsY.push(-normalZ*normCos);
							tangentsY.push(-normalZ*normSin);
							tangentsY.push(normalR);
						}
						
						vertices.push((mainRadius + pipeRadius*Math.cos((angle2+offsetAngle2)/180.0*Math.PI))*normCos);
						vertices.push((mainRadius + pipeRadius*Math.cos((angle2+offsetAngle2)/180.0*Math.PI))*normSin);
						vertices.push(pipeRadius*Math.sin((angle2+offsetAngle2)/180.0*Math.PI));
						vertices.push((mainRadius + pipeRadius*Math.cos(offsetAngle2/180.0*Math.PI))*normCos);
						vertices.push((mainRadius + pipeRadius*Math.cos(offsetAngle2/180.0*Math.PI))*normSin);
						vertices.push(pipeRadius*Math.sin(offsetAngle2/180.0*Math.PI));
						
						texture.push(textureX);
						texture.push(0.0);
						texture.push(textureX);
						
						if (textureMode === 1)
							texture.push(0.5);
						else if (textureMode === 2)
							texture.push(1.0/3.0);
						else
							texture.push(1.0);
					}
					
					for (var i = 0; i < resolution1; i++)
					{
						indices.push(indicesOffset + i*2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 3);
						indices.push(indicesOffset + i*2 + 2);
					}
					
					indicesOffset = indicesOffset + (resolution1+1)*2;
				}
				else
				{
					var deltaR = Math.cos((angle2+offsetAngle2)/180.0*Math.PI) - offsetR;
					var deltaZ = Math.sin((angle2+offsetAngle2)/180.0*Math.PI) - offsetZ;
					var deltaNorm = Math.sqrt(deltaR*deltaR + deltaZ*deltaZ);
					deltaR = deltaR/deltaNorm;
					deltaZ = deltaZ/deltaNorm;
					
					var normalR = -deltaZ;
					var normalZ = deltaR;
					
					for (var i = 0; i < resolution1+1; i++)
					{
						var normCos = Math.cos(i*angleStep);
						var normSin = Math.sin(i*angleStep);
						var normalX = normCos*normalR;
						var normalY = normSin*normalR;
						
						var textureX = i/resolution1;
						
						if (i === 0.0)
							textureX = 0.0;
						else if (i === resolution1)
							textureX = 1.0;
						
						for (var j = 0; j < 2; j++)
						{
							normals.push(normalX);
							normals.push(normalY);
							normals.push(normalZ);
							
							tangentsX.push(-normSin);
							tangentsX.push(normCos);
							tangentsX.push(0.0);
							
							tangentsY.push(-normalZ*normCos);
							tangentsY.push(-normalZ*normSin);
							tangentsY.push(normalR);
						}
						
						vertices.push((mainRadius + pipeRadius*Math.cos((angle2+offsetAngle2)/180.0*Math.PI))*normCos);
						vertices.push((mainRadius + pipeRadius*Math.cos((angle2+offsetAngle2)/180.0*Math.PI))*normSin);
						vertices.push(pipeRadius*Math.sin((angle2+offsetAngle2)/180.0*Math.PI));
						vertices.push((mainRadius + offsetR*pipeRadius)*normCos);
						vertices.push((mainRadius + offsetR*pipeRadius)*normSin);
						vertices.push(offsetZ*pipeRadius);
						
						texture.push(textureX);
						texture.push(0.0);
						texture.push(textureX);
						
						if (textureMode === 1)
							texture.push(0.5);
						else if (textureMode === 2)
							texture.push(1.0/3.0);
						else
							texture.push(1.0);
					}
					
					for (var i = 0; i < resolution1; i++)
					{
						indices.push(indicesOffset + i*2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 3);
						indices.push(indicesOffset + i*2 + 2);
					}
					
					indicesOffset = indicesOffset + (resolution1+1)*2;
					
					deltaR = offsetR - Math.cos(offsetAngle2/180.0*Math.PI);
					deltaZ = offsetZ - Math.sin(offsetAngle2/180.0*Math.PI);
					deltaNorm = Math.sqrt(deltaR*deltaR + deltaZ*deltaZ);
					deltaR = deltaR/deltaNorm;
					deltaZ = deltaZ/deltaNorm;
					
					normalR = -deltaZ;
					normalZ = deltaR;
					
					for (var i = 0; i < resolution1+1; i++)
					{
						var normCos = Math.cos(i*angleStep);
						var normSin = Math.sin(i*angleStep);
						var normalX = normCos*normalR;
						var normalY = normSin*normalR;
						
						var textureX = i/resolution1;
						
						if (i === 0.0)
							textureX = 0.0;
						else if (i === resolution1)
							textureX = 1.0;
						
						for (var j = 0; j < 2; j++)
						{
							normals.push(normalX);
							normals.push(normalY);
							normals.push(normalZ);
							
							tangentsX.push(-normSin);
							tangentsX.push(normCos);
							tangentsX.push(0.0);
							
							tangentsY.push(-normalZ*normCos);
							tangentsY.push(-normalZ*normSin);
							tangentsY.push(normalR);
						}
						
						vertices.push((mainRadius + offsetR*pipeRadius)*normCos);
						vertices.push((mainRadius + offsetR*pipeRadius)*normSin);
						vertices.push(offsetZ*pipeRadius);
						vertices.push((mainRadius + pipeRadius*Math.cos(offsetAngle2/180.0*Math.PI))*normCos);
						vertices.push((mainRadius + pipeRadius*Math.cos(offsetAngle2/180.0*Math.PI))*normSin);
						vertices.push(pipeRadius*Math.sin(offsetAngle2/180.0*Math.PI));
						
						texture.push(textureX);
						texture.push(0.0);
						texture.push(textureX);
						
						if (textureMode === 1)
							texture.push(0.5);
						else if (textureMode === 2)
							texture.push(1.0/3.0);
						else
							texture.push(1.0);
					}
					
					for (var i = 0; i < resolution1; i++)
					{
						indices.push(indicesOffset + i*2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 2);
						indices.push(indicesOffset + i*2 + 1);
						indices.push(indicesOffset + i*2 + 3);
						indices.push(indicesOffset + i*2 + 2);
					}
					
					indicesOffset = indicesOffset + (resolution1+1)*2;
				}
			}
			
			if (angle1 < 360.0)
			{
				if (closeStart)
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
					
					vertices.push(mainRadius + pipeRadius*offsetR);
					vertices.push(0.0);
					vertices.push(offsetZ*pipeRadius);
					
					texture.push(0.5 + 0.5*offsetR);
					
					if (textureMode === 1)
						texture.push(0.25*offsetZ+0.75);
					else if (textureMode === 2)
						texture.push(1.0/6.0*offsetZ+0.5);
					else
						texture.push(0.5*offsetZ+0.5);
					
					for (var i = 0; i < resolution2+1; i++)
					{
						var textureX = Math.cos(i*pipeAngleStep + offsetAngle2/180*Math.PI);
						var textureY = Math.sin(i*pipeAngleStep + offsetAngle2/180*Math.PI);
						
						normals.push(0.0);
						normals.push(-1.0);
						normals.push(0.0);
						
						tangentsX.push(1.0);
						tangentsX.push(0.0);
						tangentsX.push(0.0);
						
						tangentsY.push(0.0);
						tangentsY.push(0.0);
						tangentsY.push(1.0);
						
						vertices.push(mainRadius + pipeRadius*textureX);
						vertices.push(0.0);
						vertices.push(pipeRadius*textureY);
						
						texture.push(0.5*textureX+0.5);
					
						if (textureMode === 1)
							texture.push(0.25*textureY+0.75);
						else if (textureMode === 2)
							texture.push(1.0/6.0*textureY+0.5);
						else
							texture.push(0.5*textureY+0.5);
					}
					
					for (var i = 0; i < resolution2; i++)
					{
						indices.push(indicesOffset);
						indices.push(indicesOffset + i + 2);
						indices.push(indicesOffset + i + 1);
					}
					
					indicesOffset = indicesOffset + resolution2 + 2;
				}
				
				if (closeEnd)
				{
					var normalX = -Math.sin(angle1/180*Math.PI);
					var normalY = Math.cos(angle1/180*Math.PI);
					
					normals.push(normalX);
					normals.push(normalY);
					normals.push(0.0);
					
					tangentsX.push(-normalY);
					tangentsX.push(normalX);
					tangentsX.push(0.0);
					
					tangentsY.push(0.0);
					tangentsY.push(0.0);
					tangentsY.push(1.0);
					
					vertices.push((mainRadius + pipeRadius*offsetR)*normalY);
					vertices.push(-(mainRadius + pipeRadius*offsetR)*normalX);
					vertices.push(offsetZ*pipeRadius);
					
					texture.push(0.5 + 0.5*offsetR);
				
					if (textureMode === 1)
						texture.push(0.25*offsetZ+0.75);
					else if (textureMode === 2)
						texture.push(1.0/6.0*offsetZ+0.5);
					else
						texture.push(0.5*offsetZ+0.5);
					
					for (var i = 0; i < resolution2+1; i++)
					{
						var textureX = Math.cos(i*pipeAngleStep + offsetAngle2/180*Math.PI);
						var textureY = Math.sin(i*pipeAngleStep + offsetAngle2/180*Math.PI);
						
						normals.push(0.0);
						normals.push(-1.0);
						normals.push(0.0);
						
						tangentsX.push(1.0);
						tangentsX.push(0.0);
						tangentsX.push(0.0);
						
						tangentsY.push(0.0);
						tangentsY.push(0.0);
						tangentsY.push(1.0);
						
						vertices.push((mainRadius + pipeRadius*textureX)*normalY);
						vertices.push(-(mainRadius + pipeRadius*textureX)*normalX);
						vertices.push(pipeRadius*textureY);
						
						texture.push(0.5*textureX+0.5);
					
						if (textureMode === 1)
							texture.push(0.25*textureY+0.75);
						else if (textureMode === 2)
							texture.push(1.0/6.0*textureY+0.5);
						else
							texture.push(0.5*textureY+0.5);
					}
					
					for (var i = 0; i < resolution2; i++)
					{
						indices.push(indicesOffset);
						indices.push(indicesOffset + i + 1);
						indices.push(indicesOffset + i + 2);
					}
					
					indicesOffset = indicesOffset + resolution2 + 2;
				}
			}

			boundingBox.setVertices(vertices);
			
			for (var i = 0; i < boundingBox.getNbVertices(); i++)
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
			boundingBox.setColors(colors);
			boundingBox.setIndices(indices);
			
			this.execSuper('init', [$context], initialisation);
		}
	};
	
	this.display = function display($context)
	{
		this.execSuper('display', [$context], display);
		//console.log("Display revolution ! ");
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
	Loader.hasLoaded("gl-torus");