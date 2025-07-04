
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLGroup()
{
	///////////////
	// Attributs //
	///////////////

	var init = false;

	var type = 'group';

	var instancesList = [];
	
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

	this.linkShaders = function($context)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].linkShaders($context);
	};

	this.update = function($context)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].update($context);
	};
	
	this.render = function($context)
	{
		// Mise à jour des objets 
		for (var i = 0; i < instancesList.length; i++)
		{
			var type = instancesList[i].getType();

			if (type === 'object')
			{
				instancesList[i] = new GLInstance(instancesList[i]);
				instancesList[i].parentGroup = $this;
			}

			//instancesList[i].setOutlineOffset(averageDirectionalLight);

			instancesList[i].update($context);
		}

		// Affichage des objets (il faudra ajouter un gestionnaire d'ordre d'affichage et ne pas envoyer à l'affichage ce qui n'apparait pas à l'écran)
		
		for (var i = 0; i < instancesList.length; i++)
		{
			instancesList[i].render($context);
			$context.bindTexture($context.TEXTURE_2D, null);
		}

		init = true;
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

	this.getRawData = function()
	{
		var rawData = { v: [], vn: [], vt: [], f: [], materials: [] };

		var offsetIndex = 0;

		for (var i = 0; i < instancesList.length; i++)
		{
			var instanceRawData = instancesList[i].getRawData();

			var mvMatrix = $this.getMvMatrix();
			var vertices = instanceRawData.v;
			var nbVertices = vertices.length/3;

			for (var j = 0; j < nbVertices; j++)
			{
				var x = vertices[j*3];
				var y = vertices[j*3+1];
				var z = vertices[j*3+2];
				var outputVector = mvMatrix.multiplyVect([x, y, z, 1.0]);
				rawData.v.push(outputVector[0]);
				rawData.v.push(outputVector[1]);
				rawData.v.push(outputVector[2]);
			}

			var nMvMatrix = $this.getNMvMatrix();
			var normals = instanceRawData.vn;
			//nbVertices = normals.length/3;

			for (var j = 0; j < nbVertices; j++)
			{
				var x = normals[j*3];
				var y = normals[j*3+1];
				var z = normals[j*3+2];
				var outputVector = new Vector(nMvMatrix.multiplyVect([x, y, z, 1.0]));
				outputVector = outputVector.normalize();
				rawData.vn.push(outputVector.values()[0]);
				rawData.vn.push(outputVector.values()[1]);
				rawData.vn.push(outputVector.values()[2]);
			}

			for (var j = 0; j < instanceRawData.vt.length; j++)
				rawData.vt.push(instanceRawData.vt[j]);

			for (var j = 0; j < instanceRawData.f.length; j++)
				rawData.f.push(instanceRawData.f[j] + offsetIndex);

			for (var j = 0; j < instanceRawData.materials.length; j++)
				rawData.materials.push(instanceRawData.materials[j]);

			offsetIndex = offsetIndex + instanceRawData.v.length/3;
		}

		console.log("Group : ");
		console.log(rawData);

		return rawData;
	};

	this.getCOLLADAdata = function()
	{
		var colladaInstanceList = [];

		for (var i = 0; i < instancesList.length; i++)
		{
			var colladaInstanceSubList = instancesList[i].getCOLLADAdata();

			console.log(colladaInstanceSubList);

			for (var j = 0; j < colladaInstanceSubList.length; j++)
			{
				var groupMVmatrix = $this.getMvMatrix();

				var colladaData = {};

				colladaData.meshID = colladaInstanceSubList[j].meshID;
				colladaData.transformMatrix = groupMVmatrix.multiplyLeft(colladaInstanceSubList[j].transformMatrix);
				colladaData.materialName = colladaInstanceSubList[j].materialName;

				colladaInstanceList.push(colladaData);
			}
		}

		return colladaInstanceList;
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
		
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].reinitMoved();
	};

	this.setParamValue = function($name, $value)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].setParamValue($name, $value);
	};

	this.setOutline = function($param)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].setOutline($param);
	};

	this.addInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index < 0)
		{
			instancesList.push($instance);
			$instance.parentGroup = $this;
		}
	};
	
	this.removeInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index >= 0)
		{
			instancesList.splice(index, 1);
			$instance.parentGroup = null;
		}
	};
	
	this.removeAllInstances = function()
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].parentGroup = null;

		instancesList = [];
	};

	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-group");