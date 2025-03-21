
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

var NB_GL_BUFFERS = 0;
var COLLADA_MESH = {};

function GLBuffer()
{
	///////////////
	// Attributs //
	///////////////
	
	var glObject = new GLObject();
	
	var init = false;
	var mode = 4; // context.TRIANGLES == 4
	// Liste des modes : https://openclassrooms.com/fr/courses/167717-creez-des-programmes-en-3d-avec-opengl/164757-notions-de-base
	var nbVertices = 0;
	
	var outline = false;
	var outlineWidth = 0.01;
	var outlineColor = [0.0, 0.0, 0.0, 1.0];
	var outlineOffset = [0.0, 0.0, 0.0];
	var outlineClone = null;
	
	var findEdges = false;
	var findEdgesClone = null;
	var edgesColor = [0.0, 0.0, 0.0, 1.0];
	
	var vertices = new Array();
	var normals = new Array();
	var tangentsX = new Array();
	var tangentsY = new Array();
	var textureTangentsX = new Array();
	var textureTangentsY = new Array();
	var textureTangentsZ = new Array();
	var colors = new Array();
	var texture = new Array();
	var indices = new Array();
	
	var verticesBuffer;
	var normalsBuffer;
	var tangentsXBuffer;
	var tangentsYBuffer;
	var textureTangentsXBuffer;
	var textureTangentsYBuffer;
	var textureTangentsZBuffer;
	var colorsBuffer;
	var textureBuffer;
	var indexBuffer;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function($context)
	{
		if (init === false)
		{
			var drawMode = $context.STATIC_DRAW;
			var tmpVertices = [];
			var mvMatrix = $this.getMvMatrix();

			nbVertices = vertices.length/3;

			for (var i = 0; i < nbVertices; i++)
			{
				var x = vertices[i*3];
				var y = vertices[i*3+1];
				var z = vertices[i*3+2];
				var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
				tmpVertices.push(outputVector[0]);
				tmpVertices.push(outputVector[1]);
				tmpVertices.push(outputVector[2]);
			}
			
			verticesBuffer = $context.createBuffer();
			normalsBuffer = $context.createBuffer();
			tangentsXBuffer = $context.createBuffer();
			tangentsYBuffer = $context.createBuffer();
			textureTangentsXBuffer = $context.createBuffer();
			textureTangentsYBuffer = $context.createBuffer();
			textureTangentsZBuffer = $context.createBuffer();
			colorsBuffer = $context.createBuffer();
			textureBuffer = $context.createBuffer();
			indexBuffer = $context.createBuffer();
			
			$context.bindBuffer($context.ARRAY_BUFFER, verticesBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(tmpVertices), drawMode);
			
			$context.bindBuffer($context.ARRAY_BUFFER, normalsBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(normals), drawMode);
			
			$context.bindBuffer($context.ARRAY_BUFFER, tangentsXBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(tangentsX), drawMode);
			
			if (!utils.isset(textureTangentsX) || textureTangentsX.length !== tangentsX.length)
			{
				textureTangentsX = new Array();
				
				for (var i = 0; i < nbVertices; i++)
				{
					textureTangentsX.push(1.0);
					textureTangentsX.push(0.0);
					textureTangentsX.push(0.0);
				}
			}
			
			$context.bindBuffer($context.ARRAY_BUFFER, textureTangentsXBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(textureTangentsX), drawMode);
			
			$context.bindBuffer($context.ARRAY_BUFFER, tangentsYBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(tangentsY), drawMode);
			
			if (!utils.isset(textureTangentsY) || textureTangentsY.length !== tangentsY.length)
			{
				textureTangentsY = new Array();
				
				for (var i = 0; i < nbVertices; i++)
				{
					textureTangentsY.push(0.0);
					textureTangentsY.push(1.0);
					textureTangentsY.push(0.0);
				}
			}
			
			$context.bindBuffer($context.ARRAY_BUFFER, textureTangentsYBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(textureTangentsY), drawMode);
			
			if (!utils.isset(textureTangentsZ) || textureTangentsZ.length !== tangentsY.length)
			{
				textureTangentsZ = new Array();
				
				for (var i = 0; i < nbVertices; i++)
				{
					textureTangentsZ.push(0.0);
					textureTangentsZ.push(0.0);
					textureTangentsZ.push(1.0);
				}
			}
			
			$context.bindBuffer($context.ARRAY_BUFFER, textureTangentsZBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(textureTangentsZ), drawMode);
			
			if (!utils.isset(colors) || colors.length !== 4*nbVertices)
			{
				colors = new Array(); 
				
				for (var i = 0; i < 4*nbVertices; i++)
					colors[i] = 1.0; 
			}
			
			$context.bindBuffer($context.ARRAY_BUFFER, colorsBuffer); 
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(colors), drawMode);
			
			$context.bindBuffer($context.ARRAY_BUFFER, textureBuffer);
			$context.bufferData($context.ARRAY_BUFFER, new Float32Array(texture), drawMode);
			
			$context.bindBuffer($context.ELEMENT_ARRAY_BUFFER, indexBuffer); 
			$context.bufferData($context.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), drawMode);
			
			if (findEdges === true)
			{
				findEdgesClone = $this.clone();
				findEdgesClone.setVertexShaderName('vertex-normals-texture');
				findEdgesClone.setFragmentShaderName('fragment-normals');
				findEdgesClone.linkShaders($context);
				findEdgesClone.init($context);
			}
			
			if (outline === true)
			{
				outlineClone = $this.clone();
				outlineClone.solidify(outlineWidth, 0.000001);
				outlineClone.setVertexShaderName('vertex-normals-texture');
				outlineClone.setFragmentShaderName('fragment-outline');
				outlineClone.linkShaders($context);
				outlineClone.init($context);
			}
			
			init = true; 
		}
	};
	
	this.update = function($context)
	{
		//init = false; 
		this.init($context); 
	}; 
	
	this.render = function render($context) 
	{
		$context.disable($context.CULL_FACE);

		if (outline === true && utils.isset(outlineClone))
		{
			//outlineClone.setX(glObject.getX() + outlineOffset[0]*outlineWidth);
			//outlineClone.setY(glObject.getY() + outlineOffset[1]*outlineWidth);
			//outlineClone.setZ(glObject.getZ() + outlineOffset[2]*outlineWidth);
			
			outlineClone.setParamValue('uColor', outlineColor);
			
			$context.enable($context.CULL_FACE);
			$context.cullFace($context.BACK);
			outlineClone.render($context);
			$context.disable($context.CULL_FACE);
		}
		
		if (findEdges === true && utils.isset(findEdgesClone) 
			&& utils.isset($context.viewportWidth) && utils.isset($context.viewportHeight) 
			&& $context.viewportWidth > 0 && $context.viewportHeight > 0)
		{
			var screenTexture = $this.renderOnTexture($context, findEdgesClone, glObject.getVertexShaderName(), glObject.getFragmentShaderName());
			var normalsTexture = $this.renderOnTexture($context, findEdgesClone, 'vertex-normals-texture', 'fragment-normals');
			
			findEdgesClone.setParamValue('uWResolution', $context.viewportWidth);
			findEdgesClone.setParamValue('uHResolution', $context.viewportHeight);
			findEdgesClone.setParamValue('uScreenTexture', screenTexture);
			findEdgesClone.setParamValue('uNormalsTexture', normalsTexture);
			findEdgesClone.setParamValue('uEdgeColor', edgesColor);
			
			findEdgesClone.render($context);
		}
		else
		{
			glObject.setParamValue('aVertexPosition', verticesBuffer);
			glObject.setParamValue('aVertexNormal', normalsBuffer);
			glObject.setParamValue('aVertexTangentX', tangentsXBuffer);
			glObject.setParamValue('aVertexTangentY', tangentsYBuffer);
			/*
			glObject.setParamValue('aVertexTextureTangentX', textureTangentsXBuffer);
			glObject.setParamValue('aVertexTextureTangentY', textureTangentsYBuffer);
			glObject.setParamValue('aVertexTextureTangentZ', textureTangentsZBuffer);
			glObject.setParamValue('aVertexTexture', textureBuffer);
			//*/
			glObject.setParamValue('aVertexColor', colorsBuffer);
			//glObject.setParamValue('aTextureCoord', textureBuffer);
			
			// Push matrix
			this.execSuper('render', [$context], render);
			
			//$this.debug();
			$context.bindBuffer($context.ELEMENT_ARRAY_BUFFER, indexBuffer);
			$context.drawElements(mode, indices.length, $context.UNSIGNED_SHORT, 0);
		}
		
		// Pop matrix
	};
	
	//*
	this.renderOnTexture = function($context, $item, $vertexShaderName, $fragmentShaderName)
	{
		$item.setVertexShaderName($vertexShaderName);
		$item.setFragmentShaderName($fragmentShaderName);
		//$item.linkShaders($context);
		
		for (var name in glObject.getShader().getParamValues())
			$item.getShader().setParamValue(name, glObject.getShader().getParamValues()[name]);
		
		var targetTexture = $context.createTexture();
		$context.bindTexture($context.TEXTURE_2D, targetTexture);
		
		$context.texImage2D($context.TEXTURE_2D, 0, $context.RGBA,
							$context.viewportWidth, $context.viewportHeight, 0,
							$context.RGBA, $context.UNSIGNED_BYTE, null);
		
		$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MAG_FILTER, $context.LINEAR);
		$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_MIN_FILTER, $context.LINEAR);
		$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_S, $context.CLAMP_TO_EDGE);
		$context.texParameteri($context.TEXTURE_2D, $context.TEXTURE_WRAP_T, $context.CLAMP_TO_EDGE);
		
		// Create and bind the framebuffer
		var frameBuffer = $context.createFramebuffer();
		$context.bindFramebuffer($context.FRAMEBUFFER, frameBuffer);
		$context.framebufferTexture2D($context.FRAMEBUFFER, $context.COLOR_ATTACHMENT0, $context.TEXTURE_2D, targetTexture, 0);
		
		var renderBuffer = $context.createRenderbuffer();
		$context.bindRenderbuffer($context.RENDERBUFFER, renderBuffer);
		$context.renderbufferStorage($context.RENDERBUFFER, $context.DEPTH_COMPONENT16, $context.viewportWidth, $context.viewportHeight);
		$context.framebufferRenderbuffer($context.FRAMEBUFFER, $context.DEPTH_ATTACHMENT, $context.RENDERBUFFER, renderBuffer);
		
		$context.clearColor(0.0, 0.0, 0.0, 0.0);
		$context.enable($context.DEPTH_TEST);
		$context.enable($context.BLEND);
		$context.blendFunc($context.SRC_ALPHA, $context.ONE_MINUS_SRC_ALPHA);
		//$context.blendFuncSeparate($context.SRC_ALPHA, $context.ONE_MINUS_SRC_ALPHA, $context.ONE, $context.ONE_MINUS_SRC_ALPHA);
		//$context.blendFunc($context.ONE, $context.ONE_MINUS_SRC_ALPHA);
		
		$item.render($context);
		
		$context.bindFramebuffer($context.FRAMEBUFFER, null);
		
		return targetTexture;
	};
	//*/

	this.reverseNormals = function()
	{
		init = false;

		for (var i = 0; i < normals.length; i++)
			normals[i] = -normals[i];
		
		var newIndices = [];

		for (var i = indices.length-1; i >= 0; i--)
			newIndices.push(indices[i]);

		indices = newIndices;
	};

	this.solidify = function($delta, $distance)
	{
		init = false;

		var verticesList = [];
		var dejaVu = [];
		var sortedIndices = {};

		for (var i = 0; i < nbVertices; i++)
		{
			var vertex = [vertices[3*i], vertices[3*i+1], vertices[3*i+2]];
			verticesList.push(vertex);
		}

		for (var i = 0; i < verticesList.length; i++)
		{
			var vertex1 = verticesList[i];

			if (dejaVu.indexOf(j) < 0 && !utils.isset(sortedIndices[i]))
			{
				sortedIndices[i] = [];

				for (var j = i; j < verticesList.length; j++)
				{
					var vertex2 = verticesList[j];
					var distance = Math.sqrt((vertex2[0]-vertex1[0])*(vertex2[0]-vertex1[0]) 
											+ (vertex2[1]-vertex1[1])*(vertex2[1]-vertex1[1]) 
											+ (vertex2[2]-vertex1[2])*(vertex2[2]-vertex1[2]));
					
					if (distance <= $distance && dejaVu.indexOf(j) < 0)
					{
						dejaVu.push(j);
						sortedIndices[i].push(j);
					}
				}
			}
		}

		for (var index in sortedIndices)
		{
			var indicesList = sortedIndices[index];

			if (indicesList.length > 1)
			{
				var globalMoveVertex = [0.0, 0.0, 0.0];
				var normalMean = [0.0, 0.0, 0.0];
				var tmpNormals = [];
				var dots = [];

				for (var i = 0; i < indicesList.length; i++)
				{
					var normal = $this.getNormalAtIndex(indicesList[i]);
					tmpNormals.push(normal);
					var moveVertex = [normal[0]*$delta, normal[1]*$delta, normal[2]*$delta];
					globalMoveVertex = [globalMoveVertex[0]+moveVertex[0], globalMoveVertex[1]+moveVertex[1], globalMoveVertex[2]+moveVertex[2]];
					normalMean = [normalMean[0]+normal[0], normalMean[1]+normal[1], normalMean[2]+normal[2]];
				}

				normalMean = [normalMean[0]/indicesList.length, normalMean[1]/indicesList.length, normalMean[2]/indicesList.length];

				for (var i = 0; i < tmpNormals.length; i++)
				{
					var normal1 = tmpNormals[i];
					var dot = Math.dotProduct({x: normalMean[0], y: normalMean[1], z: normalMean[2]}, {x: normal1[0], y: normal1[1], z: normal1[2]});
					dots.push(dot);
				}

				var dotMean = 0.0;

				for (var i = 0; i < dots.length; i++)
					dotMean = dotMean + dots[i];

				dotMean = Math.abs(dotMean/dots.length);

				if (dotMean > 0.0 && dotMean < 0.99999999999999)
					globalMoveVertex = [globalMoveVertex[0]*dotMean, globalMoveVertex[1]*dotMean, globalMoveVertex[2]*dotMean];
				/*
				else if (dotMean === 0.0 && dots.length === 1)
				{
					var newDelta = Math.sqrt(2*$delta*$delta);
					globalMoveVertex = Math.normalizeVector({ x: globalMoveVertex[0], y: globalMoveVertex[1], z: globalMoveVertex[2] });
					globalMoveVertex = [globalMoveVertex.x*newDelta, globalMoveVertex.y*newDelta, globalMoveVertex.z*newDelta];
				}
				//*/
				else
					globalMoveVertex = [normalMean[0]*$delta, normalMean[1]*$delta, normalMean[2]*$delta];
					//globalMoveVertex = [globalMoveVertex[0]/indicesList.length, globalMoveVertex[1]/indicesList.length, globalMoveVertex[2]/indicesList.length];
				

				for (var i = 0; i < indicesList.length; i++)
				{
					var originalVertex = $this.getVertexAtIndex(indicesList[i]);
					var newVertex = [originalVertex[0]+globalMoveVertex[0], originalVertex[1]+globalMoveVertex[1], originalVertex[2]+globalMoveVertex[2]];
					$this.setVertexAtIndex(indicesList[i], newVertex);
				}
			}
			else if (indicesList.length === 1)
			{
				var normal = $this.getNormalAtIndex(indicesList[0]);
				var moveVertex = [normal[0]*$delta, normal[1]*$delta, normal[2]*$delta];
				var originalVertex = $this.getVertexAtIndex(indicesList[0]);
				var newVertex = [originalVertex[0]+moveVertex[0], originalVertex[1]+moveVertex[1], originalVertex[2]+moveVertex[2]];
				$this.setVertexAtIndex(indicesList[0], newVertex);
			}
		}
	};

	this.applyAllTransform = function()
	{
		init = false;
		vertices = $this.getTransformedVertices();
		normals = $this.getTransformedNormals();
		this.setX(0.0);
		this.setY(0.0);
		this.setZ(0.0);
		this.setTheta(0.0);
		this.setPhi(0.0);
		this.setOmega(0.0);
		this.setScaleX(1.0);
		this.setScaleY(1.0);
		this.setScaleZ(1.0);
	};
	
	this.clone = function()
	{
		var clone = new GLBuffer();
		
		clone.setMode(mode);
		clone.setVertices(vertices);
		clone.setNormals(normals);
		clone.setTangentsX(tangentsX);
		clone.setTangentsY(tangentsY);
		clone.setTextureTangentsX(textureTangentsX);
		clone.setTextureTangentsY(textureTangentsY);
		clone.setTextureTangentsZ(textureTangentsZ);
		clone.setColors(colors);
		clone.setTexture(texture);
		clone.setIndices(indices);
		
		clone.setX(glObject.getX());
		clone.setY(glObject.getY());
		clone.setZ(glObject.getZ());
		
		clone.setTheta(glObject.getTheta());
		clone.setPhi(glObject.getPhi());
		clone.setOmega(glObject.getOmega());
		
		clone.setScaleX(glObject.getScaleX());
		clone.setScaleY(glObject.getScaleY());
		clone.setScaleZ(glObject.getScaleZ());
		
		clone.setVertexShaderName(glObject.getVertexShaderName());
		clone.setFragmentShaderName(glObject.getFragmentShaderName());
		//clone.setTextureName(glObject.getTextureName());
		
		clone.setParamValues(glObject.getParamValues());
		
		return clone;
	};
	
	this.fuse = function($objects)
	{
		var outputBuffer = $this.clone();
		outputBuffer.setVertices(outputBuffer.getTransformedVertices());
		outputBuffer.setNormals(outputBuffer.getTransformedNormals());
		outputBuffer.setX(0.0);
		outputBuffer.setY(0.0);
		outputBuffer.setZ(0.0);
		outputBuffer.setTheta(0.0);
		outputBuffer.setPhi(0.0);
		outputBuffer.setOmega(0.0);
		outputBuffer.setScaleX(1.0);
		outputBuffer.setScaleY(1.0);
		outputBuffer.setScaleZ(1.0);

		if (!utils.isset($objects.length))
			$objects = [$objects];
		
		for (var i = 0; i < $objects.length; i++)
		{
			var nbVertices = outputBuffer.getNbVertices();

			outputBuffer.setVertices(GLData.concatArray(outputBuffer.getVertices(), $objects[i].getTransformedVertices()));
			outputBuffer.setNormals(GLData.concatArray(outputBuffer.getNormals(), $objects[i].getTransformedNormals()));
			outputBuffer.setTangentsX(GLData.concatArray(outputBuffer.getTangentsX(), $objects[i].getTangentsX()));
			outputBuffer.setTangentsY(GLData.concatArray(outputBuffer.getTangentsY(), $objects[i].getTangentsY()));
			outputBuffer.setTextureTangentsX(GLData.concatArray(outputBuffer.getTextureTangentsX(), $objects[i].getTextureTangentsX()));
			outputBuffer.setTextureTangentsY(GLData.concatArray(outputBuffer.getTextureTangentsY(), $objects[i].getTextureTangentsY()));
			outputBuffer.setTextureTangentsZ(GLData.concatArray(outputBuffer.getTextureTangentsZ(), $objects[i].getTextureTangentsZ()));
			outputBuffer.setColors(GLData.concatArray(outputBuffer.getColors(), $objects[i].getColors()));
			outputBuffer.setTexture(GLData.concatArray(outputBuffer.getTexture(), $objects[i].getTexture()));

			var indicesToAdd = [];

			for (var j = 0; j < $objects[i].getIndices().length; j++)
				indicesToAdd.push($objects[i].getIndices()[j]+nbVertices);

			outputBuffer.setIndices(GLData.concatArray(outputBuffer.getIndices(), indicesToAdd));
		}

		return outputBuffer;
	};

	this.debug = function()
	{
		console.log("Debug GLBuffer : ");
		console.log("Nb vertices : " + nbVertices);
		console.log("Vertices : ");
		console.log(vertices);
		console.log("Normals : ");
		console.log(normals);
		console.log("Tangents X : ");
		console.log(tangentsX);
		console.log("Tangents Y : ");
		console.log(tangentsY);
		console.log("Texture tangents X : ");
		console.log(textureTangentsX);
		console.log("Texture tangents Y : ");
		console.log(textureTangentsY);
		console.log("Texture tangents Z : ");
		console.log(textureTangentsZ);
		console.log("Colors : ");
		console.log(colors);
		console.log("Texture : ");
		console.log(texture);
		console.log("Indices : ");
		console.log(indices);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.isInit = function() { return init; };
	
	this.getNbVertices = function() { return nbVertices; };
	this.getVertices = function() { return vertices; };

	this.getTransformedVertices = function()
	{
		var tmpVertices = [];
		var mvMatrix = $this.getMvMatrix();

		for (var i = 0; i < nbVertices; i++)
		{
			var x = vertices[i*3];
			var y = vertices[i*3+1];
			var z = vertices[i*3+2];
			var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
			tmpVertices.push(outputVector[0]);
			tmpVertices.push(outputVector[1]);
			tmpVertices.push(outputVector[2]);
		}

		return tmpVertices;
	};

	this.getTransformedNormals = function()
	{
		var tmpNormals = [];
		var nMvMatrix = $this.getNMvMatrix();

		for (var i = 0; i < nbVertices; i++)
		{
			var x = normals[i*3];
			var y = normals[i*3+1];
			var z = normals[i*3+2];
			var outputVector = nMvMatrix.multiplyVect([x, y, z, 1.0]);
			outputVector = Math.normalizeVector(outputVector);
			tmpNormals.push(outputVector[0]);
			tmpNormals.push(outputVector[1]);
			tmpNormals.push(outputVector[2]);
		}

		return tmpNormals;
	};

	this.getVerticesBuffer = function() { return verticesBuffer; };
	this.getNormals = function() { return normals; };
	this.getTangentsX = function() { return tangentsX; };
	this.getTangentsY = function() { return tangentsY; };
	this.getTextureTangentsX = function() { return textureTangentsX; };
	this.getTextureTangentsY = function() { return textureTangentsY; };
	this.getTextureTangentsZ = function() { return textureTangentsZ; };
	this.getColors = function() { return colors; };
	this.getTexture = function() { return texture; };
	this.getIndices = function() { return indices; };

	this.getVertexAtIndex = function($index) { return [vertices[3*$index], vertices[3*$index+1], vertices[3*$index+2]]; };

	this.getTransformedVertexAtIndex = function($index)
	{
		var mvMatrix = $this.getMvMatrix();
		var originalVertex = [vertices[3*$index], vertices[3*$index+1], vertices[3*$index+2], 1.0];
		var outputVector = mvMatrix.multiplyVect(originalVertex);
		return outputVector;
	};

	this.getNormalAtIndex = function($index) { return [normals[3*$index], normals[3*$index+1], normals[3*$index+2]]; };
	this.getTangentXAtIndex = function($index) { return [tangentsX[3*$index], tangentsX[3*$index+1], tangentsX[3*$index+2]]; };
	this.getTangentYAtIndex = function($index) { return [tangentsY[3*$index], tangentsY[3*$index+1], tangentsY[3*$index+2]]; };
	this.getTextureTangentXAtIndex = function($index) { return [textureTangentsX[3*$index], textureTangentsX[3*$index+1], textureTangentsX[3*$index+2]]; };
	this.getTextureTangentYAtIndex = function($index) { return [textureTangentsY[3*$index], textureTangentsY[3*$index+1], textureTangentsY[3*$index+2]]; };
	this.getTextureTangentZAtIndex = function($index) { return [textureTangentsZ[3*$index], textureTangentsZ[3*$index+1], textureTangentsZ[3*$index+2]]; };
	this.getColorAtIndex = function($index) { return [colors[4*$index], colors[4*$index+1], colors[4*$index+2], colors[4*$index+3]]; };
	this.getTextureAtIndex = function($index) { return [texture[2*$index], texture[2*$index+1]]; };
	
	this.getRawData = function()
	{
		var rawData =
		{
			v: $this.getTransformedVertices(),
			vn: $this.getTransformedNormals(),
			vt: $this.getTexture(),
			f: $this.getIndices(),	
			materials: []
		};

		for (var i = 0; i < rawData.v.length/3; i++)
			rawData.materials.push($this.getMaterial().getName());

		console.log("Buffer : ");
		console.log(rawData);

		return rawData;
	};

	this.getCOLLADAdata = function()
	{
		var colladaData = {};

		var geometryCode = '		<geometry id="' + glObject.getID() + '-mesh" name="' + glObject.getID() + '">\n';
		geometryCode = geometryCode + '			<mesh>\n';

		// Vertices position
		geometryCode = geometryCode + '				<source id="' + glObject.getID() + '-mesh-positions">\n';
		geometryCode = geometryCode + '					<float_array id="' + glObject.getID() + '-mesh-positions-array" count="' + ($this.getVertices().length) + '">';

		for (var i = 0; i < $this.getVertices().length; i++)
			geometryCode = geometryCode + $this.getVertices()[i] + ' ';

		geometryCode = geometryCode + '</float_array>\n';
		geometryCode = geometryCode + '					<technique_common>\n';
		geometryCode = geometryCode + '						<accessor source="#' + glObject.getID() + '-mesh-positions-array" count="' + ($this.getVertices().length/3) + '" stride="3">\n';
		geometryCode = geometryCode + '							<param name="X" type="float"/>\n';
		geometryCode = geometryCode + '							<param name="Y" type="float"/>\n';
		geometryCode = geometryCode + '							<param name="Z" type="float"/>\n';
		geometryCode = geometryCode + '						</accessor>\n';
		geometryCode = geometryCode + '					</technique_common>\n';
		geometryCode = geometryCode + '				</source>\n';

		// Normals
		geometryCode = geometryCode + '				<source id="' + glObject.getID() + '-mesh-normals">\n';
		geometryCode = geometryCode + '					<float_array id="' + glObject.getID() + '-mesh-normals-array" count="' + ($this.getNormals().length) + '">';

		for (var i = 0; i < $this.getNormals().length; i++)
			geometryCode = geometryCode + $this.getNormals()[i] + ' ';

		geometryCode = geometryCode + '</float_array>\n';
		geometryCode = geometryCode + '					<technique_common>\n';
		geometryCode = geometryCode + '						<accessor source="#' + glObject.getID() + '-mesh-normals-array" count="' + ($this.getNormals().length/3) + '" stride="3">\n';
		geometryCode = geometryCode + '							<param name="X" type="float"/>\n';
		geometryCode = geometryCode + '							<param name="Y" type="float"/>\n';
		geometryCode = geometryCode + '							<param name="Z" type="float"/>\n';
		geometryCode = geometryCode + '						</accessor>\n';
		geometryCode = geometryCode + '					</technique_common>\n';
		geometryCode = geometryCode + '				</source>\n';

		// Texture
		geometryCode = geometryCode + '				<source id="' + glObject.getID() + '-mesh-map-0">\n';
		geometryCode = geometryCode + '					<float_array id="' + glObject.getID() + '-mesh-map-0-array" count="' + ($this.getTexture().length) + '">';

		for (var i = 0; i < $this.getTexture().length; i++)
			geometryCode = geometryCode + $this.getTexture()[i] + ' ';

		geometryCode = geometryCode + '</float_array>\n';
		geometryCode = geometryCode + '					<technique_common>\n';
		geometryCode = geometryCode + '						<accessor source="#' + glObject.getID() + '-mesh-map-0-array" count="' + ($this.getTexture().length/2) + '" stride="2">\n';
		geometryCode = geometryCode + '							<param name="S" type="float"/>\n';
		geometryCode = geometryCode + '							<param name="T" type="float"/>\n';
		geometryCode = geometryCode + '						</accessor>\n';
		geometryCode = geometryCode + '					</technique_common>\n';
		geometryCode = geometryCode + '				</source>\n';

		// Vertices
		geometryCode = geometryCode + '				<vertices id="' + glObject.getID() + '-mesh-vertices">\n';
		geometryCode = geometryCode + '					<input semantic="POSITION" source="#' + glObject.getID() + '-mesh-positions"/>\n';
		geometryCode = geometryCode + '				</vertices>\n';

		// Indices
		geometryCode = geometryCode + '				<triangles material="' + glObject.getMaterial().getName() + '-material" count="' + ($this.getIndices().length/3) + '">\n';
		geometryCode = geometryCode + '					<input semantic="VERTEX" source="#' + glObject.getID() + '-mesh-vertices" offset="0"/>\n';
		geometryCode = geometryCode + '					<input semantic="NORMAL" source="#' + glObject.getID() + '-mesh-normals" offset="1"/>\n';
		geometryCode = geometryCode + '					<input semantic="TEXCOORD" source="#' + glObject.getID() + '-mesh-map-0" offset="2" set="0"/>\n';
		geometryCode = geometryCode + '					<p>';

		for (var i = $this.getIndices().length-1; i >= 0; i--)
		{
			geometryCode = geometryCode + $this.getIndices()[i] + ' ';
			geometryCode = geometryCode + $this.getIndices()[i] + ' ';
			geometryCode = geometryCode + $this.getIndices()[i] + ' ';
		}

		geometryCode = geometryCode + '</p>\n';
		geometryCode = geometryCode + '				</triangles>\n';

		geometryCode = geometryCode + '			</mesh>\n';
		geometryCode = geometryCode + '		</geometry>\n';

		colladaData.meshID = glObject.getID();
		colladaData.geometryCode = geometryCode;
		colladaData.transformMatrix = $this.getMvMatrix();
		colladaData.materialName = $this.getMaterial().getName();

		COLLADA_MESH[glObject.getID()] = colladaData;

		return colladaData;
	};

	this.isOutlined = function() { return outline; };
	this.getOutlineWidth = function() { return outlineWidth; };
	this.getOutlineColor = function() { return outlineColor; };
	this.getOutlineOffset = function() { return outlineOffset; };
	
	this.getFindEdges = function() { return findEdges; };
	
	// SET
	this.setInit = function($init) { init = $init; };
	this.setMode = function($mode) { mode = $mode; };

	this.setX = function setX($x)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setX($x);
		
		this.execSuper('setX', [$x], setX);
	};

	this.setY = function setY($y)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setY($y);

		this.execSuper('setY', [$y], setY);
	};

	this.setZ = function setZ($z)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setZ($z);

		this.execSuper('setZ', [$z], setZ);
	};

	this.setTheta = function setTheta($theta)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setTheta($theta);

		this.execSuper('setTheta', [$theta], setTheta);
	};

	this.setPhi = function setPhi($phi)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setPhi($phi);

		this.execSuper('setPhi', [$phi], setPhi);
	};

	this.setOmega = function setOmega($omega)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setOmega($omega);

		this.execSuper('setOmega', [$omega], setOmega);
	};
	
	this.setScaleX = function setScaleX($scaleX)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setScaleX($scaleX);

		this.execSuper('setScaleX', [$scaleX], setScaleX);
	};

	this.setScaleY = function setScaleY($scaleY)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setScaleY($scaleY);

		this.execSuper('setScaleY', [$scaleY], setScaleY);
	};

	this.setScaleZ = function setScaleZ($scaleZ)
	{
		init = false;

		if (utils.isset(outlineClone))
			outlineClone.setScaleZ($scaleZ);

		this.execSuper('setScaleZ', [$scaleZ], setScaleZ);
	};
	
	this.setOutline = function($outline)
	{
		init = false;
		outline = $outline;
	};

	this.setOutlineWidth = function($outlineWidth)
	{
		init = false;
		outlineWidth = $outlineWidth;
	};
	
	this.setOutlineColor = function($outlineColor)
	{
		init = false;
		outlineColor = $outlineColor;
	};

	this.setOutlineOffset = function($outlineOffset)
	{
		init = false;
		outlineOffset = $outlineOffset;
	};
	
	this.setFindEdges = function($findEdges) { findEdges = $findEdges; };
	this.setEdgesColor = function($edgesColor) { edgesColor = $edgesColor; };
	
	this.setVertices = function($vertices)
	{
		init = false;
		vertices = $vertices;
		nbVertices = vertices.length/3;
	};
	
	this.setVerticesAndUpdate = function($vertices, $context)
	{
		init = false;
		vertices = $vertices;
		nbVertices = vertices.length/3;
		this.update($context);
	};
	
	this.setNormals = function($normals)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $normals.length === nbVertices*3))
			normals = $normals;
		else if (nbVertices > 0 && $normals.length > nbVertices*3)
		{
			normals = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				normals[i] = $normals[i];
		}
		else if (nbVertices > 0 && $normals.length < nbVertices*3)
		{
			normals = new Array();
			
			for (var i = 0; i < $normals.length; i++)
				normals[i] = $normals[i];
			
			for (var i = $normals.length; i < nbVertices*3; i++)
				normals[i] = 1.0;
		}
	};
	
	this.setTangentsX = function($tangentsX)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $tangentsX.length === nbVertices*3))
			tangentsX = $tangentsX;
		else if (nbVertices > 0 && $tangentsX.length > nbVertices*3)
		{
			tangentsX = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				tangentsX[i] = $tangentsX[i];
		}
		else if (nbVertices > 0 && $tangentsX.length < nbVertices*3)
		{
			tangentsX = new Array();
			
			for (var i = 0; i < $tangentsX.length; i++)
				tangentsX[i] = $tangentsX[i];
			
			for (var i = $tangentsX.length; i < nbVertices*3; i++)
				tangentsX[i] = 1.0;
		}
	};
	
	this.setTextureTangentsX = function($textureTangentsX)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $textureTangentsX.length === nbVertices*3))
			textureTangentsX = $textureTangentsX;
		else if (nbVertices > 0 && $textureTangentsX.length > nbVertices*3)
		{
			textureTangentsX = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				textureTangentsX[i] = $textureTangentsX[i];
		}
		else if (nbVertices > 0 && $textureTangentsX.length < nbVertices*3)
		{
			textureTangentsX = new Array();
			
			for (var i = 0; i < $textureTangentsX.length; i++)
				textureTangentsX[i] = $textureTangentsX[i];
			
			for (var i = $textureTangentsX.length; i < nbVertices*3; i++)
				textureTangentsX[i] = 0.0;
		}
	};
	
	this.setTangentsY = function($tangentsY)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $tangentsY.length === nbVertices*3))
			tangentsY = $tangentsY;
		else if (nbVertices > 0 && $tangentsY.length > nbVertices*3)
		{
			tangentsY = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				tangentsY[i] = $tangentsY[i];
		}
		else if (nbVertices > 0 && $tangentsY.length < nbVertices*3)
		{
			tangentsY = new Array();
			
			for (var i = 0; i < $tangentsY.length; i++)
				tangentsY[i] = $tangentsY[i];
			
			for (var i = $tangentsY.length; i < nbVertices*3; i++)
				tangentsY[i] = 0.0;
		}
	};
	
	this.setTextureTangentsY = function($textureTangentsY)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $textureTangentsY.length === nbVertices*3))
			textureTangentsY = $textureTangentsY;
		else if (nbVertices > 0 && $textureTangentsY.length > nbVertices*3)
		{
			textureTangentsY = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				textureTangentsY[i] = $textureTangentsY[i];
		}
		else if (nbVertices > 0 && $textureTangentsY.length < nbVertices*3)
		{
			textureTangentsY = new Array();
			
			for (var i = 0; i < $textureTangentsY.length; i++)
				textureTangentsY[i] = $textureTangentsY[i];
			
			for (var i = $textureTangentsY.length; i < nbVertices*3; i++)
				textureTangentsY[i] = 0.0;
		}
	};
	
	this.setTextureTangentsZ = function($textureTangentsZ)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $textureTangentsZ.length === nbVertices*3))
			textureTangentsZ = $textureTangentsZ;
		else if (nbVertices > 0 && $textureTangentsZ.length > nbVertices*3)
		{
			textureTangentsZ = new Array();
			
			for (var i = 0; i < nbVertices*3; i++)
				textureTangentsZ[i] = $textureTangentsZ[i];
		}
		else if (nbVertices > 0 && $textureTangentsZ.length < nbVertices*3)
		{
			textureTangentsZ = new Array();
			
			for (var i = 0; i < $textureTangentsZ.length; i++)
				textureTangentsZ[i] = $textureTangentsZ[i];
			
			for (var i = $textureTangentsZ.length; i < nbVertices*3; i++)
				textureTangentsZ[i] = 0.0;
		}
	};
	
	this.setColors = function($colors)
	{
		init = false;
		
		if (nbVertices === 0 || (nbVertices > 0 && $colors.length === nbVertices*4))
			colors = $colors; 
		else if (nbVertices > 0 && $colors.length > nbVertices*4)
		{
			colors = new Array();
			
			for (var i = 0; i < nbVertices*4; i++)
				colors[i] = $colors[i];
		}
		else if (nbVertices > 0 && $colors.length < nbVertices*4)
		{
			colors = new Array();
			
			for (var i = 0; i < $colors.length; i++)
				colors[i] = $colors[i];
			
			for (var i = $colors.length; i < nbVertices*4; i++)
				colors[i] = 1.0;
		}
	};
	
	this.setTexture = function($texture)
	{
		init = false;
		texture = $texture;
	};
	
	this.setIndices = function($indices)
	{
		init = false;
		indices = $indices;
	};

	this.setVertexAtIndex = function($index, $vertex)
	{ 
		init = false;
		vertices[3*$index] = $vertex[0];
		vertices[3*$index+1] = $vertex[1];
		vertices[3*$index+2] = $vertex[2];
	};

	this.setNormalAtIndex = function($index, $normal)
	{ 
		init = false;
		normals[3*$index] = $normal[0];
		normals[3*$index+1] = $normal[1];
		normals[3*$index+2] = $normal[2];
	};

	this.setTangentXAtIndex = function($index, $tangentX)
	{ 
		init = false;
		tangentsX[3*$index] = $tangentX[0];
		tangentsX[3*$index+1] = $tangentX[1];
		tangentsX[3*$index+2] = $tangentX[2];
	};

	this.setTangentYAtIndex = function($index, $tangentY)
	{ 
		init = false;
		tangentsY[3*$index] = $tangentY[0];
		tangentsY[3*$index+1] = $tangentY[1];
		tangentsY[3*$index+2] = $tangentY[2];
	};

	this.setTextureTangentXAtIndex = function($index, $tangentX)
	{ 
		init = false;
		textureTangentsX[3*$index] = $tangentX[0];
		textureTangentsX[3*$index+1] = $tangentX[1];
		textureTangentsX[3*$index+2] = $tangentX[2];
	};

	this.setTextureTangentYAtIndex = function($index, $tangentY)
	{ 
		init = false;
		textureTangentsY[3*$index] = $tangentY[0];
		textureTangentsY[3*$index+1] = $tangentY[1];
		textureTangentsY[3*$index+2] = $tangentY[2];
	};

	this.setTextureTangentZAtIndex = function($index, $tangentZ)
	{ 
		init = false;
		textureTangentsZ[3*$index] = $tangentZ[0];
		textureTangentsZ[3*$index+1] = $tangentZ[1];
		textureTangentsZ[3*$index+2] = $tangentZ[2];
	};

	this.setColorAtIndex = function($index, $color)
	{ 
		init = false;
		colors[4*$index] = $color[0];
		colors[4*$index+1] = $color[1];
		colors[4*$index+2] = $color[2];
		colors[4*$index+3] = $color[3];
	};

	this.setTextureAtIndex = function($index, $texture)
	{ 
		init = false;
		texture[2*$index] = $texture[0];
		texture[2*$index+1] = $texture[1];
	};

	this.setParamValue = function setParamValue($name, $value)
	{
		if (utils.isset(outlineClone))
			outlineClone.setParamValue($name, $value);

		this.execSuper('setParamValue', [$name, $value], setParamValue);
	};

	//////////////
	// Héritage //
	//////////////

	NB_GL_BUFFERS++;
	var $this = utils.extend(glObject, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-buffer");