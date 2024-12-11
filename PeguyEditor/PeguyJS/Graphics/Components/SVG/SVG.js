////////////////////
// Constantes SVG //
////////////////////

var SVGTAGS = ['svg', 
				// Filtres et styles
				'defs', 'marker', 'pattern', 'stop', 'linearGradient', 'radialGradient', 'clipPath', 'mask', 
				'filter', 'feFlood', 'feImage', 'feTile', 'feOffset', 'feMerge', 'feMergeNode', 'feGaussianBlur', 'feMorphology', 'feConvolveMatrix', 
				'feColorMatrix', 'feComponentTransfer', 'feFuncR', 'feFuncG', 'feFuncB', 'feTurbulence', 'feBlend', 'feFlood', 'feComposite', 'symbol', 
				// Formes
				'g', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'path', 'text', 'tspan', 'textPath', 'image', 'use', 'animate', 'animateColor', 'set', 'animateTransform', 'animateMotion', 
				// Autres
				'switch', 'foreignObject' ];

var SVGNS = "http://www.w3.org/2000/svg";
var NB_SVG_GRADIENTS = 0;

////////////////
// Classe SVG //
////////////////

function SVG($width, $height, $code, $style)
{
	///////////////
	// Attributs //
	///////////////
	
	var width = $width;
	var height = $height;
	var code = $code;
	var style = $style;
	
	if (!utils.isset(code))
		code = '';
	
	if (!utils.isset(style))
		style = 'fill-rule:evenodd; clip-rule:evenodd; stroke-linejoin:round; stroke-miterlimit:2;';
	
	var svg = new Component('<svg xmlns="' + SVGNS + '" viewBox="0 0 ' + width + ' ' + height + '" style="' + style + '" >' + code + '</svg>');
	
	//////////////
	// Méthodes //
	//////////////
	
    // /!\ Le SVG doit absolument avoir été affiché dans le flux HTML pour que ça fonctionne /!\
	this.toImage = function($callback)
	{
		//var svgURL = new XMLSerializer().serializeToString(svg);
		//var data = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
		
		var img = new Image();
		img.width = width;
		img.height = height;
		
		/*
		// Débugage
		img.style.position = "absolute";
		//img.style.left = (-10*width) + "px";
		//img.style.top = (-10*height) + "px";
		img.style.zIndex = "100000000000000000000";
		document.getElementById('screen').appendChild(img);
		//*/
		
		img.onload = function()
		{
			console.log("Data URL to Img, finished.");
			$callback(img);
		};
		
		var dataURL = $this.getSvgUrl();

		var parserErrorList = $this.getElementsByTagName('parsererror');

		for (var i = 0; i < parserErrorList.length; i++)
		{
			if (utils.isset(parserErrorList[i].parentNode))
				parserErrorList[i].parentNode.removeChild(parserErrorList[i]);
		}
		
		//console.log("Data URL : " + dataURL);
		
		//img.src = dataURL.replaceAll(/<parsererror.*<\/parsererror>/, '');
		img.src = dataURL;
		
		console.log("Data URL to Img...");
		
		return img;
	};
	
	this.toBitmap = function($callback, $type, $option)
	{
		console.log("SVG to Bitmap...");
		
		var type = $type;
		var option = $option;
		
		if (!utils.isset(type))
			type = 'image/jpeg';
		
		if (!utils.isset(option))
			option = 1.0;
		
		svg.setAttribute('width', width);
		svg.setAttribute('height', height);
		
		var tmpCanvas = new Canvas2D();
		
		var img = new Image();
		img.width = width;
		img.height = height;
		
		img.onload = function()
		{
			document.getElementById('screen').removeChild(tmpCanvas);
			svg.removeAttribute('width');
			svg.removeAttribute('height');
			console.log("Canvas to Img, finished.");
			$callback(img);
		};
		
		$this.toImage(function($img)
		{
			console.log("Canvas to Img...");
			
			tmpCanvas.style.position = "absolute";
			//tmpCanvas.style.left = (-10*width) + "px";
			//tmpCanvas.style.top = (-10*height) + "px";
			tmpCanvas.style.zIndex = "1000000000000000000000";
			
			document.getElementById('screen').appendChild(tmpCanvas);
			
			tmpCanvas.setWidth(width);
			tmpCanvas.setHeight(height);
			tmpCanvas.getContext().drawImage($img, 0, 0, width, height);

			console.log(tmpCanvas);
			
			var imgData = tmpCanvas.toDataURL(type, option);
			img.src = imgData;

			tmpCanvas.style.left = (-10*width) + "px";
			tmpCanvas.style.top = (-10*height) + "px";
		});
		
		return img;
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	
	this.getSvgUrl = function()
	{
		//console.log("SVG code : " + $this.toCode());
		
		var svgURL = new XMLSerializer().serializeToString(svg);
		var data = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
		
		console.log("SVG to data URL");
		
		return data;
	};
	
	// SET
	
	this.setWidth = function($width)
	{
		width = $width;
		svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
		//svg.setAttribute('width', width);
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
		//svg.setAttribute('height', height);
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("svg");