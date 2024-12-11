
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLCuboid($widthX, $widthY, $widthZ, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var widthX = $widthX;
	var widthY = $widthY;
	var widthZ = $widthZ;
	
	var textureMode = 0;
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var halfX = widthX/2.0;
		var halfY = widthY/2.0;
		var halfZ = widthZ/2.0;
		
		//console.log($context);
		
		//glBuffer.setMode($context.QUADS);
		
		glBuffer.setVertices(
		[
			// Front face
			-halfX, -halfY, -halfZ,
			 halfX, -halfY, -halfZ,
			 halfX, -halfY,  halfZ,
			-halfX, -halfY,  halfZ,
			
			// Right face
			halfX, -halfY, -halfZ,
			halfX,  halfY, -halfZ,
			halfX,  halfY,  halfZ,
			halfX, -halfY,  halfZ,
			
			// Back face
			-halfX,  halfY, -halfZ,
			 halfX,  halfY, -halfZ,
			 halfX,  halfY,  halfZ,
			-halfX,  halfY,  halfZ,
			
			// Left face
			-halfX, -halfY, -halfZ,
			-halfX,  halfY, -halfZ,
			-halfX,  halfY,  halfZ,
			-halfX, -halfY,  halfZ,
			
			// Top face
			-halfX, -halfY, halfZ,
			 halfX, -halfY, halfZ,
			 halfX,  halfY, halfZ,
			-halfX,  halfY, halfZ,
			
			// Bottom face
			-halfX, -halfY, -halfZ,
			 halfX, -halfY, -halfZ,
			 halfX,  halfY, -halfZ,
			-halfX,  halfY, -halfZ
		]);
		
		glBuffer.setNormals(
		[
			// Front face
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			
			// Right face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			// Back face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			
			// Left face
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			
			// Top face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			
			// Bottom face
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0
		]);
		
		glBuffer.setTangentsX(
		[
			// Front face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			// Right face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			
			// Back face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			// Left face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			
			// Top face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			// Bottom face
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0
		]);
		
		glBuffer.setTangentsY(
		[
			// Front face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			
			// Right face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			
			// Back face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			
			// Left face
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			
			// Top face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			
			// Bottom face
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0
		]);
		
		glBuffer.setColors(
		[
			//Front face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,

			// Right face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,

			// Back face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,

			// Left face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			
			// Top face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			
			// Bottom face
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0,
			1.0, 1.0, 1.0, 1.0
		]);
		
		//*
		if (textureMode === 1)
		{
			glBuffer.setTexture(
			[
				//Front face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0/6.0,
				0.0, 1.0/6.0,

				// Right face
				0.0, 1.0/6.0,
				1.0, 1.0/6.0,
				1.0, 1.0/3.0,
				0.0, 1.0/3.0,

				// Back face
				0.0, 1.0/3.0,
				1.0, 1.0/3.0,
				1.0, 0.5,
				0.0, 0.5,

				// Left face
				0.0, 0.5,
				1.0, 0.5,
				1.0, 2.0/3.0,
				0.0, 2.0/3.0,
				
				// Top face
				0.0, 2.0/3.0,
				1.0, 2.0/3.0,
				1.0, 5.0/6.0,
				0.0, 5.0/6.0,
				
				// Bottom face
				0.0, 5.0/6.0,
				1.0, 5.0/6.0,
				1.0, 1.0,
				0.0, 1.0
			]);
		}
		else
		{
			glBuffer.setTexture(
			[
				//Front face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,

				// Right face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,

				// Back face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,

				// Left face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				
				// Top face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				
				// Bottom face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0
			]);
		}
		//*/
		
		glBuffer.setIndices([0, 2, 1, 0, 3, 2, 
								4, 6, 5, 4, 7, 6, 
								8, 9, 10, 8, 10, 11, 
								12, 13, 14, 12, 14, 15, 
								16, 18, 17, 16, 19, 18, 
								20, 21, 22, 20, 22, 23]);
	};
	
	/*
	this.render = function render($context)
	{
		this.execSuper('render', [$context], render);
		//console.log("Display cuboid ! ");
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getWidthX = function() { return widthX; };
	this.getWidthY = function() { return widthY; };
	this.getWidthZ = function() { return widthZ; };
	
	// SET
	this.setWidthX = function($widthX)
	{
		widthX = $widthX;
		init();
	};

	this.setWidthY = function($widthY)
	{
		widthY = $widthY;
		init();
	};

	this.setWidthZ = function($widthZ)
	{
		widthZ = $widthZ;
		init();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-cuboid");