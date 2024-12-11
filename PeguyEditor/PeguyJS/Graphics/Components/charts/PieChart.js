function PieChart($data, $width, $height, $params)
{
	// Exemple de données attendues
	
	/*
	{
		name: "Bidouille",
		unit: "%",
		data: 
		[
			{ name: "Truc", value: 45 },
			{ name: "Machin", value: 25 },
			{ name: "Chouette", value: 4 },
			{ name: "Bidule", value: 10 }
		]
	}
	//*/
	
	// Exemple de paramètres optionnels
	
	// { fontSize: '5px', backgroundColor: 'rgb(250, 250, 250)' }
	
	///////////////
	// Attributs //
	///////////////
	
	var params = $params;
	
	if (!utils.isset(params))
		params = {};
	
	var fontSize = (5.0*$width/250.0) + 'px';
	
	if (utils.isset(params.fontSize))
		fontSize = params.fontSize;
	
	var displayLegend = true;
	
	if (utils.isset(params.displayLegend))
		displayLegend = params.displayLegend;
	
	// Elements affichables
	
	var svg = Chart($data, $width, $height);
	
	var defsCode = '<defs>'
					+ '</defs>';
	
	var gCode = '<g>'
					+ '<g id="caption" ></g>'
					+ '<g id="data" ></g>'
				+ '</g>';
	
	
	var defs = new Component(defsCode);
	var g = new Component(gCode);
	
	svg.appendChild(defs);
	svg.appendChild(g);
	
	// Traitement des données
	
	var total = 0;
	
	var data = svg.getData();
	
	for (var i = 0; i < data.data.length; i++)
		total = total + data.data[i].value;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.build = function()
	{
		while(g.getById('data').firstChild)
			g.getById('data').removeChild(g.getById('data').firstChild);
		
		var diameter = Math.min($width, $height)/3.0;
		var offset = -90.0;
		var captionOffset = 0.0;
		var captionColoRectWidth = $width*0.05;
		
		var backgroundColor = '#ffffff';
		
		if (utils.isset(params.backgroundColor))
			backgroundColor = params.backgroundColor;
		
		var pathList = [];
		var valueList = [];
		
		for (var i = 0; i < data.data.length; i++)
		{
			var param1 = 0;
			var param2 = 0;
			var param3 = 1;
			
			var angle = data.data[i].value/total*2.0*Math.PI;
			
			if (angle > Math.PI)
				param2 = 1;
			
			var start = { x: diameter, y: 0.0 };
			var end = { x: diameter*Math.cos(angle), y: diameter*Math.sin(angle) };
			
			var pathCode = '<path '
								+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + diameter + ' ' + diameter + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
								+ 'transform="rotate(' + (offset) + ') " '
								+ 'style="fill: ' + svg.getColors()[i] + '; stroke-width: 1px; stroke:' + backgroundColor + '; " '
							+ '/>';
			
			var path = new Component(pathCode);
			path.onToolTip = data.data[i].name;
			
			pathList.push({ angle: angle, path: path });
			
			var colorValue = 0;
			
			var colorRegex = new RegExp("^rgb\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}) ?\\)$");
			var matchColor = svg.getColors()[i].match(colorRegex);
			
			if (/#[a-fA-F0-9]{6}/.test(svg.getColors()[i]))
			{
				var rgbColor = Colors.hexToRGB(svg.getColors()[i].replace('#', ''));
				var hsvColor = Colors.rgbToHSV(rgbColor.r, rgbColor.g, rgbColor.b);
				colorValue = hsvColor.v;
			}
			else if (utils.isset(matchColor))
			{
				var hsvColor = Colors.rgbToHSV(parseInt(matchColor[2]), parseInt(matchColor[3]), parseInt(matchColor[4]));
				colorValue = hsvColor.v;
			}
			
			var percentValue = Math.round(data.data[i].value/total*100.0);
			
			if (percentValue >= 5.0)
			{
				var textStyle = ' fill:#000000; ';
				
				if (colorValue < 50)
					textStyle = ' fill:#ffffff; ';
				
				var valueCode = '<text '
									+ 'x="' + (2.0/3.0*diameter*Math.cos(offset/180.0*Math.PI + angle/2.0)) + '" y="' + (2.0/3.0*diameter*Math.sin(offset/180.0*Math.PI + angle/2.0)) + '" '
									+ 'style="font-size: ' + fontSize + '; ' + textStyle + ' text-anchor:middle; alignment-baseline: central; " '
									+ '>'
									+ percentValue + '%'
								+ '</text>';
				
				valueList.push(new Component(valueCode));
			}
			else
			{
				var x1 = 0.8*diameter*Math.cos(offset/180.0*Math.PI + angle/2.0);
				var y1 = 0.8*diameter*Math.sin(offset/180.0*Math.PI + angle/2.0);
				var x2 = 1.1*diameter*Math.cos(offset/180.0*Math.PI + angle/2.0);
				var y2 = 1.1*diameter*Math.sin(offset/180.0*Math.PI + angle/2.0);
				var x3 = x2 + 7.0*$width/250.0;
				var x4 = x3 + 2.0*$width/250.0;
				var anchor = 'start';
				
				if (offset/Math.PI*180.0 + angle/2.0 > 180.0)
				{
					x3 = x2 - 7.0*$width/250.0;
					x4 = x3 - 2.0*$width/250.0;
					anchor = 'end';
				}
				
				var lineCode = '<polyline points="' + x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y2 + '" style="stroke: #000000; stroke-width: 0.5px; fill: none; " />';
				
				//var lineCode = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="fill: none; stroke: #000000; stroke-width: 0.5px; " />';
				valueList.push(new Component(lineCode));
				
				//var lineCode2 = '<line x1="' + x2 + '" y1="' + y2 + '" x2="' + x3 + '" y2="' + y2 + '" style="fill: none; stroke: #000000; stroke-width: 0.5px; " />';
				//valueList.push(new Component(lineCode2));
				
				var valueCode = '<text '
									+ 'x="' + x4 + '" y="' + y2 + '" '
									+ 'style="font-size: ' + fontSize + '; text-anchor:' + anchor + '; alignment-baseline: central; " '
									+ '>'
									+ percentValue + '%'
								+ '</text>';
				
				valueList.push(new Component(valueCode));
			}
			
			offset = offset + angle/Math.PI*180.0;
			
			if (displayLegend === true)
			{
				var captionColoRectCode = '<rect x="0" y="' + (captionOffset - 3.5*$height/150.0) + '" width="' + captionColoRectWidth + '" height="' + 7.0*$height/150.0 + '" style="fill:' + svg.getColors()[i] + '; " />';
				g.getById('caption').appendChild(new Component(captionColoRectCode));
				
				var captionCode = '<text '
									+ 'x="' + (1.3*captionColoRectWidth) + '" y="' + (captionOffset) + '" '
									+ 'style="font-size: ' + fontSize + '; alignment-baseline: central; " '
									+ '>' 
										+ data.data[i].name
								+ '</text>';
				
				var caption = new Component(captionCode);
				g.getById('caption').appendChild(caption);
				
				var captionSize = utils.getInputTextSize(caption, { fontFamily: 'Arial', fontSize: fontSize, fontStyle: 'normal', fontWeight: 'normal' });
				
				captionOffset = captionOffset + 10.0*$height/150.0;
			}
		}
		
		for (var i = 0; i < pathList.length; i++)
		{
			for (var j = i; j < pathList.length; j++)
			{
				if (pathList[i].angle > pathList[j].angle)
				{
					var tmp = pathList[i];
					pathList[i] = pathList[j];
					pathList[j] = tmp;
				}
			}
		}
		
		for (var i = 0; i < pathList.length; i++)
			g.getById('data').appendChild(pathList[i].path);
		
		for (var i = 0; i < valueList.length; i++)
			g.getById('data').appendChild(valueList[i]);
		
		if (displayLegend === true)
		{
			if ($width > $height)
			{
				g.getById('data').setAttributeNS(null, 'transform', 'translate(' + ($height/2.0) + ',' + ($height/2.0) + ')');
				g.getById('caption').setAttributeNS(null, 'transform', 'translate(' + (3.0*diameter) + ',' + (($height-captionOffset)/2.0) + ')');
			}
			else
			{
				g.getById('data').setAttributeNS(null, 'transform', 'translate(' + ($width/2.0) + ',' + ($width/2.0) + ')');
				g.getById('caption').setAttributeNS(null, 'transform', 'translate(' + (15.0) + ',' + ($height-captionOffset) + ')');
			}
		}
		else
			g.getById('data').setAttributeNS(null, 'transform', 'translate(' + ($width/2.0) + ',' + ($height/2.0) + ')');
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	$this.build();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("pieChart");