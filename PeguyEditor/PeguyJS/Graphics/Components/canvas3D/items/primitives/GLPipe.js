
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2020 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLPipe($radius1, $radius2, $radius3, $radius4, $height, $angle, $deltaX, $deltaY, $thetaResolution, $heightResolution, $bottomClosed, $topClosed, $fill, $textureMode)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius1 = $radius1;
	var radius2 = $radius2;
	var radius3 = $radius3;
	var radius4 = $radius4;
	
	var innerBottomRadius = Math.min(radius1, radius2);
	var outerBottomRadius = Math.max(radius1, radius2);
	var innerTopRadius = Math.min(radius3, radius4);
	var outerTopRadius = Math.max(radius3, radius4);
	
	var height = $height;
	var angle = $angle;
	
	if (angle <= 0.0 || angle > 360.0)
		angle = 360.0;
	
	var deltaX = $deltaX;
	var deltaY = $deltaY;
	
	var thetaResolution = $thetaResolution;
	var heightResolution = $heightResolution;
	var bottomClosed = $bottomClosed;
	var topClosed = $topClosed;
	var fill = $fill;
	
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
		var cylinderData = GLData.createCylinderData(innerBottomRadius, innerTopRadius, height, angle, deltaX, deltaY, thetaResolution, heightResolution, false);

		glBuffer.setVertices(cylinderData.vertices);
		glBuffer.setNormals(cylinderData.normals);
		glBuffer.setTangentsX(cylinderData.tangentsX);
		glBuffer.setTangentsY(cylinderData.tangentsY);
		glBuffer.setTexture(cylinderData.texture);
		glBuffer.setColors(cylinderData.colors);
		glBuffer.setIndices(cylinderData.indices);

		var outerCylinder = new GLCylinder(outerBottomRadius, outerTopRadius, height, angle, deltaX, deltaY, thetaResolution, heightResolution, false, false, false, 2, textureMode);
		glBuffer = glBuffer.fuse(outerCylinder);

		if (bottomClosed === true)
		{
			var ring1 = new GLRing(innerBottomRadius, outerBottomRadius, angle, thetaResolution);
			ring1.setX(-deltaX/2.0);
			ring1.setY(-deltaY/2.0);
			ring1.setZ(-height/2.0);
			ring1.reverseNormals();
			glBuffer = glBuffer.fuse(ring1);
		}

		if (topClosed === true)
		{
			var ring2 = new GLRing(innerTopRadius, outerTopRadius, angle, thetaResolution);
			ring2.setX(deltaX/2.0);
			ring2.setY(deltaY/2.0);
			ring2.setZ(height/2.0);
			glBuffer = glBuffer.fuse(ring2);
		}

		if (fill === true)
		{
			var quad1 = new GLQuad([{x: innerBottomRadius-deltaX/2, y: -deltaY/2.0, z: -height/2.0}, 
									{x: outerBottomRadius-deltaX/2, y: -deltaY/2.0, z: -height/2.0}, 
									{x: outerTopRadius+deltaX/2, y: deltaY/2.0, z: height/2.0}, 
									{x: innerTopRadius+deltaX/2, y: deltaY/2.0, z: height/2.0}]);

			glBuffer = glBuffer.fuse(quad1);

			var radAngle = angle/180.0*Math.PI;

			var quad2 = new GLQuad([{x: innerBottomRadius*Math.cos(radAngle)-deltaX/2, y: innerBottomRadius*Math.sin(radAngle)-deltaY/2.0, z: -height/2.0}, 
									{x: outerBottomRadius*Math.cos(radAngle)-deltaX/2, y: outerBottomRadius*Math.sin(radAngle)-deltaY/2.0, z: -height/2.0}, 
									{x: outerTopRadius*Math.cos(radAngle)+deltaX/2, y: outerTopRadius*Math.sin(radAngle)+deltaY/2.0, z: height/2.0}, 
									{x: innerTopRadius*Math.cos(radAngle)+deltaX/2, y: innerTopRadius*Math.sin(radAngle)+deltaY/2.0, z: height/2.0}]);

			glBuffer = glBuffer.fuse(quad2);
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
	Loader.hasLoaded("gl-pipe");