
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLRender()
{
	initShaders();
	
	///////////////
	// Attributs //
	///////////////
	
	var width = 500;
	var height = 500;
	
	var context;
	
	var shaders = {};
	var textures = {};
	
	var camera;
	var perspectiveMatrix;
	
	var MAX_LIGHTS = 8;
	var ambientLight = [0.0, 0.0, 0.0, 1.0];
	var lights = [];
	var items = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	var screentones = [];
	var screentonesCreated = 0;
	
	this.onScreentonesCreated = function() {};
	
	var onScreentonesCreated = function()
	{
		screentonesCreated++;
		
		if (screentonesCreated >= screentones.length)
			$this.onScreentonesCreated();
	};
	
	this.reinitScreentones = function()
	{
		screentones = [];
		
		for (var key in TEXTURES)
		{
			if (utils.isset(TEXTURES[key].isScreentone) && TEXTURES[key].isScreentone() === true)
			{
				TEXTURES[key].setWidth(width);
				TEXTURES[key].setHeight(height);
				TEXTURES[key].setCreated(false);
				TEXTURES[key].setCallback(onScreentonesCreated);
				screentones.push(TEXTURES[key]);
			}
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
	
	this.render = function()
	{
		var directionalLights = [];
		var pointLights = [];
		var spotLights = [];
		
		var allGreyScales = 0.0;
		var averageDirectionalLight = [0.0, 0.0, 0.0];
		
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
		
		for (var i = 0; i < directionalLights.length; i++)
		{
			var greyScale = directionalLights[i].getGreyScale()/allGreyScales;
			averageDirectionalLight[0] += greyScale*directionalLights[i].getDirection()[0];
			averageDirectionalLight[1] += greyScale*directionalLights[i].getDirection()[1];
			averageDirectionalLight[2] += greyScale*directionalLights[i].getDirection()[2];
		}
		
		context.perspectiveMatrix = perspectiveMatrix;
		context.camera = camera;
		
		context.ambientLight = ambientLight;
		context.directionalLights = directionalLights;
		
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
		
		context.getExtension('OES_standard_derivatives');
		//context.getExtension('EXT_shader_texture_lod');
		context.clearColor(0.0, 0.0, 0.0, 0.0);
		context.enable(context.DEPTH_TEST);
		context.enable(context.BLEND);
		context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
		//context.blendFuncSeparate(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA, context.ONE, context.ONE_MINUS_SRC_ALPHA);
		//context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA);
		//context.enable(context.ALPHA_TEST);
		//context.alphaFunc(context.GREATER, 0.5);
		
		/*
		for (var key in TEXTURES)
		{
			if (utils.isset(TEXTURES[key].create))
				TEXTURES[key].create(context);
		}
		//*/
		
		$this.createTextures();
		
		for (var key in SHADERS)
		{
			if (utils.isset(SHADERS[key].compile))
				SHADERS[key].compile(context);
		}
		
		context.textures = textures;
		context.viewport(0, 0, width, height); // Définition du cadre
		context.viewportWidth = width;
		context.viewportHeight = height;
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT); // Réinitialisation de l'affichage
		
		// Mise à jour des objets 
		for (var i = 0; i < items.length; i++)
		{
			items[i].setOutlineOffset(averageDirectionalLight);
			items[i].update(context);
		}
		
		// Affichage des objets
		
		for (var i = 0; i < items.length; i++)
		{
			items[i].linkShaders(context);
			items[i].getShader().setParamValue('uCameraPosition', [camera.getX(), camera.getY(), camera.getZ()]);
			items[i].display(context);
			context.bindTexture(context.TEXTURE_2D, null);
		}

		// Réinitialisation du tag "moved"

		for (var i = 0; i < items.length; i++)
			items[i].reinitMoved();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	
	this.getContext = function() { return context; };
	//this.getShaders = function() { return shaders; };
	//this.getShader = function($name) { return shaders[$name]; };
	this.getTextures = function() { return textures; };
	this.getTexture = function($name) { return textures[$name]; };
	this.getScreentones = function() { return screentones; };
	
	// SET 
	
	this.setWidth = function($width) { width = $width; };
	this.setHeight = function($height) { height = $height; };
	this.setContext = function($context) { context = $context; };
	this.setShaders = function($shaders) { shaders = $shaders; };
	this.setShader = function($name, $shader) { shaders[$name] = $shader; };
	this.resetShaders = function() { shaders = {}; };
	this.setTextures = function($textures) { textures = $textures; };
	this.setTexture = function($name, $texture) { textures[$name] = $texture; };
	this.resetTexture = function() { textures = {}; };
	this.setCamera = function($camera) { camera = $camera; };
	this.setPerspectiveMatrix = function($perspectiveMatrix) { perspectiveMatrix = $perspectiveMatrix; };
	
	this.setAmbientLight = function($ambientLight) { ambientLight = $ambientLight; };
	this.addLight = function($light) { lights.push($light); };
	
	this.removeLight = function($light)
	{
		var index = lights.indexOf($light);
		
		if (index >= 0)
			lights.splice(index, 1);
	};
	
	this.emptyLights = function() { lights = []; };
	this.setLights = function($lights) { lights = $lights; };
	
	this.addItem = function($item) { items.push($item); };
	
	this.removeItem = function($item)
	{
		var index = items.indexOf($item);
		
		if (index >= 0)
			items.splice(index, 1);
	};
	
	this.emptyItems = function() { items = []; };
	this.setItems = function($items) { items = $items; };
	
	var $this = this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-render");