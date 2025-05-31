
function Canvas2D($width, $height)
{
	///////////////
	// Attributs //
	///////////////
	
	var width = $width;
	var height = $height;
	
	var canvas = new Component('<canvas></canvas>');
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	
	var context = canvas.getContext('2d');
	
	var objectsList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	// Peut être surchargée mais pas forcément
	
	this.render = function()
	{
		// Effacer l'écran
		context.clearRect(0, 0, width, height);
		
		// Afficher les objets
		for (var i = 0; i < objectsList.length; i++)
			objectsList[i].render(context);
	};

	// Convert to SVG
	// Create from SVG
	
	this.addObject = function($object)
	{
		var index = objectsList.indexOf($object);
		
		if (index < 0)
			objectsList.push($object);
	};
	
	this.insertObjectInto = function($object, $index)
	{
		var index = objectsList.indexOf($object);
		
		if (index >= 0)
			objectsList.splice(index, 1);
		
		objectsList.splice($index, 0, $object);
	};
	
	this.removeObject = function($element)
	{
		var index = elementsList.indexOf($object);
		
		if (index >= 0)
			objectsList.splice(index, 1);
	};
	
	this.removeAllObjects = function() { objectsList = []; };
	
	/////////////
	// Filtres //
	/////////////
	
	this.greyscale = function($x , $y, $width, $height)
	{
		var imageData = context.getImageData($x , $y, $width, $height);
		var data = imageData.data;
		
		for (var i = 0; i < data.length; i += 4)
		{
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			
			// CIE luminance for the RGB
			// The human eye is bad at seeing red and blue, so we de-emphasize them.
			var value = 0.2126*red + 0.7152*green + 0.0722*blue;
			value = Math.floor((red + green + blue)/3);
			
			data[i] = value;
			data[i+1] = value;
			data[i+2] = value;
		}
		
		context.putImageData(imageData, $x, $y);
	};
	
	this.brightness = function($x , $y, $width, $height, $brightness)
	{
		if ($brightness < -100)
			$brightness = -100;
		else if ($brightness > 100)
			$brightness = 100;
		
		var brightness256 = $brightness/100*256;
		
		var imageData = context.getImageData($x , $y, $width, $height);
		var data = imageData.data;
		
		for (var i = 0; i < data.length; i += 4)
		{
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			
			data[i] = red + brightness256;
			data[i+1] = green + brightness256;
			data[i+2] = blue + brightness256;
		}
		
		for (var i = 0; i < data.length; i++)
		{
			if (data[i] < 0)
				data[i] = 0;
			else if (data[i] > 255)
				data[i] = 255;
		}
		
		context.putImageData(imageData, $x, $y);
	};
	
	this.contrast = function($x , $y, $width, $height, $contrast)
	{
		if ($contrast < -100)
			$contrast = -100;
		else if ($contrast > 100)
			$contrast = 100;
		
		var contrast256 = $contrast/200*256;
		
		var factor = (259 * (contrast256 + 255)) / (255 * (259 - contrast256));
		
		var imageData = context.getImageData($x , $y, $width, $height);
		var data = imageData.data;
		
		for (var i = 0; i < data.length; i += 4)
		{
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			
			data[i] = Math.floor(factor * (red-128) + 128);
			data[i+1] = Math.floor(factor * (green-128) + 128);
			data[i+2] = Math.floor(factor * (blue-128) + 128);
		}
		
		context.putImageData(imageData, $x, $y);
	};
	
	this.convolute = function($x , $y, $width, $height, $matrix, $opaque)
	{
		var side = Math.round(Math.sqrt($matrix.length));
		var halfSide = Math.floor(side/2);
		
		var imageData = context.getImageData($x , $y, $width, $height);
		var data = imageData.data;
		
		var sourceWidth = imageData.width;
		var sourceHeight = imageData.height;
		
		var w = sourceWidth;
		var h = sourceHeight;
		
		var output = context.createImageData(w,h);
		var destination = output.data;
		
		var alphaFac = $opaque ? 1 : 0;
		
		for (var y = 0; y < h; y++)
		{
			for (var x = 0; x < w; x++)
			{
				var sY = y;
				var sX = x;
				var dstOff = (y*w + x)*4;
				
				var red = 0;
				var green = 0;
				var blue = 0;
				var alpha = 0;
				
				for (var cY = 0; cY < side; cY++)
				{
					for (var cX = 0; cX < side; cX++)
					{
						var scY = sY + cY - halfSide;
						var scX = sX + cX - halfSide;
						
						if (scY >= 0 && scY < sourceHeight && scX >= 0 && scX < sourceWidth)
						{
							var srcOff = (scY*sourceWidth + scX)*4;
							var wt = $matrix[cY*side + cX];
							
							red += data[srcOff] * wt;
							green += data[srcOff+1] * wt;
							blue += data[srcOff+2] * wt;
							alpha += data[srcOff+3] * wt;
						}
					}
					
					
				}
				
				destination[dstOff] = red;
				destination[dstOff+1] = green;
				destination[dstOff+2] = blue;
				destination[dstOff+3] = alpha + alphaFac*(255-alpha);
			}
		}
		
		context.putImageData(output, $x, $y);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getContext = function() { return context; };
	this.getData = function($x, $y, $width, $height) { return context.getImageData($x , $y, $width, $height); };
	
	// SET
	
	this.setWidth = function($width)
	{
		width = $width;
		canvas.setAttribute('width', width);
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		canvas.setAttribute('height', height);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(canvas, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("canvas2D");