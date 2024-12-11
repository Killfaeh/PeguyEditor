function ColumnChart($data, $width, $height, $params)
{
	// Exemple de données attendues
	
	/*
	$data = {
		unit: "€",
		xAxis: { name: "Mois", values: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] },
		data: 
		[
			{ name: "2019", data: [400000, 300000, 590000, 590000, 350000, 300000, 300000, 400000, 500000, 300000, 400000, 300000] },
			{ name: "2020", data: [580000, 400000, 290000, 400000, 400000, 400000, 290000, 400000, 500000, 400000, 500000, 400000] }
		]
	}
	//*/
	
	// Exemple de paramètres optionnels
	
	// { displayLegend: false, marginX: 0.9, marginY: 0.8, xLabelsAngle: 15}
	
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
	
	var cropToAmplitude = false;
	
	if (utils.isset(params.cropToAmplitude))
		cropToAmplitude = params.cropToAmplitude;
	
	// Elements affichables
	
	var svg = Chart($data, $width, $height);
	
	var svgCode = '<g>'
						+'<defs>'
							+ '<marker id="axisArrow" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto" style="fill:#000000" >'
								+ '<polyline points="0,0.1 3.9,2 0,3.9"/>'
							+ '</marker>'
						+ '</defs>'
						+ '<g id="caption" ></g>'
						+ '<g id="data" ></g>'
						+ '<g id="reperes" >'
							+ '<path d="M ' + (marginX-0.5) + ',' + ($height-marginY) + ' L ' + ($width-marginX) + ',' + ($height-marginY) + '" style="stroke:#000000; stroke-width: 1px; fill: none; marker-end:url(#axisArrow);"  />'
							+ '<path d="M ' + marginX + ',' + ($height-marginY+0.5) + ' L ' + marginX + ',' + marginY + '" style="stroke:#000000; stroke-width: 1px; fill: none; marker-end:url(#axisArrow);" />'
						+ '</g>'
					+ '</g>';

	var g = new Component(svgCode);
	
	//svg.appendChild(defs);
	svg.appendChild(g);
	
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
	
	var minToDisplay = min;
	var maxToDisplay = max;
	
	//*
	if (cropToAmplitude === false)
	{
		if (minToDisplay > 0.0)
			minToDisplay = 0.0;
		
		if (maxToDisplay < 0.0)
			maxToDisplay = 0.0;
	}
	//*/
	
	var amplitudeToDisplay = maxToDisplay - minToDisplay;
	var y0 = 0.0;
	
	var unit = '';
	
	if (utils.isset(data.unit))
		unit = data.unit;
	
	// Animation
	
	var animationTimer = null;
	var animationSpeed = 0;
	var currentHeight = 0.0;
	var columnsList = [];
	
	//////////////
	// Méthodes //
	//////////////
	
	this.animate = function()
	{
		currentHeight = currentHeight + animationSpeed;
		
		if (currentHeight > 100.0)
		{
			currentHeight = 100.0;
			clearTimeout(animationTimer);
			animationTimer = null;
			animationSpeed = 0.0;
		}
		
		for (var i = 0; i < columnsList.length; i++)
		{
			// (marginY/2.0 - 3.5*$height/150.0)
			// (7.0*$height/150.0)
			
			var columnHeight = columnsList[i].height*currentHeight/100.0;
			
			if (!isNaN(columnHeight))
			{
				columnsList[i].rect.setAttributeNS(null, 'y', y0-columnHeight);
				
				if (columnsList[i].negative === true)
					columnsList[i].rect.setAttributeNS(null, 'y', y0);
				
				columnsList[i].rect.setAttributeNS(null, 'height', columnHeight);
			}
		}
	};
	
	this.build = function()
	{
		while(g.getById('data').firstChild)
			g.getById('data').removeChild(g.getById('data').firstChild);
		
		var nbValues = data.xAxis.values.length;
		var step = width*9.75/10.0/nbValues;
		var rectWidth = (step*8.0/10.0)/data.data.length;
		var captionOffset = 0.0;
		var captionColoRectWidth = width*0.05;
		y0 = $height-marginY;
		
		if (minToDisplay < 0.0)
		{
			if (cropToAmplitude === true && maxToDisplay <= 0.0)
				y0 = marginY + 2.5/100.0*height;
			else if (amplitudeToDisplay !== 0.0)
				y0 = $height - marginY - Math.abs(min)/amplitudeToDisplay*height;
			else
				y0 = $height - marginY;
		}
		
		// Tracé des colonnes
		
		for (var i = 0; i < data.data.length; i++)
		{
			for (var j = 0; j < data.data[i].data.length; j++)
			{
				var rectHeight = 0.0;
				
				if (utils.isset(data.data[i].data[j]))
				{
					if (cropToAmplitude === true && minToDisplay*maxToDisplay > 0.0)
					{
						if (minToDisplay > 0.0)
							rectHeight = Math.abs(data.data[i].data[j]-minToDisplay)/amplitudeToDisplay*(height*9.0/10.0) + height*5.0/100.0;
						else if (maxToDisplay < 0.0)
							rectHeight = Math.abs(data.data[i].data[j]-maxToDisplay)/amplitudeToDisplay*(height*9.0/10.0) + height*5.0/100.0;
					}
					else
						rectHeight = Math.abs(data.data[i].data[j])/amplitudeToDisplay*(height*9.0/10.0);
				}
				
				if (isNaN(rectHeight) || rectHeight === Infinity)
					rectHeight = 0.0;
				
				//console.log("rectHeight : " + rectHeight + ", y0 : " + y0);
				
				var rectCode = '<rect x="' + (marginX + j*step + i*rectWidth + width*2.5/100.0) + '" y="' + (y0-rectHeight) + '" width="' + (rectWidth-1) + '" height="' + rectHeight + '" style="fill:' + svg.getColors()[i] + ';" />';
				
				if (data.data[i].data[j] < 0.0)
					rectCode = '<rect x="' + (marginX + j*step + i*rectWidth + width*2.5/100.0) + '" y="' + y0 + '" width="' + (rectWidth-1) + '" height="' + rectHeight + '" style="fill:' + svg.getColors()[i] + ';" />';
				
				var rect = new Component(rectCode);
				//rect.onToolTip = data.data[i].name;
				rect.onToolTip = Format.numberToMoney(data.data[i].data[j], unit);
				g.getById('data').appendChild(rect);
				columnsList.push({ rect: rect, height: rectHeight, negative: (data.data[i].data[j]<0) ? true : false });
			}
			
			if (displayLegend === true)
			{
				var captionColoRectCode = '<rect x="' + captionOffset + '" y="' + (marginY/2.0 - 3.5*$height/150.0) + '" width="' + captionColoRectWidth + '" height="' + (7.0*$height/150.0) + '" style="fill:' + svg.getColors()[i] + '; " />';
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
		
		// Axe 0 s'il y en a un
		
		if (min < 0)
		{
			var zeroAxisCode = '<path d="M ' + (marginX-0.5) + ',' + y0 + ' L ' + ($width-marginX) + ',' + y0 + '" style="stroke:#000000; stroke-width: 0.5px; fill: none; " />';
			g.getById('reperes').appendChild(new Component(zeroAxisCode));
			
			if (cropToAmplitude === false)
			{
				var yValueCode = '<text '
									+ 'x="0" y="0" '
									+ 'style="font-size: ' + (5.0*$width/250.0) + 'px; text-anchor:end; alignment-baseline: central; " '
									+ 'transform="translate(' + (marginX-3) + ',' + y0 + ') " '
									+ '>0' 
										+ unit
								+ '</text>';
				
				g.getById('data').appendChild(new Component(yValueCode));
			}
		}
		
		// Abscisses
		
		var xLabelsAngle = utils.isset(params.xLabelsAngle) ? params.xLabelsAngle : 0;
		
		for (var i = 0; i < data.xAxis.values.length; i++)
		{
			var xValueCode = '<text '
								+ 'x="0" y="0" '
								+ 'style="font-size: ' + (5.0*$width/250.0) + 'px; " '
								+ 'transform="translate(' + (marginX + i*step - 1 + width*2.5/100.0) + ',' + ($height-marginY+7) + ') rotate(' + xLabelsAngle + ')" '
								+ '>' 
									+ data.xAxis.values[i] 
							+ '</text>';
			
			g.getById('data').appendChild(new Component(xValueCode));
		}
		
		g.getById('caption').setAttributeNS(null, 'transform', 'translate(' + ($width-captionOffset-marginX) + ',0.0)');
		
		animationSpeed = 100.0/100.0;
		animationTimer = setInterval(function() { $this.animate(); }, 20);
		
		// Ordonnées
		
		var nbMarks = 1;
		
		var integerAmplitude = Math.round(amplitudeToDisplay);
		
		if (cropToAmplitude === false)
		{
			if (minToDisplay >= 0.0)
				integerAmplitude = Math.round(maxToDisplay);
			else if (maxToDisplay <= 0.0)
				integerAmplitude = Math.abs(Math.round(minToDisplay));
		}
		
		var strAmplitude = integerAmplitude + '';
		var nbDigit = strAmplitude.length-1;
		var minMark = Math.ceil(minToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
		var maxMark = Math.floor(maxToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
		
		if (cropToAmplitude === false)
		{
			if (minToDisplay >= 0.0)
			{
				minMark = 0;
				maxMark = Math.floor(maxToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
			}
			else if (maxToDisplay <= 0.0)
			{
				minMark = Math.ceil(minToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
				maxMark = 0;
			}
		}
		
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
				nbDigit = nbDigit - 1;
				minMark = Math.ceil(minToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
				maxMark = Math.floor(maxToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
				
				if (cropToAmplitude === false)
				{
					if (minToDisplay >= 0.0)
					{
						minMark = 0;
						maxMark = Math.floor(maxToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
					}
					else if (maxToDisplay <= 0.0)
					{
						minMark = Math.ceil(minToDisplay/Math.pow(10, nbDigit))*Math.pow(10, nbDigit);
						maxMark = 0;
					}
				}
				
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
				var y = y0 - value/amplitudeToDisplay*(height*9.0/10.0);
				
				if (cropToAmplitude === true && minToDisplay*maxToDisplay > 0.0)
				{
					if (minToDisplay >= 0.0)
						y = $height-marginY - (value-minToDisplay)/amplitudeToDisplay*(height*9.0/10.0) - height*5.0/100.0;
					else if (maxToDisplay <= 0.0)
						y = y0 - (value-maxToDisplay)/amplitudeToDisplay*(height*9.0/10.0) + height*5.0/100.0;
				}
				
				if (value !== 0.0 && value > minToDisplay && value < maxToDisplay)
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
	
	// SET
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(svg, this);
	$this.build();
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("columnChart");