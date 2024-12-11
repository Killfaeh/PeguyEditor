function LineChart($data, $width, $height, $params)
{
	console.log($data);
	
	// Exemple de données attendues
	
	/*
	$data = {
		unit: "€",
		xAxis: { name: "Mois", values: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] },
		data: 
		[
			{ name: "CA", data: [-400000, -300000, -590000, -590000, -350000, -300000, -300000, -400000, -500000, -300000, -400000, -300000] },
			{ name: "MB", data: [-580000, -400000, -290000, -400000, -400000, -400000, -290000, -400000, -500000, -400000, -500000, -400000] }
		]
	}
	//*/
	
	// Exemple de paramètres optionnels
	
	// { marginX: 0.9, marginY: 0.8, xLabelsAngle: 15}
	
	///////////////
	// Attributs //
	///////////////
	
	var params = $params;
	
	if (!utils.isset(params))
		params = {};
	
	var width = $width*0.9;
	var height = $height*0.9;
	
	if (utils.isset(params.marginX))
		width = $width*params.marginX;
	
	if (utils.isset(params.marginY))
		height = $height*params.marginY;
	
	var marginX = ($width-width)/2.0;
	var marginY = ($height-height)/2.0;
	
	var displayLegend = true;
	
	if (utils.isset(params.displayLegend))
		displayLegend = params.displayLegend;
	
	// Elements affichables
	
	var svg = Chart($data, $width, $height);
	
	var svgCode = '<g>'
						+ '<defs>'
							+ '<marker id="axisArrow" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto" style="fill:#000000" >'
								+ '<polyline points="0,0.1 3.9,2 0,3.9"/>'
							+ '</marker>'
						+ '</defs>'
						+ '<g id="caption" ></g>'
						+ '<g id="data" ></g>'
						+ '<path d="M ' + (marginX-0.5) + ',' + ($height-marginY) + ' L ' + ($width-marginX) + ',' + ($height-marginY) + '" style="stroke:#000000; stroke-width: 1px; fill: none; marker-end:url(#axisArrow);"  />'
						+ '<path d="M ' + marginX + ',' + ($height-marginY+0.5) + ' L ' + marginX + ',' + marginY + '" style="stroke:#000000; stroke-width: 1px; fill: none; marker-end:url(#axisArrow);" />'
					+ '</g>';

	var g = new Component(svgCode);
	
	//svg.appendChild(defs);
	svg.appendChild(g);
	
	var lines = {};
	
	// Traitement des données
	
	var min = 1000000000000000;
	var max = -1000000000000000;
	
	var data = svg.getData();
	
	for (var i = 0; i < data.data.length; i++)
	{
		for (var j = 0; j < data.data[i].data.length; j++)
		{
			if (utils.isset(data.data[i].data[j]))
			{
				if (data.data[i].data[j] > max)
					max = data.data[i].data[j];
			
				if (data.data[i].data[j] < min)
					min = data.data[i].data[j];
			}
		}
	}
	
	var amplitude = max - min;
	
	var unit = '';
	
	if (utils.isset(data.unit))
		unit = data.unit;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.build = function()
	{
		while(g.getById('data').firstChild)
			g.getById('data').removeChild(g.getById('data').firstChild);
		
		var dataWidth = width*9.0/10.0;
		var nbValues = data.xAxis.values.length;
		var step = dataWidth/nbValues;
		var captionOffset = 0.0;
		var captionColoRectWidth = dataWidth*0.05;
		
		for (var i = 0; i < data.data.length; i++)
		{
			var points = "";
			var d = "";
			
			for (var j = 0; j < data.data[i].data.length; j++)
			{
				var x = marginX + (j+1)*step;
				
				if (utils.isset(data.data[i].data[j]) && !isNaN(data.data[i].data[j]) && amplitude !== 0.0)
				{
					var y = $height-marginY - (data.data[i].data[j]-min)/amplitude*(height*9.0/10.0) - height*5.0/100.0;
					
					points = points + x + ',' + y + ' ';
					
					if ((j === 0 || !utils.isset(data.data[i].data[j-1]) || isNaN(data.data[i].data[j-1]))
						&& (j === data.data[i].data.length-1 || !utils.isset(data.data[i].data[j+1]) || isNaN(data.data[i].data[j+1])))
					{
						var crossSize = 2;
						d = d + 'M ' + (x-crossSize) + ',' + y + ' ';
						d = d + 'L ' + (x+crossSize) + ',' + y + ' ';
						d = d + 'M ' + x + ',' + (y-crossSize) + ' ';
						d = d + 'L ' + x + ',' + (y+crossSize) + ' ';
					}
					else if (j === 0 || !utils.isset(data.data[i].data[j-1]) || isNaN(data.data[i].data[j-1]) || amplitude === 0.0)
						d = d + 'M ' + x + ',' + y + ' ';
					else
						d = d + 'L ' + x + ',' + y + ' ';
				}
				
				var lineCode = '<line x1="' + x + '" y1="' + ($height-marginY-2) + '" x2="' + x + '" y2="' + ($height-marginY+2) + '" style="stroke:#000000; stroke-width: 1px; fill: none; "/>';
				g.getById('data').appendChild(new Component(lineCode));
			}
			
			var polylineCode = '<polyline points="' + points + '" style="stroke:' + svg.getColors()[i] + '; stroke-width: 1px; fill: none; " />';
			var polyline = new Component(polylineCode);
			var pathCode = '<path d="' + d + '" style="stroke:' + svg.getColors()[i] + '; stroke-width: 1px; fill: none; " />';
			var path = new Component(pathCode);
			lines[data.data[i].name] = { polyline: path, values: [] };
			g.getById('data').appendChild(path);
			
			if (displayLegend === true)
			{
				var captionColoRectCode = '<rect x="' + captionOffset + '" y="' + (marginY/2.0) + '" width="' + captionColoRectWidth + '" height="1" style="fill:' + svg.getColors()[i] + '; " />';
				g.getById('caption').appendChild(new Component(captionColoRectCode));
				
				var captionCode = '<text '
									+ 'x="' + (captionOffset + 1.3*captionColoRectWidth) + '" y="' + (marginY/2.0) + '" '
									+ 'style="font-size: ' + (5.0*$width/250.0) + 'px; alignment-baseline: central; " '
									+ '>' 
										+ data.data[i].name
								+ '</text>';
				
				var caption = new Component(captionCode);
				g.getById('caption').appendChild(caption);
				
				var captionSize = utils.getInputTextSize(caption, { fontFamily: 'Arial', fontSize: (5.0*$width/250.0) + 'px', fontStyle: 'normal', fontWeight: 'normal' });
				
				captionOffset = captionOffset + 1.3*captionColoRectWidth + captionSize.width + 0.3*captionColoRectWidth;
			}
		}
		
		for (var i = 0; i < data.data.length; i++)
		{
			for (var j = 0; j < data.data[i].data.length; j++)
			{
				var x = marginX + (j+1)*step;
				var y = $height-marginY - (data.data[i].data[j]-min)/amplitude*(height*9.0/10.0) - height*5.0/100.0;
				
				if (!isNaN(y) && y !== Infinity)
				{
					//console.log("y : " + y + ", dataWidth : " + dataWidth);
					
					var vertexCode = '<rect '
											+ 'x="' + (x - dataWidth*0.025) + '" '
											+ 'y="' + (y - dataWidth*0.025) + '" '
											+ 'width="' + (dataWidth*0.05) + '" '
											+ 'height="' + (dataWidth*0.05) + '" '
											+ 'style="fill:rgba(0,0,0,0); " '
										+ '/>';
					
					var vertex = new Component(vertexCode);
					vertex.onToolTip = Format.numberToMoney(data.data[i].data[j], unit);
					g.getById('data').appendChild(vertex);
					
					lines[data.data[i].name].values.push(vertex);
				}
			}
		}
		
		// Abscisses
		
		var xLabelsAngle = utils.isset(params.xLabelsAngle) ? params.xLabelsAngle : 0;
		
		for (var i = 0; i < data.xAxis.values.length; i++)
		{
			var xValueCode = '<text '
								+ 'x="0" y="0" '
								+ 'style="font-size: ' + (5.0*$width/250.0) + 'px; " '
								+ 'transform="translate(' + (marginX + (i+1)*step - 1) + ',' + ($height-marginY+7) + ') rotate(' + xLabelsAngle + ')" '
								+ '>' 
									+ data.xAxis.values[i] 
							+ '</text>';
			
			g.getById('data').appendChild(new Component(xValueCode));
		}
		
		g.getById('caption').setAttributeNS(null, 'transform', 'translate(' + ($width-captionOffset-marginX) + ',0.0)');
		
		// Ordonnées
		
		var nbMarks = 1;
		
		var integerAmplitude = Math.round(amplitude);
		var strAmplitude = integerAmplitude + '';
		var nbDigit = strAmplitude.length-1;
		var minMark = Math.ceil(min/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
		var maxMark = Math.floor(max/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
		markAmplitude = maxMark - minMark;
		
		while (nbMarks <= 1 || markAmplitude <= 0)
		{
			if (Math.floor(markAmplitude/Math.pow(10, nbDigit))%5 === 0)
				nbMarks = 5;
			else if (Math.floor(markAmplitude/Math.pow(10, nbDigit))%4 === 0)
				nbMarks = 4;
			else if (Math.floor(markAmplitude/Math.pow(10, nbDigit))%3 === 0)
				nbMarks = 3;
			else if (Math.floor(markAmplitude/Math.pow(10, nbDigit))%2 === 0)
				nbMarks = 2;
			else
				nbMarks = Math.floor(markAmplitude/Math.pow(10, nbDigit));
			
			if (nbMarks <= 1 || markAmplitude <= 0)
			{
				nbDigit--;
				minMark = Math.ceil(min/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
				maxMark = Math.floor(max/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
				markAmplitude = maxMark - minMark;
			}
		}
		
		markStep = markAmplitude/nbMarks;
		
		for (var i = 0; i <= nbMarks; i++)
		{
			if (nbMarks <= 10 || i%2 === 0)
			{
				var value = markStep*i + minMark;
				var x = marginX;
				var y = $height-marginY - (value-min)/amplitude*(height*9.0/10.0) - height*5.0/100.0;
				
				if (value > min && value < max)
				{
					var lineCode = '<line x1="' + (marginX-2) + '" y1="' + y + '" x2="' + (marginX+2) + '" y2="' + y + '" style="stroke:#000000; stroke-width: 1px; fill: none; "/>';
					g.getById('data').appendChild(new Component(lineCode));
				
					var valueToDisplay = Format.numberToMoney(value, unit, 2);
					
					var yValueCode = '<text '
										+ 'x="0" y="0" '
										+ 'style="font-size: ' + (5.0*$width/250.0) + 'px; text-anchor:end; alignment-baseline: central; " '
										+ 'transform="translate(' + (x-3) + ',' + y + ') " '
										+ '>' 
											+ valueToDisplay
									+ '</text>';
					
					g.getById('data').appendChild(new Component(yValueCode));
				}
			}
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getLine = function($name) { return lines[$name]; };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	$this.build();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("lineChart");