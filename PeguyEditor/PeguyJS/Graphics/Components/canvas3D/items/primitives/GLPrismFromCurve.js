function GLPrismFromCurve($radius1, $radius2, $width, $height, $deltaX, $deltaY, $verticesList, $heightResolution, $bottomClosed, $topClosed, $textureMode, $axis, $cornerMode, $cornerAngle, $cornerResolution)
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
	var width = Math.abs($width);
	var height = $height;
	var deltaX = $deltaX;
	var deltaY = $deltaY;
	var verticesList = $verticesList;
	var cornerMode = $cornerMode;
	var cornerAngle = $cornerAngle;
	var cornerResolution = $cornerResolution;
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
		var ribbon1 = GLRibbonFromCurve(verticesList, width, axis, cornerMode, cornerAngle, cornerResolution);
		var ribbon2 = ribbon1.clone();
		var polygonVertices = ribbon1.getPolygonVertices();

		var prismData = GLData.createPrismFromPolygonData(radius1, radius2, height, deltaX, deltaY, polygonVertices, heightResolution, axis);

		glBuffer.setVertices(prismData.vertices);
		glBuffer.setNormals(prismData.normals);
		glBuffer.setTangentsX(prismData.tangentsX);
		glBuffer.setTangentsY(prismData.tangentsY);
		glBuffer.setTexture(prismData.texture);
		glBuffer.setColors(prismData.colors);
		glBuffer.setIndices(prismData.indices);

		var polygon = new MathPolygon(polygonVertices);
		var maxRadius = polygon.getMaxRadius();
		
		var scale1 = 1.0;
		var scale2 = 1.0;

		if (utils.isset(radius1))
			scale1 = radius1/maxRadius;

		if (utils.isset(radius2))
			scale2 = radius2/maxRadius;

		if (bottomClosed === true)
		{
			ribbon1.setScale(scale1);

			if (axis === 'x')
			{
				ribbon1.setX(-height/2.0);
				ribbon1.setY(-deltaX/2.0);
				ribbon1.setZ(-deltaY/2.0);
			}
			else if (axis === 'y')
			{
				ribbon1.setX(-deltaY/2.0);
				ribbon1.setY(-height/2.0);
				ribbon1.setZ(-deltaX/2.0);
			}
			else
			{
				ribbon1.setX(-deltaX/2.0);
				ribbon1.setY(-deltaY/2.0);
				ribbon1.setZ(-height/2.0);
			}

			//ribbon1.reverseNormals();
			glBuffer = glBuffer.fuse(ribbon1);
		}

		if (topClosed === true)
		{
			ribbon2.setScale(scale2);

			if (axis === 'x')
			{
				ribbon2.setX(height/2.0);
				ribbon2.setY(deltaX/2.0);
				ribbon2.setZ(deltaY/2.0);
			}
			else if (axis === 'y')
			{
				ribbon2.setX(deltaY/2.0);
				ribbon2.setY(height/2.0);
				ribbon2.setZ(deltaX/2.0);
			}
			else
			{
				ribbon2.setX(deltaX/2.0);
				ribbon2.setY(deltaY/2.0);
				ribbon2.setZ(height/2.0);
			}

			ribbon2.reverseNormals();
			glBuffer = glBuffer.fuse(ribbon2);
		}
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
	Loader.hasLoaded("gl-prism-from-curve");