
function Canvas3D($width, $height)
{
	initShaders();
	
	///////////////
	// Attributs //
	///////////////
	
	var width = $width;
	var height = $height;
	var ratio = width/height;
	
	var canvas = new Component('<canvas></canvas>');
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	
	var context = canvas.getContext("webgl", { antialias: true } );

	var init = false;
	
	var shaders = {};
	var textures = {};

	var camera = new GLCamera();
	var perspectiveMatrix = new PerspectiveMatrix(45.0, ratio, 0.01, 1000000000.0);
	var backgroundColor = [0.0, 0.0, 0.0, 0.0];

	var MAX_LIGHTS = 8;
	var ambientLight = [0.0, 0.0, 0.0, 1.0];
	var lights = [];
	var instancesList = [];

	// Données temporaires

	var directionalLights = [];
	var pointLights = [];
	var spotLights = [];

	var allGreyScales = 0.0;
	var averageDirectionalLight = [0.0, 0.0, 0.0];
	
	//////////////
	// Méthodes //
	//////////////
	
	// Peut être surchargée mais pas forcément
	
	this.render = function()
	{
		COLLADA_MESH = {};
		
		// Tri des types de lumière

		directionalLights = [];
		pointLights = [];
		spotLights = [];

		for (var i = 0; i < lights.length; i++)
		{
			if (lights[i].getType() === LIGHT_TYPES.point)
				pointLights.push(lights[i]);
			else if (lights[i].getType() === LIGHT_TYPES.spot)
				spotLights.push(lights[i]);
			else
			{
				directionalLights.push(lights[i]);
				allGreyScales += lights[i].getGreyScale();
			}
		}

		// Calcul de la direction moyenne de la lumière (c'est pour décaler les outlines)
		computeLightDirectionMean();

		// Envoie des données au contexte
		context.perspectiveMatrix = perspectiveMatrix;
		context.camera = camera;
		
		context.ambientLight = ambientLight;
		context.directionalLights = directionalLights;

		// Le nombre de lumières envoyées au shader doit être constent
		if (context.directionalLights.length < MAX_LIGHTS)
		{
			var remaining = MAX_LIGHTS - context.directionalLights.length;
			
			for (var i = 0; i < remaining; i++)
			{
				var blackLight = new GLLight();
				blackLight.setColor([0.0, 0.0, 0.0, 0.0]);
				blackLight.setDirection([0.0, 0.0, 0.0]);
				context.directionalLights.push(blackLight);
			}
		}

		// Initialisation du contexte
		context.getExtension('OES_standard_derivatives');
		//context.getExtension('EXT_shader_texture_lod');
		context.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
		context.enable(context.DEPTH_TEST);
		context.enable(context.BLEND);
		context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
		//context.blendFuncSeparate(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA, context.ONE, context.ONE_MINUS_SRC_ALPHA);
		//context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
		//context.enable(context.ALPHA_TEST);
		//context.alphaFunc(context.GREATER, 0.5);

		if (init === false)
		{
			// Conversion des images en textures
			$this.createTextures();

			context.textures = textures;

			// Compilation des shaders
			for (var key in SHADERS)
			{
				if (utils.isset(SHADERS[key].compile))
					SHADERS[key].compile(context);
			}
		}

		// Link des shaders
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].linkShaders(context);
		
		// Paramétrage de la vue
		context.viewport(0, 0, width, height); // Définition du cadre
		context.viewportWidth = width;
		context.viewportHeight = height;
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT); // Réinitialisation de l'affichage

		// Mise à jour des objets 
		for (var i = 0; i < instancesList.length; i++)
		{
			var type = instancesList[i].getType();

			if (type === 'object')
				instancesList[i] = new GLInstance(instancesList[i]);

			//instancesList[i].setOutlineOffset(averageDirectionalLight);

			instancesList[i].update(context);
		}

		// Affichage des objets (il faudra ajouter un gestionnaire d'ordre d'affichage et ne pas envoyer à l'affichage ce qui n'apparait pas à l'écran)
		
		for (var i = 0; i < instancesList.length; i++)
		{
			instancesList[i].setParamValue('uCameraPosition', [camera.getX(), camera.getY(), camera.getZ()]);
			instancesList[i].render(context);
			context.bindTexture(context.TEXTURE_2D, null);
		}

		init = true;
	};
	
	var computeLightDirectionMean = function()
	{
		for (var i = 0; i < directionalLights.length; i++)
		{
			var greyScale = directionalLights[i].getGreyScale()/allGreyScales;
			averageDirectionalLight[0] += greyScale*directionalLights[i].getDirection()[0];
			averageDirectionalLight[1] += greyScale*directionalLights[i].getDirection()[1];
			averageDirectionalLight[2] += greyScale*directionalLights[i].getDirection()[2];
		}
	};

	this.createTextures = function()
	{
		for (var key in TEXTURES)
		{
			if (utils.isset(TEXTURES[key].create))
				TEXTURES[key].create(context);
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getRatio = function() { return ratio; };
	this.getContext = function() { return context; };

	this.getTextures = function() { return textures; };
	this.getTexture = function($name) { return textures[$name]; };

	this.getData = function($x, $y, $width, $height) { return context.getImageData($x , $y, $width, $height); };

	this.getCamera = function() { return camera; };
	
	// SET
	
	this.setWidth = function($width)
	{
		width = $width;
		canvas.setAttribute('width', width);
		ratio = width/height;
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		canvas.setAttribute('height', height);
		ratio = width/height;
	};

	this.setSize = function($width, $height)
	{
		width = $width;
		height = $height;
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);
		ratio = width/height;
	};

	this.setShaders = function($shaders) { shaders = $shaders; };
	this.setShader = function($name, $shader) { shaders[$name] = $shader; };
	this.resetShaders = function() { shaders = {}; };

	this.setTextures = function($textures) { textures = $textures; };
	this.setTexture = function($name, $texture) { textures[$name] = $texture; };
	this.resetTexture = function() { textures = {}; };

	this.setCamera = function($camera) { camera = $camera; };
	this.setPerspectiveMatrix = function($perspectiveMatrix) { perspectiveMatrix = $perspectiveMatrix; };
	this.setBackgroundColor = function($r, $g, $b, $alpha) { backgroundColor = [$r, $g, $b, $alpha]; };

	this.setAmbientLight = function($ambientLight) { ambientLight = $ambientLight; };

	this.addLight = function($light)
	{
		var index = lights.indexOf($light);
		
		if (index < 0)
		lights.push($light);
	};
	
	this.removeLight = function($light)
	{
		var index = lights.indexOf($light);
		
		if (index >= 0)
			lights.splice(index, 1);
	};
	
	this.emptyLights = function() { lights = []; };
	this.setLights = function($lights) { lights = $lights; };

	this.addInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index < 0)
			instancesList.push($instance);
	};
	
	this.removeInstance = function($instance)
	{
		var index = instancesList.indexOf($instance);
		
		if (index >= 0)
			instancesList.splice(index, 1);
	};
	
	this.removeAllInstances = function() { instancesList = []; };

	this.setOutline = function($param)
	{
		for (var i = 0; i < instancesList.length; i++)
			instancesList[i].setOutline($param);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(canvas, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("canvas3D");