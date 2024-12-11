
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPrismRevolution($verticesList, $angle, $smoothTheta, $resolution, $closeStart, $closeEnd, $textureMode, $axis)
{
	///////////////
	// Attributs //
	///////////////

	var axis = $axis;

	if (axis !== 'x' && axis !== 'y' && axis !== 'z')
		axis = 'z';
	
	var glBuffer = new GLBuffer();
	
	var verticesList = $verticesList;
	var angle = $angle;
	
	if (angle <= 0.0 || angle > 360.0)
		angle = 360.0;
	
	var smoothTheta = $smoothTheta;
	var resolution = $resolution;
	
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

	var init = function()
	{
		var revolutionData = GLData.createPrismRevolutionData(verticesList, angle, smoothTheta, resolution, closeStart, closeEnd, axis);

		glBuffer.setVertices(revolutionData.vertices);
		glBuffer.setNormals(revolutionData.normals);
		glBuffer.setTangentsX(revolutionData.tangentsX);
		glBuffer.setTangentsY(revolutionData.tangentsY);
		glBuffer.setTexture(revolutionData.texture);
		glBuffer.setColors(revolutionData.colors);
		glBuffer.setIndices(revolutionData.indices);

		/*
		if (bottomClosed === true)
		{
			var disc1 = new GLDisc(radius1, angle, radiusResolution, thetaResolution);
			disc1.setX(-deltaX/2.0);
			disc1.setY(-deltaY/2.0);
			disc1.setZ(-height/2.0);
			disc1.reverseNormals();
			glBuffer = glBuffer.fuse(disc1);
		}

		if (topClosed === true)
		{
			var disc2 = new GLDisc(radius2, angle, radiusResolution, thetaResolution);
			disc2.setX(deltaX/2.0);
			disc2.setY(deltaY/2.0);
			disc2.setZ(height/2.0);
			glBuffer = glBuffer.fuse(disc2);
		}
		//*/
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	init();
	var $this = utils.extend(glBuffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-prism-revolution");