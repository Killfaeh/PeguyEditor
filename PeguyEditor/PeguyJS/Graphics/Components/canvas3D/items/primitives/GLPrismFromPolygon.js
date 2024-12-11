
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPrismFromPolygon($radius1, $radius2, $height, $deltaX, $deltaY, $verticesList, $heightResolution, $bottomClosed, $topClosed, $textureMode, $axis)
{
	///////////////
	// Attributs //
	///////////////

	var axis = $axis;

	if (axis !== 'x' && axis !== 'y' && axis !== 'z')
		axis = 'z';
	
	var glBuffer = new GLBuffer();
	
	var radius1 = $radius1;
	var radius2 = $radius2;
	var height = $height;
	var deltaX = $deltaX;
	var deltaY = $deltaY;
	var verticesList = $verticesList;
	var heightResolution = $heightResolution;
	var bottomClosed = $bottomClosed;
	var topClosed = $topClosed;
	
	var textureMode = 0;
	// 0 : Même texture sur les 3 faces (texture en une partie) et texture entière sur chaque face
	// 1 : Même texture sur les 3 faces (texture en une partie) et texture entière sur un tour complet
	// 2 : Une texture pour le cylindre une autre pour les couvercle (texture en 2 parties)
	// 3 : Une texture pour le cylindre une autre pour les couvercle (texture en 2 parties) sur un tour complet
	// 4 : Une texture pour le cylindre une par couvercle (texture en 3 parties)
	// 5 : Une texture pour le cylindre une par couvercle (texture en 3 parties) sur un tour complet
	
	if (utils.isset($textureMode))
		textureMode = $textureMode;
	
	//////////////
	// Méthodes //
	//////////////
	
	var init = function()
	{
		var prismData = GLData.createPrismFromPolygonData(radius1, radius2, height, deltaX, deltaY, verticesList, heightResolution, axis);

		glBuffer.setVertices(prismData.vertices);
		glBuffer.setNormals(prismData.normals);
		glBuffer.setTangentsX(prismData.tangentsX);
		glBuffer.setTangentsY(prismData.tangentsY);
		glBuffer.setTexture(prismData.texture);
		glBuffer.setColors(prismData.colors);
		glBuffer.setIndices(prismData.indices);

		var polygon = new MathPolygon($verticesList);
		var maxRadius = polygon.getMaxRadius();
		
		var scale1 = 1.0;
		var scale2 = 1.0;

		if (utils.isset(radius1))
			scale1 = radius1/maxRadius;

		if (utils.isset(radius2))
			scale2 = radius2/maxRadius;

		if (bottomClosed === true)
		{
			var polygon1 = new GLPolygon($verticesList, false, axis);
			polygon1.setScale(scale1);

			if (axis === 'x')
			{
				polygon1.setX(-height/2.0);
				polygon1.setY(-deltaX/2.0);
				polygon1.setZ(-deltaY/2.0);
			}
			else if (axis === 'y')
			{
				polygon1.setX(-deltaY/2.0);
				polygon1.setY(-height/2.0);
				polygon1.setZ(-deltaX/2.0);
			}
			else
			{
				polygon1.setX(-deltaX/2.0);
				polygon1.setY(-deltaY/2.0);
				polygon1.setZ(-height/2.0);
			}

			polygon1.reverseNormals();
			glBuffer = glBuffer.fuse(polygon1);
		}

		if (topClosed === true)
		{
			var polygon2 = new GLPolygon($verticesList, false, axis);
			polygon2.setScale(scale2);

			if (axis === 'x')
			{
				polygon2.setX(height/2.0);
				polygon2.setY(deltaX/2.0);
				polygon2.setZ(deltaY/2.0);
			}
			else if (axis === 'y')
			{
				polygon2.setX(deltaY/2.0);
				polygon2.setY(height/2.0);
				polygon2.setZ(deltaX/2.0);
			}
			else
			{
				polygon2.setX(deltaX/2.0);
				polygon2.setY(deltaY/2.0);
				polygon2.setZ(height/2.0);
			}

			glBuffer = glBuffer.fuse(polygon2);
		}
	};

	//this.init = function() { init(); };
	
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
	Loader.hasLoaded("gl-prism-from-polygon");