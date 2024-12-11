
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function ShaderProgram()
{
	///////////////
	// Attributs //
	///////////////
	
	var vertexShaderName = 'vertex-init';
	var fragmentShaderName = 'fragment-init';
	
	var param = {};
	var paramValues = {};

	var program;
	
	//var compile = false;
	var link = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.link = function($context)
	{
		var vertexShader = SHADERS[vertexShaderName];
		var fragmentShader = SHADERS[fragmentShaderName];
		
		if (vertexShader.isCompile() === true && fragmentShader.isCompile() === true && link === false)
		{
			for (var name in vertexShader.getParam())
				param[name] = vertexShader.getParam()[name];
			
			for (var name in fragmentShader.getParam())
				param[name] = fragmentShader.getParam()[name];
			
			program = $context.createProgram(); 
			$context.attachShader(program, vertexShader.getShader()); 
			$context.attachShader(program, fragmentShader.getShader()); 
			$context.linkProgram(program); 

			var programStatus = $context.getProgramParameter(program, $context.LINK_STATUS);
			
			//console.log("Program status : ");
			//console.log(programStatus);

			if (!programStatus)
			{
				console.log('Shaders "' + vertexShader.getName() + '" link log : ' + $context.getShaderInfoLog(vertexShader.getShader())); 
				console.log('Shaders "' + fragmentShader.getName() + '" link log : ' + $context.getShaderInfoLog(fragmentShader.getShader())); 
			}
			else 
			{
				//console.log('Link shaders "' + vertexShader.getName() + '", "' + fragmentShader.getName() + '" : SUCCESS'); 
				link = true; 
			}
		}
	}; 
	
	this.execute = function($context)
	{
		var vertexShader = SHADERS[vertexShaderName];
		var fragmentShader = SHADERS[fragmentShaderName];
		
		if (utils.isset($context) && vertexShader.isCompile() === true && fragmentShader.isCompile() && link === true)
		//if (utils.isset($context) && compile === true && link === true)
		{
			//console.log("Execute shader " + name);
			
			$context.useProgram(program); // Lancement du shader 
			
			var textureIndex = 0;
			
			for (key in paramValues)
			{
				var type = param[key];
				
				if (utils.isset(type))
				{
					if (type.uniform === true)
					{
						program[key] = $context.getUniformLocation(program, key);
						
						if (type.matrix === true)
						{
							if (type.size === 3)
								$context.uniformMatrix3fv(program[key], false, paramValues[key]);
							else if (type.size === 4)
								$context.uniformMatrix4fv(program[key], false, paramValues[key]);
						}
						else if (type.texture === true)
						{
							//$context.uniform1i(program[key], paramValues[key]);
							$context.activeTexture($context['TEXTURE' + textureIndex]);
							$context.bindTexture($context.TEXTURE_2D, paramValues[key]);
							
							$context.uniform1i(program[key], textureIndex);
							textureIndex++;
						}
						else
						{
							if (type.size === 1)
								$context.uniform1f(program[key], paramValues[key]);
							else if (type.size === 3)
								$context.uniform3fv(program[key], paramValues[key]);
							else if (type.size === 4)
								$context.uniform4fv(program[key], paramValues[key]);
						}
					}
					else
					{
						program[key] = $context.getAttribLocation(program, key);
						
						if (program[key] >= 0)
						{
							$context.enableVertexAttribArray(program[key]);
							$context.bindBuffer($context.ARRAY_BUFFER, paramValues[key]);
							$context.vertexAttribPointer(program[key], type.size, $context.FLOAT, false, 0, 0);
						}
					}
				}
			}

			/*
			if (param.textures === true)
			{
				program.textureCoordAttribute = $context.getAttribLocation(program, "aTextureCoord"); 
				$context.enableVertexAttribArray(program.textureCoordAttribute); 
				
				program.samplerUniform = $context.getUniformLocation(program, "uSampler");
			}
			//*/
		}
	}; 
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET 
	this.getParam = function() { return param; };
	this.getParamValues = function() { return paramValues; };
	this.getProgram = function() { return program; };
	
	// SET
	this.setVertexShaderName = function($vertexShaderName) { vertexShaderName = $vertexShaderName; };
	this.setFragmentShaderName = function($fragmentShaderName) { fragmentShaderName = $fragmentShaderName; };
	
	this.setParamValue = function($name, $value)
	{
		var type = param[$name];
		
		if (utils.isset(type))
			paramValues[$name] = $value;
	};
	
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("shader-program");