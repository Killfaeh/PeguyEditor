
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLInstance($object)
{
	///////////////
	// Attributs //
	///////////////

	var type = 'instance';

	var object = $object;
	
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
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function() {};

	this.linkShaders = function($context)
	{
		object.linkShaders($context);
	};

	this.update = function($context)
	{
		if (utils.isset(object.update))
			object.update($context);
	};
	
	// Contrôler si on peu afficher ou non
	// Si la bounding box est entièrement à l'intérieur ou entièrement à l'extérieur de l'écran on ne teste pas les sous items
	// Si la bounding box est au bord de l'écran on teste les sous items
	
	// Contrôle d'affichage sur la distance
	// Calculer une distance maximale d'affichage en fonction de la taille de la bounding box
	// Définir une taille d'affichage minimale de la bounding box en projection 2D (nombre de pixels)
	
	this.render = function($context)
	{
		var parentGroups = [];
		var parentGroup = $this.parentGroup;

		while (utils.isset(parentGroup))
		{
			if (parentGroup.isMoved() === true)
			{
				//console.log(parentGroup);
				parentGroups.push(parentGroup);
				moved = true;
			}

			parentGroup = parentGroup.parentGroup;
		}

		if (!utils.isset(mvMatrix) || moved === true)
		{
			mvMatrix = new Matrix();
			mvMatrix.identity();

			// Remonte les groupes parents

			for (var i = parentGroups.length-1; i >= 0; i--)
			{
				var group = parentGroups[i];

				if (group.getX() !== 0.0 || group.getY() !== 0.0 || group.getZ() !== 0.0)
				{
					var translateMatrix = new TranslateMatrix(group.getX(), group.getY(), group.getZ());
					mvMatrix.multiplyLeft(translateMatrix);
				}
				
				if (group.getTheta() !== 0.0)
				{
					var rotateMatrixTheta = new RotateMatrix(0, 0, 1, group.getTheta());
					mvMatrix.multiplyLeft(rotateMatrixTheta);
				}
				
				if (group.getPhi() !== 0.0)
				{
					var rotateMatrixPhi = new RotateMatrix(0, 1, 0, group.getPhi());
					mvMatrix.multiplyLeft(rotateMatrixPhi);
				}
				
				if (group.getOmega() !== 0.0)
				{
					var rotateMatrixOmega = new RotateMatrix(1, 0, 0, group.getOmega());
					mvMatrix.multiplyLeft(rotateMatrixOmega);
				}
				
				if (group.getScaleX() !== 1.0 || group.getScaleY() !== 1.0 || group.getScaleZ() !== 1.0)
				{
					var scaleMatrix = new ScaleMatrix(group.getScaleX(), group.getScaleY(), group.getScaleZ());
					mvMatrix.multiplyLeft(scaleMatrix);
				}
			}

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
		}
		
		//console.log(mvMatrix.getTable());
		//console.log((new Error()).stack);

		object.setParamValue('uMVMatrix', mvMatrix.getTable());
		
		object.render($context);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getType = function() { return type; };
	this.getObject = function() { return object; };

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

	this.getTransformedVertices = function()
	{
		var tmpVertices = [];
		var mvMatrix = $this.getMvMatrix();
		var vertices = object.getTransformedVertices();
		var nbVertices = vertices.length/3;

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
		var normals = object.getTransformedNormals();
		var nbVertices = normals.length/3;

		for (var i = 0; i < nbVertices; i++)
		{
			var x = normals[i*3];
			var y = normals[i*3+1];
			var z = normals[i*3+2];
			var outputVector = new Vector(nMvMatrix.multiplyVect([x, y, z, 1.0]));
			outputVector = outputVector.normalize();
			tmpNormals.push(outputVector.values()[0]);
			tmpNormals.push(outputVector.values()[1]);
			tmpNormals.push(outputVector.values()[2]);
		}

		return tmpNormals;
	};

	this.getRawData = function()
	{
		var rawData =
		{ 
			v: $this.getTransformedVertices(), 
			vn: $this.getTransformedNormals(), 
			vt: object.getTexture(), 
			f: object.getIndices(),
			materials: []
		};

		for (var i = 0; i < rawData.v.length/3; i++)
			rawData.materials.push(object.getMaterial().getName());

		console.log("Instance : ");
		console.log(rawData);

		return rawData;
	};

	this.getCOLLADAdata = function()
	{
		var colladaData = {};

		var objectCOLLADAdata = object.getCOLLADAdata();

		var instanceMVmatrix = $this.getMvMatrix();

		colladaData.meshID = objectCOLLADAdata.meshID;
		colladaData.transformMatrix = instanceMVmatrix.multiplyLeft(objectCOLLADAdata.transformMatrix);
		colladaData.materialName = objectCOLLADAdata.materialName;

		return [colladaData];
	};
	
	// SET
	
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

	this.reinitMoved = function()
	{
		moved = false;
		object.setMoved(false);
	};

	this.setParamValue = function($name, $value) { object.setParamValue($name, $value); };

	this.setOutline = function($param)
	{
		if (utils.isset(object.isOutlined))
		{
			var isOutlined = object.isOutlined();

			if (isOutlined !== true)
			{
				object.setOutline($param.enable);
				object.setOutlineWidth($param.width);
				object.setOutlineColor($param.color);
			}
		}
	};

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-instance");