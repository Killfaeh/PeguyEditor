
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLObject()
{
	///////////////
	// Attributs //
	///////////////

	var type = 'object';
	var ID = (new Date()).getTime() + '' + Math.round(Math.random()*1000000.0);

	var init = false;
	
	var x = 0.0;
	var y = 0.0;
	var z = 0.0;
	
	var theta = 0.0;
	var phi = 0.0;
	var omega = 0.0;
	
	var scaleX = 1.0;
	var scaleY = 1.0;
	var scaleZ = 1.0;

	var mvMatrix = null;
	var moved = false;
	
	var vertexShaderName = 'vertex-init';
	var fragmentShaderName = 'fragment-init';
	
	var shader = new ShaderProgram();

	var material = new GLMaterial();
	
	/*
	var textureName = '';
	var texture;
	//*/
	
	var paramValues = {};
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function() {};
	
	// Contrôler si on peu afficher ou non
	// Si la bounding box est entièrement à l'intérieur ou entièrement à l'extérieur de l'écran on ne teste pas les sous items
	// Si la bounding box est au bord de l'écran on teste les sous items
	
	// Contrôle d'affichage sur la distance
	// Calculer une distance maximale d'affichage en fonction de la taille de la bounding box
	// Définir une taille d'affichage minimale de la bounding box en projection 2D (nombre de pixels)
	
	this.linkShaders = function($context)
	{
		if (init === false)
		{
			shader.setVertexShaderName(vertexShaderName);
			shader.setFragmentShaderName(fragmentShaderName);
			shader.link($context);
		}

		init = true;
	};
	
	this.render = function($context)
	{
		/*
		if (utils.isset(textureName) && textureName !== '')
			texture = $context.textures[textureName];
		//*/
		
		/*
		var translateMatrix = new TranslateMatrix(x, y, z);
		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
		var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
		var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);
		var scaleMatrix = new ScaleMatrix(scaleX, scaleY, scaleZ);
		
		var mvMatrix = new Matrix();
		mvMatrix.identity();

		// Remonte les groupes parents

		mvMatrix.multiplyLeft(translateMatrix);
		mvMatrix.multiplyLeft(rotateMatrixTheta);
		mvMatrix.multiplyLeft(rotateMatrixPhi);
		mvMatrix.multiplyLeft(rotateMatrixOmega);
		mvMatrix.multiplyLeft(scaleMatrix);
		//*/

		shader.setParamValue('uPMatrix', $context.perspectiveMatrix.getTable());
		shader.setParamValue('uCMatrix', $context.camera.getMatrix().getTable());
		shader.setParamValue('uAmbientLight', $context.ambientLight);
		
		for (var i = 0; i < $context.directionalLights.length; i++)
		{
			shader.setParamValue('uDLightColor_' + i, $context.directionalLights[i].getColor());
			shader.setParamValue('uDLightDirection_' + i, $context.directionalLights[i].getDirection());
		}

		shader.setParamValue('uBaseColor', material.getBaseColor());
		shader.setParamValue('uSpecularColor', material.getSpecularColor());
		shader.setParamValue('uSpecular', material.getSpecular());
		
		//shader.setParamValue('uMVMatrix', mvMatrix.getTable());
		
		//console.log("PARAM VALUES");
		//console.log(paramValues);
		
		for (var name in paramValues)
			shader.setParamValue(name, paramValues[name]);
		
		shader.execute($context);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getType = function() { return type; };
	this.getID = function() { return ID; };

	this.getInstance = function() { return new GLInstance($this); };

	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getZ = function() { return z; };
	
	this.getTheta = function() { return theta; };
	this.getPhi = function() { return phi; };
	this.getOmega = function() { return omega; };
	
	this.getScaleX = function() { return scaleX; };
	this.getScaleY = function() { return scaleY; };
	this.getScaleZ = function() { return scaleZ; };

	this.isMoved = function() { return moved; };

	this.getMvMatrix = function()
	{
		var mvMatrix = new Matrix();
		mvMatrix.identity();

		if (x !== 0.0 || y !== 0.0 || z !== 0.0)
		{
			var translateMatrix = new TranslateMatrix(x, y, z);
			mvMatrix.multiplyLeft(translateMatrix);
		}

		if (theta !== 0.0)
		{
			var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
			mvMatrix.multiplyLeft(rotateMatrixTheta);
		}

		if (phi !== 0.0)
		{
			var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
			mvMatrix.multiplyLeft(rotateMatrixPhi);
		}

		if (omega !== 0.0)
		{
			var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);
			mvMatrix.multiplyLeft(rotateMatrixOmega);
		}

		if (scaleX !== 1.0 || scaleY !== 1.0 || scaleZ !== 1.0)
		{
			var scaleMatrix = new ScaleMatrix(scaleX, scaleY, scaleZ);
			mvMatrix.multiplyLeft(scaleMatrix);
		}

		return mvMatrix;
	};

	this.getNMvMatrix = function()
	{
		var mvMatrix = new Matrix();
		mvMatrix.identity();

		var rotateMatrixTheta = new RotateMatrix(0, 0, 1, theta);
		var rotateMatrixPhi = new RotateMatrix(0, 1, 0, phi);
		var rotateMatrixOmega = new RotateMatrix(1, 0, 0, omega);
		
		var scaleMatrix = null;

		if (scaleX === 0.0)
			scaleMatrix = new ScaleMatrix(1.0, 0.0, 0.0);
		else if (scaleY === 0.0)
			scaleMatrix = new ScaleMatrix(0.0, 1.0, 0.0);
		else if (scaleZ === 0.0)
			scaleMatrix = new ScaleMatrix(0.0, 0.0, 1.0);
		else
			scaleMatrix = new ScaleMatrix(1.0/scaleX, 1.0/scaleY, 1.0/scaleZ);

		mvMatrix.multiplyLeft(rotateMatrixTheta);
		mvMatrix.multiplyLeft(rotateMatrixPhi);
		mvMatrix.multiplyLeft(rotateMatrixOmega);
		mvMatrix.multiplyLeft(scaleMatrix);

		return mvMatrix;
	};
	
	this.getVertexShaderName = function() { return vertexShaderName; };
	this.getFragmentShaderName = function() { return fragmentShaderName; };
	this.getShader = function() { return shader; };
	this.getMaterial = function() { return material; };
	// Mettre ça dans un objet material général
	//this.getTextureName = function() { return textureName; };
	//this.getTexture = function() { return texture; };
	
	this.getParamValues = function() { return paramValues; };
	
	// SET
	this.setInit = function($init) { init = $init; };

	this.setX = function($x)
	{
		x = $x;
		moved = true;
	};

	this.setY = function($y)
	{
		y = $y;
		moved = true;
	};

	this.setZ = function($z)
	{ 
		z = $z; 
		moved = true;
	};
	
	this.setTheta = function($theta)
	{
		theta = $theta;
		moved = true;
	};

	this.setPhi = function($phi)
	{
		phi = $phi;
		moved = true;
	};

	this.setOmega = function($omega)
	{
		omega = $omega;
		moved = true;
	};
	
	this.setScaleX = function($scaleX)
	{
		scaleX = $scaleX;
		moved = true;
	};

	this.setScaleY = function($scaleY)
	{
		scaleY = $scaleY;
		moved = true;
	};

	this.setScaleZ = function($scaleZ)
	{
		scaleZ = $scaleZ;
		moved = true;
	};

	this.setScale = function($scale)
	{
		scaleX = $scale;
		scaleY = $scale;
		scaleZ = $scale;
		moved = true;
	};

	this.setMoved = function($moved) { moved = $moved; };

	this.reinitMoved = function() { moved = false; };
	
	this.setVertexShaderName = function($vertexShaderName) { vertexShaderName = $vertexShaderName; };
	this.setFragmentShaderName = function($fragmentShaderName) { fragmentShaderName = $fragmentShaderName; };
	this.setShader = function($shader) { shader = $shader; };
	this.setMaterial = function($material) { material = $material; };
	//this.setTextureName = function($textureName) { textureName = $textureName; };
	//this.setTexture = function($texture) { texture = $texture; };
	
	this.setParamValues = function($paramValues) { paramValues = $paramValues; };
	
	this.setParamValue = function($name, $value)
	{
		//console.log("Set " + $name + " : " + $value);
		//console.log(paramValues);
		paramValues[$name] = $value;
	};

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-object");