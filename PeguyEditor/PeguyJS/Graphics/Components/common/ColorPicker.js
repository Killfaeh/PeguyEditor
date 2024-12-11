function ColorPicker()
{
	///////////////
	// Attributs //
	///////////////
	
	//// Données ////
	
	var hue = 0;
	var saturation = 255;
	var value = 255;
	
	//// Composents affichables ////
	
	var html = '<div class="color-picker" >'
					+ '<div id="value-saturation" class="value-saturation" ></div>'
					+ '<div id="hue" class="hue" ></div>'
				+ '</div>';
	
	var component = new Component(html);
	
	// Carré de valeur et saturation
	
	var whiteRamp = new SVGlinearGradient(0, 0, "100%", 0, 
	[
		{ offset: '0%', color: 'rgb(255, 255, 255)', opacity: 1.0 },
		{ offset: '100%', color: 'rgb(255, 255, 255)', opacity: 0.0 }
	]);
	
	var blackRamp = new SVGlinearGradient(0, 0, 0, "100%", 
	[
		{ offset: '0%', color: 'rgb(0, 0, 0)', opacity: 0.0 },
		{ offset: '100%', color: 'rgb(0, 0, 0)', opacity: 1.0 }
	]);
	
	var valueSaturationPickerCode = '<defs>'
										+ whiteRamp.toCode()
										+ blackRamp.toCode()
									+ '</defs>'
									+ '<rect class="color-rect" x="5" y="5" width="258" height="258" style="fill:rgb(0, 0, 0);"></rect>'
									+ '<rect id="color-rect" class="color-rect" x="6" y="6" width="256" height="256" style="fill:rgb(255, 0, 0);"></rect>'
									+ '<rect class="color-rect" x="6" y="6" width="256" height="256" style="fill:' + whiteRamp.getURL() + ';"></rect>'
									+ '<rect id="black-rect" class="color-rect black-gradient-rect" x="6" y="6" width="256" height="256" style="fill:' + blackRamp.getURL() + ';"></rect>'
									+ '<g id="cursor" transform="translate(261, 6)">'
										+ '<circle cx="0" cy="0" r="4" style=" fill: none; stroke: rgb(255, 255, 255); "></circle>'
										+ '<circle cx="0" cy="0" r="5" style=" fill: none; stroke: rgb(0, 0, 0); "></circle>'
									+ '</g>';
	
	var valueSaturationPicker = new SVG(268, 268, valueSaturationPickerCode);
	
	var colorRect = valueSaturationPicker.getById('color-rect');
	var valueSaturationPickerG = valueSaturationPicker.getById('cursor');
	
	// Rampe de teinte
	
	var hueRamp = new SVGlinearGradient(0, 0, 0, "100%", 
	[
		{ offset: '0%', color: 'rgb(255, 0, 0)', opacity: 1.0 },
		{ offset: '16.67%', color: 'rgb(255, 255, 0)', opacity: 1.0 },
		{ offset: '33.33%', color: 'rgb(0, 255, 0)', opacity: 1.0 },
		{ offset: '50%', color: 'rgb(0, 255, 255)', opacity: 1.0 },
		{ offset: '66.67%', color: 'rgb(0, 0, 255)', opacity: 1.0 },
		{ offset: '83.33%', color: 'rgb(255, 0, 255)', opacity: 1.0 },
		{ offset: '100%', color: 'rgb(255, 0, 0)', opacity: 1.0 }
	]);
	
	huePickerCode = '<defs>'
						+ hueRamp.toCode()
					+ '</defs>'
					+ '<rect class="color-rect hue-gradient-rect" x="2" y="5" width="32" height="258" style="fill:rgb(0, 0, 0);"></rect>'
					+ '<rect id="hue-rect" class="color-rect hue-gradient-rect" x="3" y="6" width="30" height="256" style="fill:' + hueRamp.getURL() + ';"></rect>'
					+ '<g id="cursor" transform="translate(0, 6)">'
						+ '<rect x="2" y="-4" width="32" height="8" style=" fill: none; stroke: rgb(255, 255, 255); "></rect>'
						+ '<rect x="1" y="-5" width="34" height="10" style=" fill: none; stroke: rgb(0, 0, 0); "></rect>'
					+ '</g>';
	
	var huePicker = new SVG(36, 268, huePickerCode);
	var huePickerG = huePicker.getById('cursor');
	
	component.getById('value-saturation').appendChild(valueSaturationPicker);
	component.getById('hue').appendChild(huePicker);
	
	// Drag & drop
	
	var valueSaturationDown = false;
	var hueDown = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.updateInterface = function()
	{
		if (hue < 0)
			hue = 0;
		else if (hue > 255)
			hue = 255;
		
		if (saturation < 0)
			saturation = 0;
		else if (saturation > 255)
			saturation = 255;
		
		if (value < 0)
			value = 0;
		else if (value > 255)
			value = 255;
		
		//var rgb = $this.hueToRGB(hue/255.0*100.0);
		var rgb = Colors.hueToRGB(hue/255.0*360.0);
		colorRect.setAttributeNS(null, "style", "fill:rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ");");
		
		huePickerG.setAttributeNS(null, "transform", "translate(0, " + (6+hue) + ")");
		valueSaturationPickerG.setAttributeNS(null, "transform", "translate(" + (6+saturation) + ", " + (6+255-value) + ")");
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($data) {};
	
	var onChange = function($event)
	{
		$this.onChange({});
	};
	
	var onValueSaturationChange = function($event)
	{
		var x = $event.clientX;
		var y = $event.clientY;
		var rectPosition = valueSaturationPicker.getById('black-rect').position();
		
		var deltaX = x - Math.round(rectPosition.x);
		var deltaY = y - Math.round(rectPosition.y);
		
		if (deltaX < 0)
			deltaX = 0;
		else if (deltaX > 255)
			deltaX = 255;
		
		if (deltaY < 0)
			deltaY = 0;
		else if (deltaY > 255)
			deltaY = 255;
		
		valueSaturationPickerG.setAttributeNS(null, "transform", "translate(" + (6+deltaX) + ", " + (6+deltaY) + ")");
		
		saturation = deltaX;
		value = 255 - deltaY;
		
		onChange($event);
	};
	
	valueSaturationPicker.getById('black-rect').onClick = function($event)
	{
		if ($event.button === 0)
			onValueSaturationChange($event);
	};
	
	valueSaturationPicker.getById('black-rect').onMouseDown = function($event)
	{
		if (!$event) // Cas IE 
			$event = window.event;
		
		if ($event.preventDefault) 
			$event.preventDefault(); 
		else
			$event.returnValue = false; 
		
		if ($event.button === 0)
		{
			valueSaturationDown = true;
			onValueSaturationChange($event);
		}
	};
	
	var onHueChange = function($event)
	{
		var y = $event.clientY;
		var rectPosition = valueSaturationPicker.getById('black-rect').position();
		
		var deltaY = y - Math.round(rectPosition.y);
		
		if (deltaY < 0)
			deltaY = 0;
		else if (deltaY > 255)
			deltaY = 255;
		
		huePickerG.setAttributeNS(null, "transform", "translate(0, " + (6+deltaY) + ")");
		
		hue = deltaY;
		var rgb = Colors.hueToRGB(hue/255.0*360.0);
		
		colorRect.setAttributeNS(null, "style", "fill:rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ");");
		
		onChange($event);
	};
	
	huePicker.getById('hue-rect').onClick = function($event)
	{
		if ($event.button === 0)
			onHueChange($event);
	};
	
	huePicker.getById('hue-rect').onMouseDown = function($event)
	{
		if (!$event) // Cas IE 
			$event = window.event;
		
		if ($event.preventDefault) 
			$event.preventDefault(); 
		else
			$event.returnValue = false; 
		
		if ($event.button === 0)
		{
			hueDown = true;
			onHueChange($event);
		}
	};
	
	var onMouseMove = function($event)
	{
		if (!$event) // Cas IE 
			$event = window.event;
		
		if ($event.preventDefault) 
			$event.preventDefault(); 
		else
			$event.returnValue = false; 
		
		if (valueSaturationDown === true)
			onValueSaturationChange($event);
		
		if (hueDown === true)
			onHueChange($event);
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		if (valueSaturationDown === true)
			onValueSaturationChange($event);
		
		if (hueDown === true)
			onHueChange($event);
		
		valueSaturationDown = false;
		hueDown = false;
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getRGB = function()
	{
		var rgb = Colors.hsvToRGB(hue/255.0*360.0, saturation/255.0*100.0, value/255.0*100.0);
		return rgb;
	};
	
	this.getHSV = function()
	{
		var hsv =
		{
			h: Math.round(hue/255.0*360.0),
			s: Math.round(saturation/255.0*100.0),
			v: Math.round(value/255.0*100.0)
		};
		
		return hsv;
	};
	
	this.getCMYK = function()
	{
		
	};
	
	this.getHex = function()
	{
		var rgb = $this.getRGB();
		var hexCode = Colors.rgbToHex(rgb.r, rgb.g, rgb.b);
		return hexCode;
	};
	
	// SET
	
	this.setRGB = function($red, $green, $blue)
	{
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
		
		saturation = Math.round(s*255.0);
		value = v;
		
		var hsv = Colors.rgbToHSV($red, $green, $blue);
		hue = Math.round(hsv.h/360.0*255.0);
		
		$this.updateInterface();
	};
	
	this.setHSV = function($hue, $saturation, $value)
	{
		hue = Math.round($hue/360.0*255.0);
		saturation = Math.round($saturation/100.0*255.0);
		value = Math.round($value/100.0*255.0);
		$this.updateInterface();
	};
	
	this.setCMYK = function($cyan, $magenta, $yellow, $black)
	{
		
	};
	
	this.setHex = function($hex)
	{
		var rgb = Colors.hexToRGB($hex);
		$this.setRGB(rgb.r, rgb.g, rgb.b);
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("colorPicker");