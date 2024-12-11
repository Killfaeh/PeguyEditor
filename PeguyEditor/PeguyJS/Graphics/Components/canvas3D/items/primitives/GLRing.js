
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2021 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLRing($radius1, $radius2, $angle, $resolution)
{
	///////////////
	// Attributs //
	///////////////
	
	var glBuffer = new GLBuffer();
	
	var radius1 = $radius1;
	var radius2 = $radius2;	
	var angle = $angle;
	
	if (angle <= 0.0 || angle > 360.0)
		angle = 360.0;
	
	var resolution = $resolution;
	
	//////////////
	// Méthodes //
	//////////////

	var init = function()
	{
		var ringData = GLData.createRingData(radius1, radius2, angle, resolution);

		glBuffer.setVertices(ringData.vertices);
		glBuffer.setNormals(ringData.normals);
		glBuffer.setTangentsX(ringData.tangentsX);
		glBuffer.setTangentsY(ringData.tangentsY);
		glBuffer.setTexture(ringData.texture);
		glBuffer.setColors(ringData.colors);
		glBuffer.setIndices(ringData.indices);
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
	Loader.hasLoaded("gl-ring");