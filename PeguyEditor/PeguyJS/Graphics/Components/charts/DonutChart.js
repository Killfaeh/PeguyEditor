function DonutChart($data, $width, $height, $params)
{
	// Exemple de données attendues
	
	/*
	{
		name: "Chose",
		unit: "%",
		data: 
		[
			{ name: "Machin", value: 90 },
			{ name: "Chouette", value: 10 }
		]
	}
	//*/
	
	// Exemple de paramètres optionnels
	
	// { displayLegend: false, thickness: 15, backgroundColor: 'rgb(250, 250, 250)' }
	
	///////////////
	// Attributs //
	///////////////
	
	var params = $params;
	
	if (!utils.isset(params))
		params = {};
		
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
		
		var innerRadius = diameter - 5.0;
		var outerRadius = diameter + 5.0;
		
		if (utils.isset(params.thickness))
		{
			innerRadius = diameter - params.thickness/2.0;
			outerRadius = diameter + params.thickness/2.0;
		}
		
		var backgroundColor = '#ffffff';
		
		if (utils.isset(params.backgroundColor))
			backgroundColor = params.backgroundColor;
		
		var pathList = [];
		
		for (var i = 0; i < data.data.length; i++)
		{
			var param1 = 0;
			var param2 = 0;
			var param3 = 1;
			
			var angle = data.data[i].value/total*2.0*Math.PI;
			
			if (angle > Math.PI)
				param2 = 1;
			
			var start = { x: outerRadius, y: 0.0 };
			var end = { x: outerRadius*Math.cos(angle), y: outerRadius*Math.sin(angle) };
			
			var pathCode = '<path '
								+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
								+ 'transform="rotate(' + (offset) + ')" '
								+ 'style="fill: ' + svg.getColors()[i] + '; stroke-width: 1px; stroke:' + backgroundColor + ';" '
							+ '/>';
			
			var path = new Component(pathCode);
			path.onToolTip = data.data[i].name;
			
			pathList.push({ angle: angle, path: path });
			
			offset = offset + angle/Math.PI*180.0;
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
		
		var codeDisc = '<circle cx="0" cy="0" r="' + innerRadius + '" style="fill:' + backgroundColor + '; " />';
		g.getById('data').appendChild(new Component(codeDisc));
		
		var centralDataCode = '<text x="0" y="0" style="font-size: ' + 14.0*Math.min($width, $height)/100.0 + 'px; text-anchor:middle; alignment-baseline: central; font-weight: bold;" >'
								+ total + ' ' + data.unit
								+ '</text>';
		
		g.getById('data').appendChild(new Component(centralDataCode));
		
		if (displayLegend === true)
		{
			
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
	Loader.hasLoaded("donutChart");