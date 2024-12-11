
////////////////////////////////////////////////////////////////////
//// Developed by Suisei aka Killfaeh aka Amandine Hachin, 2017 ////
////                  http://suiseipark.com/                    ////
////              http://suiseipark.blogspot.fr/                ////
////                http://killfaeh.tumblr.com/                 ////
////             https://www.facebook.com/suiseipark            ////
////////////////////////////////////////////////////////////////////

function GLWorkingGrid()
{
	///////////////
	// Attributs //
	///////////////
	
	var buffer = new GLBuffer();
	//buffer.setShaderName('color3d');
	buffer.setVertexShaderName('vertex-color');
	buffer.setFragmentShaderName('fragment-color');
	
	var xWidth = 10;
	var yWidth = 10;
	var nbX = 10;
	var nbY = 10;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.init = function initialisation($context)
	{
		if (buffer.isInit() === false)
		{
			buffer.setMode($context.LINES);
			
			var vertices = [];
			var colors = [];
			var indices = [];
			
			var stepX = xWidth/nbX;
			var stepY = yWidth/nbY;
			
			for (var i = 0; i <= nbX; i++)
			{
				vertices.push(i*stepX - xWidth/2);
				vertices.push(-yWidth/2);
				vertices.push(0.0);
				
				vertices.push(i*stepX - xWidth/2);
				vertices.push(yWidth/2);
				vertices.push(0.0);

				indices.push(i*2);
				indices.push(i*2 + 1);
			}
			
			for (var i = 0; i <= nbY; i++)
			{
				vertices.push(-xWidth/2);
				vertices.push(i*stepY - yWidth/2);
				vertices.push(0.0);
				
				vertices.push(xWidth/2);
				vertices.push(i*stepY - yWidth/2);
				vertices.push(0.0);
				
				indices.push((nbX+1+i)*2);
				indices.push((nbX+1+i)*2 + 1);
			}
			
			for (var i = 0; i < vertices.length/3; i++)
			{
				colors.push(0.5);
				colors.push(0.5);
				colors.push(0.5);
				colors.push(1.0);
			}
			
			buffer.setVertices(vertices);
			buffer.setColors(colors);
			buffer.setIndices(indices);
			
			this.execSuper('init', [$context], initialisation);
		}
	}
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getXWidth = function() { return xWidth; };
	this.getYWidth = function() { return yWidth; };
	this.getNbX = function() { return nbX; };
	this.getNbY = function() { return nbY; };
	
	// SET
	
	this.setXWidth = function($xWidth)
	{
		xWidth = $xWidth;
		buffer.setInit(false);
	};
	
	this.setYWidth = function($yWidth)
	{
		yWidth = $yWidth;
		buffer.setInit(false);
	};
	
	this.setNbX = function($nbX)
	{
		nbX = $nbX;
		
		if (nbX <= 0)
			nbX = 1;
		
		buffer.setInit(false);
	};
	
	this.setNbY = function($nbY)
	{
		nbY = $nbY;
		
		if (nbY <= 0)
			nbY = 1;
		
		buffer.setInit(false);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(buffer, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gl-working-grid");