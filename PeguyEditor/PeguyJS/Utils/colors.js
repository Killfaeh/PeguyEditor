
var Colors = 
{
	// Liste des couleurs avec un nom
	named:
	{
		// Couleurs basiques
		
		"black": "000000",
		"gray": "808080",
		"white": "ffffff",
		"red": "ff0000",
		"yellow": "ffff00",
		"lime": "00ff00",
		"cyan": "00ffff",
		"blue": "0000ff",
		"magenta": "ff00ff",
		
		// Liste des rouges
		
		"lightsalmon": "ffa07a",
		"salmon": "fa8072",
		"darksalmon": "e9967a",
		"lightcoral": "f08080",
		"indianred": "cd5c5c",
		"crimson": "dc143c",
		"firebrick": "b22222",
		"darkred": "8b0000",
		
		// Liste des roses
		
		"pink": "ffc0cb",
		"lightpink": "ffb6c1",
		"hotpink": "ff69b4",
		"deeppink": "ff1493",
		"palevioletred": "db7093",
		"mediumvioletred": "c71585",
		
		// Liste des oranges
		
		"orangered": "ff4500",
		"tomato": "ff6347",
		"coral": "ff7f50",
		"darkorange": "ff8c00",
		"orange": "ffa500",
		"lightyellow": "ffffe0",
		
		// Liste des jaunes
		
		"lemonchiffon": "fffacd",
		"lightgoldenrodyellow": "fafad2",
		"papayawhip": "ffefd5",
		"moccasin": "ffe4b5",
		"peachpuff": "ffdab9",
		"palegoldenrod": "eee8aa",
		"khaki": "f0e68c",
		"darkkhaki": "bdb76b",
		"gold": "ffd700",
		
		// Liste des violets
		
		"lavender": "e6e6fa",
		"thistle": "d8bfd8",
		"plum": "dda0dd",
		"violet": "ee82ee",
		"orchid": "da70d6",
		"fuchsia": "ff00ff",
		"mediumorchid": "ba55d3",
		"mediumpurple": "9370db",
		"blueviolet": "8a2be2",
		"darkviolet": "9400d3",
		"darkorchid": "9932cc",
		"darkmagenta": "8b008b",
		"purple": "800080",
		"indigo": "4b0082",
		"darkslateblue": "483d8b",
		"slateblue": "6a5acd",
		"mediumslateblue": "7b68ee",
		"rebeccapurple": "663399",
		
		// Liste des verts
		
		"darkolivegreen": "556b2f",
		"olive": "808000",
		"olivedrab": "6b8e23",
		"yellowgreen": "9acd32",
		"limegreen": "32cd32",
		"lawngreen": "7cfc00",
		"chartreuse": "7fff00",
		"greenyellow": "adff2f",
		"springgreen": "00ff7f",
		"mediumspringgreen": "00fa9a",
		"lightgreen": "90ee90",
		"palegreen": "98fb98",
		"darkseagreen": "8fbc8f",
		"mediumaquamarine": "66cdaa",
		"mediumseagreen": "3cb371",
		"seagreen": "2e8b57",
		"forestgreen": "228b22",
		"green": "008000",
		"darkgreen": "006400",
		
		// Liste des cyans
		
		"aqua": "00ffff",
		"lightcyan": "e0ffff",
		"paleturquoise": "afeeee",
		"aquamarine": "7fffd4",
		"turquoise": "40e0d0",
		"mediumturquoise": "48d1cc",
		"darkturquoise": "00ced1",
		"lightseagreen": "20b2aa",
		"cadetblue": "5f9ea0",
		"darkcyan": "008b8b",
		"teal": "008080",
		
		// Liste des bleus
		
		"lightsteelblue": "b0c4de",
		"powderblue": "b0e0e6",
		"lightblue": "add8e6",
		"skyblue": "87ceeb",
		"lightskyblue": "87cefa",
		"deepskyblue": "00bfff",
		"dodgerblue": "1e90ff",
		"cornflowerblue": "6495ed",
		"steelblue": "4682b4",
		"royalblue": "4169e1",
		"mediumblue": "0000cd",
		"darkblue": "00008b",
		"navy": "000080",
		"midnightblue": "191970",
		
		// Liste des marrons
		
		"cornsilk": "fff8dc",
		"blanchedalmond": "ffebcd",
		"navajowhite": "ffdead",
		"wheat": "f5deb3",
		"burlywood": "deb887",
		"bisque": "ffe4c4",
		"tan": "d2b48c",
		"rosybrown": "bc8f8f",
		"sandybrown": "f4a460",
		"goldenrod": "daa520",
		"darkgoldenrod": "b8860b",
		"peru": "cd853f",
		"chocolate": "d2691e",
		"saddlebrown": "8b4513",
		"sienna": "a0522d",
		"brown": "a52a2a",
		"maroon": "800000",
		
		// Liste des blancs
		
		"snow": "fffafa",
		"honeydew": "f0fff0",
		"mintcream": "f5fffa",
		"azure": "f0ffff",
		"aliceblue": "f0f8ff",
		"ghostwhite": "f8f8ff",
		"whitesmoke": "f5f5f5",
		"seashell": "fff5ee",
		"beige": "f5f5dc",
		"oldlace": "fdf5e6",
		"floralwhite": "fffaf0",
		"ivory": "fffff0",
		"antiquewhite": "faebd7",
		"linen": "faf0e6",
		"lavenderblush": "fff0f5",
		"mistyrose": "ffe4e1",
		
		// Liste des gris
		
		"gainsboro": "dcdcdc",
		"lightgray": "d3d3d3",
		"silver": "c0c0c0",
		"darkgray": "a9a9a9",
		"dimgray": "696969",
		"lightslategray": "778899",
		"slategray": "708090",
		"darkslategray": "2f4f4f"
	},

	// Convertir la valeur de teinte en rgb pour saturation = 100 et valeur = 100
	hueToRGB: function($hue)
	{
		var r = 1.0;
		var g = 0.0;
		var b = 0.0;
		
		var h = $hue/360.0;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = 0;
		var q = 1 - f;
		var t = f;
		
		switch(i % 6)
		{
			case 0: r = 1.0, g = t, b = p; break;
			case 1: r = q, g = 1.0, b = p; break;
			case 2: r = p, g = 1.0, b = t; break;
			case 3: r = p, g = q, b = 1.0; break;
			case 4: r = t, g = p, b = 1.0; break;
			case 5: r = 1.0, g = p, b = q; break;
		}
		
		var rgb =
		{
			r: Math.round(255.0*r),
			g: Math.round(255.0*g),
			b: Math.round(255.0*b)
		};
		
		return rgb;
	},
	
	// Convertir le HSV en RGB
	hsvToRGB: function($h, $s, $v)
	{
		var r = 1.0;
		var g = 0.0;
		var b = 0.0;
		
		var h = $h/360.0;
		var s = $s/100.0;
		var v = $v/100.0;
		
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		
		switch(i % 6)
		{
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		
		var rgb =
		{
			r: Math.round(255.0*r),
			g: Math.round(255.0*g),
			b: Math.round(255.0*b)
		};
		
		return rgb;
	},
	
	// Convertir le RGB en HSV
	rgbToHSV: function($red, $green, $blue)
	{
		var hsv = { h: 0.0, s: 100.0, v: 100.0 };
		
		var r = parseInt($red);
		var g = parseInt($green);
		var b = parseInt($blue);
		
		var min = 255;
		var max = 0;
		
		if (r < min)
			min = r;
		if (g < min)
			min = g;
		if (b < min)
			min = b;
		
		if (r > max)
			max = r;
		if (g > max)
			max = g;
		if (b > max)
			max = b;
		
		var c = max-min;
		var v = max;
		var s = 0;
		
		if (v !== 0)
			s = c/v;
		
		hsv.s = Math.round(s*100.0);
		hsv.v = Math.round(v/255.0*100.0);
		
		var h = 0.0;
		
		if (c !== 0.0)
		{
			if (r === max)
				h = (g-b)/c * 60.0;
			else if (g === max)
				h = ((b-r)/c + 2.0) * 60.0;
			else if (b === max)
				h = ((r-g)/c + 4.0) * 60.0;
			
			if (h < 0.0)
				h = h + 360.0;
			
			//console.log("Hue : " + h);
		}
		
		hsv.h = Math.round(h);
		
		return hsv;
	},

	// Convertir une valeur R, G ou B en hexadécimales
	decToHex: function($n)
	{
		var hex = parseInt($n).toString(16);
  		return hex.length == 1 ? "0" + hex : hex;
	}, 
	
	// Convertir le RGB en Hex
	rgbToHex: function($r, $g, $b)
	{
		var hexCode = Colors.decToHex($r) + Colors.decToHex($g) + Colors.decToHex($b);
		return hexCode;
	},
	
	// Convertir le Hex en RGB
	hexToRGB: function($hex)
	{
		var hexRegex = /^([a-fA-F\d])([a-fA-F\d])([a-fA-F\d])$/i;
		
		var hex = $hex.replace('#', '').replace(hexRegex, function(m, r, g, b)
		{
			return r + r + g + g + b + b;
		});
		
		var result = /^([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
		
		var rgb = result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 0, b: 255 };
		
		return rgb;
	},
	
	// Convertir chaîne de caractères en rgb
	strToRGB: function($str)
	{
		var output = { r: 0, g: 0, b: 0 };
		
		$str = $str.replaceAll(' ', '');
		$str = $str.replace('#', '');
		
		var colorRgbRegex = new RegExp("^rgb\\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\\)$");
		var matchColorRGB = $str.match(colorRgbRegex);
		
		if (/^[a-fA-F\d]{2}[a-fA-F\d]{2}[a-fA-F\d]{2}$/.test($str))
			output = Colors.hexToRGB();
		else if (utils.isset(matchColorRGB))
			output = { r: parseInt(matchColorRGB[1]), g: parseInt(matchColorRGB[2]), b: parseInt(matchColorRGB[3]) };
		
		return output;
	},
	
	filterRGB: function($red, $green, $blue, $colorsList)
	{
		var inColorsList = false;
		
		if (utils.isset($colorsList) && $colorsList.length > 0)
		{
			var color = 'rgb(' + $red + ',' + $green + ',' + $blue + ')';
			
			if ($colorsList.indexOf(color) >= 0)
				inColorsList = true;
			
			if (inColorsList === false)
			{
				var hex = '#' + Colors.rgbToHex($red, $green, $blue);
				
				if ($colorsList.indexOf(hex) >= 0)
					inColorsList = true;
			}
		}
		else
			inColorsList = true;
		
		return inColorsList;
	},
	
	filterHex: function($color, $colorsList)
	{
		var inColorsList = false;
		
		if (utils.isset($colorsList) && $colorsList.length > 0)
		{
			if ($colorsList.indexOf($color) >= 0)
				inColorsList = true;
			
			if (inColorsList === false)
			{
				var rgb = Colors.hexToRGB($color);
				var colorRGB = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
				
				if ($colorsList.indexOf(colorRGB) >= 0)
					inColorsList = true;
			}
		}
		else
			inColorsList = true;
		
		return inColorsList;
	}, 
	
	compare: function($color1, $color2)
	{
		var equal = false;
		
		var color1 = $color1.replace(/ /gi, '');
		
		if (!/rgb/.test(color1))
		{
			var rgb1 = Colors.hexToRGB(color1);
			color1 = 'rgb(' + rgb1.r + ',' + rgb1.g + ',' + rgb1.b + ')';
		}
		
		var color2 = $color2.replace(/ /gi, '');
		
		if (!/rgb/.test(color2))
		{
			var rgb2 = Colors.hexToRGB(color2);
			color2 = 'rgb(' + rgb2.r + ',' + rgb2.g + ',' + rgb2.b + ')';
		}
		
		if (color1 === color2)
			equal = true;
		
		return equal;
	}
};

var rgb = function($r, $g, $b) { return "rgb(" + $r + ", " + $g + ", " + $b + ")"; };
var rgba = function($r, $g, $b, $a) { return "rgba(" + $r + ", " + $g + ", " + $b + ", " + $a + ")"; };

/*
var gCouleursNoms = ["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange","aliceblue","antiquewhite","aquamarine","azure","beige","bisque","blanchedalmond","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan (synonyme de aqua)","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","gainsboro","ghostwhite","gold","goldenrod","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","limegreen","linen","magenta (synonyme de fuchsia)","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellowgreen","rebeccapurple"];
var gCouleursCodes = ["000000","c0c0c0","808080","ffffff","800000","ff0000","800080","ff00ff","008000","00ff00","808000","ffff00","000080","0000ff","008080","00ffff","ffa500","f0f8ff","faebd7","7fffd4","f0ffff","f5f5dc","ffe4c4","ffebcd","8a2be2","a52a2a","deb887","5f9ea0","7fff00","d2691e","ff7f50","6495ed","fff8dc","dc143c","00ffff","00008b","008b8b","b8860b","a9a9a9","006400","a9a9a9","bdb76b","8b008b","556b2f","ff8c00","9932cc","8b0000","e9967a","8fbc8f","483d8b","2f4f4f","2f4f4f","00ced1","9400d3","ff1493","00bfff","696969","696969","1e90ff","b22222","fffaf0","228b22","dcdcdc","f8f8ff","ffd700","daa520","adff2f","808080","f0fff0","ff69b4","cd5c5c","4b0082","fffff0","f0e68c","e6e6fa","fff0f5","7cfc00","fffacd","add8e6","f08080","e0ffff","fafad2","d3d3d3","90ee90","d3d3d3","ffb6c1","ffa07a","20b2aa","87cefa","778899","778899","b0c4de","ffffe0","32cd32","faf0e6","ff00ff","66cdaa","0000cd","ba55d3","9370db","3cb371","7b68ee","00fa9a","48d1cc","c71585","191970","f5fffa","ffe4e1","ffe4b5","ffdead","fdf5e6","6b8e23","ff4500","da70d6","eee8aa","98fb98","afeeee","db7093","ffefd5","ffdab9","cd853f","ffc0cb","dda0dd","b0e0e6","bc8f8f","4169e1","8b4513","fa8072","f4a460","2e8b57","fff5ee","a0522d","87ceeb","6a5acd","708090","708090","fffafa","00ff7f","4682b4","d2b48c","d8bfd8","ff6347","40e0d0","ee82ee","f5deb3","f5f5f5","9acd32","663399"];

strColorsArray = "";

for (var i = 0; i < gCouleursNoms.length; i++)
	strColorsArray = strColorsArray + '"' + gCouleursNoms[i] + '": "' + gCouleursCodes[i] + '",\n';
	//strColorsArray = strColorsArray + 'KEYWORDS.' + gCouleursNoms[i] + ' = "' + gCouleursNoms[i] + '";\n';
	

strColorsArray = strColorsArray + '}';

console.log(strColorsArray);
//*/

function ColorRamp($colorsList, $length)
{
	///////////////
	// Attributs //
	///////////////
	
	// Définition d'une couleur
	// { offset: 0, color: rgb(255, 0, 0), opacity: 0.5 }
	
	var colorsList = $colorsList;
	var length = $length;
	
	if (!utils.isset(length) || length <= 0)
		length = 1000;
	
	var canvas = new Canvas2D(length, 1);
	
	canvas.style.position = "absolute";
	canvas.style.left = (-100*length) + "px";
	canvas.style.top = "100px";
	document.getElementById('main').appendChild(canvas);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.render = function()
	{
		var context = canvas.getContext();
		
		var linearGradient = context.createLinearGradient(0, 0, length, 0);
		
		for (var i = 0; i < colorsList.length; i++)
			linearGradient.addColorStop(colorsList[i].offset/100.0, colorsList[i].color);
		
		context.fillStyle = linearGradient;
		context.fillRect(0, 0, length, 1);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getColorAt = function($position)
	{
		var realPosition = $position/100.0 * length;
		
		if (realPosition < 0)
			realPosition = 0;
		else if (realPosition >= length)
			realPosition = length-1.0;
		
		var imageData = canvas.getData(realPosition, 0, 1, 1);
		var data = imageData.data;
		
		var red = data[0];
		var green = data[1];
		var blue = data[2];
		
		return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
	};
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(canvas, this);
	$this.render();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("colors");