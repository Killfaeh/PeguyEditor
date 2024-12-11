function GaugeChart($data, $width, $height, $params)
{
	// Exemple de données attendues
	
	/*
	{
		name: "Chose",
		max: 100,
		value: 120
	}
	//*/
	
	// Exemple de paramètres optionnels
	
	// { fillColor: "rgb()", fullColor: "rgb()", saturationColor: "rgb()" }
	
	///////////////
	// Attributs //
	///////////////
	
	var params = $params;
	
	if (!utils.isset(params))
		params = {};
		
	var fillColor = 'rgb(90, 198, 136)';
	
	if (utils.isset(params.fillColor))
		fillColor = params.fillColor;
	
	var fullColor = 'rgb(209, 36, 46)';
	
	if (utils.isset(params.fullColor))
		fullColor = params.fullColor;
	
	var saturationColor = 'rgb(59, 60, 104)';
	
	if (utils.isset(params.saturationColor))
		saturationColor = params.saturationColor;
		
	var colorRamp = null;
	
	if (utils.isset(params.colorRamp))
		colorRamp = new ColorRamp(params.colorRamp, 100);
	
	if (utils.isset(colorRamp))
		fullColor = colorRamp.getColorAt(100.0);
	
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
	
	var data = svg.getData();
	
	// Animation
	
	var animationTimer = null;
	var animationSpeed = 0;
	var currentAngle = 0.0;
	var mainCircle = null;
	var mainCircleBis = null;
	var secondaryCircle = null;
	var secondaryCircleBis = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.animate = function()
	{
		var diameter = Math.min($width, $height)/3.0;
		var outerRadius = diameter + 5.0;
		
		if (utils.isset(params.thickness))
			outerRadius = diameter + params.thickness/2.0;
		
		var max = data.max;
		var value = data.value;
		var entireAngle = value/max*2.0*Math.PI;
		
		currentAngle = currentAngle + animationSpeed;
		
		if (currentAngle > entireAngle)
		{
			currentAngle = entireAngle;
			clearTimeout(animationTimer);
			animationTimer = null;
			animationSpeed = 0.0;
		}
		
		var start = { x: outerRadius, y: 0.0 };
		var end = { x: outerRadius*Math.cos(currentAngle), y: outerRadius*Math.sin(currentAngle) };
		
		if (currentAngle > 0.0)
		{
			if (currentAngle >= 2.0*Math.PI)
			{
				end = { x: outerRadius*Math.cos(2.0*Math.PI*0.9999), y: outerRadius*Math.sin(2.0*Math.PI*0.9999) };
				mainCircleBis.setAttributeNS(null, "d", 'M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' 0 1 1 ' + end.x + ',' + end.y + ' Z');
				mainCircle.setAttributeNS(null, "d", 'M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' 0 1 1 ' + end.x + ',' + end.y + ' Z');
				
				if (utils.isset(secondaryCircle))
				{
					secondaryCircleBis.style.display = 'inline';
					secondaryCircle.style.display = 'inline';
					var secondaryAngle = currentAngle - 2.0*Math.PI;
					start = { x: outerRadius*Math.cos(-0.02), y: outerRadius*Math.sin(-0.02) };
					end = { x: outerRadius*Math.cos(secondaryAngle), y: outerRadius*Math.sin(secondaryAngle) };
					
					var param1 = 0;
					var param2 = 0;
					var param3 = 1;
					
					if (secondaryAngle > Math.PI)
						param2 = 1;
					
					secondaryCircleBis.setAttributeNS(null, "d", 'M ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' L 0.0,0.0');
					secondaryCircle.setAttributeNS(null, "d", 'M ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' L 0.0,0.0');
					
					mainCircle.setAttributeNS(null, 'style', 'fill: ' + colorRamp.getColorAt(100.0) + '; ');
				}
			}
			else
			{
				if (utils.isset(secondaryCircle))
				{
					secondaryCircleBis.style.display = 'none';
					secondaryCircle.style.display = 'none';
				}
				
				var param1 = 0;
				var param2 = 0;
				var param3 = 1;
				
				if (currentAngle > Math.PI)
					param2 = 1;
				
				mainCircleBis.setAttributeNS(null, "d", 'M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z');
				mainCircle.setAttributeNS(null, "d", 'M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z');
				
				if (utils.isset(colorRamp))
					mainCircle.setAttributeNS(null, 'style', 'fill: ' + colorRamp.getColorAt(Math.round(currentAngle/(2.0*Math.PI)*100.0)) + '; ');
			}
		}
	};
	
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
		
		var emptyColor = 'rgb(200, 200, 200)';
		
		if (utils.isset(params.emptyColor))
			emptyColor = params.emptyColor;
		
		var max = data.max;
		var value = data.value;
		
		if (value < 1.95*max)
		{
			var codeDisc = '<circle cx="0" cy="0" r="' + outerRadius + '" style="fill:' + emptyColor + '; " />';
			g.getById('data').appendChild(new Component(codeDisc));
			
			if (value > 0.0)
			{
				// Si la jauge est à 100%
				if (value === max)
				{
					var start = { x: outerRadius, y: 0.0 };
					var end = { x: outerRadius*Math.cos(2.0*Math.PI*0.9999), y: outerRadius*Math.sin(2.0*Math.PI*0.9999) };
					
					var param1 = 0;
					var param2 = 1;
					var param3 = 1;
					
					//var codeDisc = '<circle cx="0" cy="0" r="' + outerRadius + '" style="fill:' + fullColor + '; stroke-width: 1px; stroke:' + backgroundColor + ';" />';
					
					var codeDiscBis = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + backgroundColor + '; stroke-width: 2px; stroke:' + backgroundColor + ';" '
									+ '/>';
					
					mainCircleBis = new Component(codeDiscBis);
					g.getById('data').appendChild(mainCircleBis);
					
					var codeDisc = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + fullColor + '; " '
									+ '/>';
					
					mainCircle = new Component(codeDisc);
					g.getById('data').appendChild(mainCircle);
				}
				// Si la jauge dépasse les 100%
				else if (value > max)
				{
					var start = { x: outerRadius, y: 0.0 };
					var end = { x: outerRadius*Math.cos(2.0*Math.PI*0.9999), y: outerRadius*Math.sin(2.0*Math.PI*0.9999) };
					
					var param1 = 0;
					var param2 = 1;
					var param3 = 1;
					
					//var codeDisc = '<circle cx="0" cy="0" r="' + outerRadius + '" style="fill:' + fullColor + '; stroke-width: 1px; stroke:' + backgroundColor + ';" />';
					
					var codeDiscBis = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + backgroundColor + '; stroke-width: 2px; stroke:' + backgroundColor + ';" '
									+ '/>';
					
					mainCircleBis = new Component(codeDiscBis);
					g.getById('data').appendChild(mainCircleBis);
					
					var codeDisc = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + fullColor + '; " '
									+ '/>';
					
					mainCircle = new Component(codeDisc);
					g.getById('data').appendChild(mainCircle);
					
					var angle = (value-max)/max*2.0*Math.PI;
					
					param2 = 0;
					
					if (angle > Math.PI)
						param2 = 1;
					
					start = { x: outerRadius, y: 0.0 };
					end = { x: outerRadius*Math.cos(angle), y: outerRadius*Math.sin(angle) };
					
					var pathCodeBis = '<path '
										+ 'd="M ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' L 0.0,0.0" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + backgroundColor + '; stroke-width: 2px; stroke:' + backgroundColor + ';" '
									+ '/>';
					
					secondaryCircleBis = new Component(pathCodeBis);
					g.getById('data').appendChild(secondaryCircleBis);
					
					var pathCode = '<path '
										+ 'd="M ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' L 0.0,0.0" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + saturationColor + '; " '
									+ '/>';
					
					secondaryCircle = new Component(pathCode);
					g.getById('data').appendChild(secondaryCircle);
				}
				// Si la jauge est inférieure à 100%
				else
				{
					var param1 = 0;
					var param2 = 0;
					var param3 = 1;
					
					var angle = value/max*2.0*Math.PI;
					
					if (angle > Math.PI)
						param2 = 1;
					
					var start = { x: outerRadius, y: 0.0 };
					var end = { x: outerRadius*Math.cos(angle), y: outerRadius*Math.sin(angle) };
					
					var codeDiscBis = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + backgroundColor + '; stroke-width: 2px; stroke:' + backgroundColor + ';" '
									+ '/>';
					
					mainCircleBis = new Component(codeDiscBis);
					g.getById('data').appendChild(mainCircleBis);
					
					var pathCode = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + fillColor + '; " '
									+ '/>';
									
					if (utils.isset(colorRamp))
					{
						pathCode = '<path '
										+ 'd="M 0.0,0.0 L ' + start.x + ',' + start.y + ' A ' + outerRadius + ' ' + outerRadius + ' ' + param1 + ' ' + param2 + ' ' + param3 + ' ' + end.x + ',' + end.y + ' Z" '
										+ 'transform="rotate(-90.0)" '
										+ 'style="fill: ' + colorRamp.getColorAt(Math.round(value/max*100.0)) + '; " '
									+ '/>';
					}
					
					mainCircle = new Component(pathCode);
					g.getById('data').appendChild(mainCircle);
				}
			}
		}
		else
		{
			codeDisc = '<circle cx="0" cy="0" r="' + outerRadius + '" style="fill:' + fullColor + '; " />';
			g.getById('data').appendChild(new Component(codeDisc));
		}
		
		codeDisc = '<circle cx="0" cy="0" r="' + innerRadius + '" style="fill:' + backgroundColor + '; " />';
		g.getById('data').appendChild(new Component(codeDisc));
		
		var fontSize = 14.0*Math.min($width, $height)/100.0;
		
		var centralDataCode = '<text x="0" y="0" style="font-size: ' + fontSize + 'px; fill: ' + fillColor + '; text-anchor:middle; alignment-baseline: central; font-weight: bold;" >'
								+ (Math.round(value/max*100.0)) + '%'
								+ '</text>';
								
		if (utils.isset(colorRamp))
		{
			centralDataCode = '<text x="0" y="0" style="font-size: ' + fontSize + 'px; fill: ' + colorRamp.getColorAt(Math.round(value/max*100.0)) + '; text-anchor:middle; alignment-baseline: central; font-weight: bold;" >'
								+ (Math.round(value/max*100.0)) + '%'
								+ '</text>';
		}
		
		if (value >= max)
		{
			centralDataCode = '<text x="0" y="0" style="font-size: ' + fontSize + 'px; fill: ' + fullColor + '; text-anchor:middle; alignment-baseline: central; font-weight: bold;" >'
								+ (Math.round(value/max*100.0)) + '%'
								+ '</text>';
		}
		
		g.getById('data').appendChild(new Component(centralDataCode));
		
		g.getById('data').setAttributeNS(null, 'transform', 'translate(' + ($width/2.0) + ',' + ($height/2.0) + ')');
		
		if (value < 1.95*max)
		{
			var entireAngle = value/max*2.0*Math.PI;
			animationSpeed = entireAngle/100.0;
		
			animationTimer = setInterval(function() { $this.animate(); }, 20);
		}
		
		//if (navigator.userAgent.toLowerCase().indexOf('firefox') >= 0)
		//	setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	this.autoResize = function()
	{
		var textSize = g.getElementsByTagName('text')[0].getBBox();
		
		if (textSize.height <= 0)
			setTimeout(function() { $this.autoResize(); }, 20);
		else
		{
			g.getElementsByTagName('text')[0].style.alignmentBaseline = 'auto';
			g.getElementsByTagName('text')[0].setAttributeNS(null, 'y', -textSize.y/2.0);
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

	var $this = utils.extend(svg, this);
	$this.build();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("gaugeChart");