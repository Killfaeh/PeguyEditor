function SelectColorPopup($color)
{
	///////////////
	// Attributs //
	///////////////
	
	var color = $color;
	
	if (!utils.isset(color))
		color = { r: 255, g: 0, b: 0};
	
	var popupHTML = '<h2>' + KEYWORDS.selectColor + '</h2>'
						+ '<table>'
							+ '<tr>'
								+ '<td id="color-picker" ></td>'
								
								+ '<td class="inputs-block" >'
									+ '<table>'
										+ '<tr>'
											+ '<td colspan="2" class="color-preview-cell" >'
												+ '<div id="color-preview" class="color-preview" ></div>'
											+ '</td>'
										+ '</tr>'
										+ '<tr>'
											+ '<td class="rgb-cell" ><label for="input-red" >' + KEYWORDS.rgbR + '</label><input id="input-red" type="text" /></td>'
											+ '<td><label for="input-hue" >' + KEYWORDS.hsvH + '</label><input id="input-hue" type="text" /></td>'
											//+ '<td><label for="input-cyan" >' + KEYWORDS.cmykC + '</label><input id="input-cyan" type="text" /></td>'
										+ '</tr>'
										+ '<tr>'
											+ '<td class="rgb-cell" ><label for="input-green" >' + KEYWORDS.rgbG + '</label><input id="input-green" type="text" /></td>'
											+ '<td><label for="input-saturation" >' + KEYWORDS.hsvS + '</label><input id="input-saturation" type="text" /></td>'
											//+ '<td><label for="input-magenta" >' + KEYWORDS.cmykM + '</label><input id="input-magenta" type="text" /></td>'
										+ '</tr>'
										+ '<tr>'
											+ '<td class="rgb-cell" ><label for="input-blue" >' + KEYWORDS.rgbB + '</label><input id="input-blue" type="text" /></td>'
											+ '<td><label for="input-value" >' + KEYWORDS.hsvV + '</label><input id="input-value" type="text" /></td>'
											//+ '<td><label for="input-yellow" >' + KEYWORDS.cmykW + '</label><input id="input-yellow" type="text" /></td>'
										+ '</tr>'
										/*
										+ '<tr>'
											+ '<td></td>'
											+ '<td></td>'
											//+ '<td><label for="input-black" >' + KEYWORDS.cmykK + '</label><input id="input-black" type="text" /></td>'
										+ '</tr>'
										//*/
										+ '<tr>'
											+ '<td colspan="2" class="rgb-cell hex-cell" ><label for="input-hex" >#</label><input id="input-hex" class="input-hex" type="text" /></td>'
										+ '</tr>'
										+ '<tr>'
											+ '<td colspan="2" class="rgb-cell selector-block" id="selector-block" ></td>'
										+ '</tr>'
									+ '</table>'
								+ '</td>'
								
							+ '</tr>'
						+ '</table>';
	
	var popup = new ConfirmPopup(popupHTML);
	
	popup.addClass('select-color-popup');
	
	var colorPicker = new ColorPicker();
	colorPicker.setRGB(color.r, color.g, color.b);
	popup.getById('color-picker').appendChild(colorPicker);
	
	var colorList = [{ name: KEYWORDS.noNameColor, value: "no-name", color: "#FFFFFF"}];
	
	for (var name in Colors.named)
		colorList.push({ name: KEYWORDS[name], value: name, color: '#' + Colors.named[name]});
	
	//console.log(colorList);
	
	var colorSelector = new ComboBox("named-color", colorList, 'red');
	
	if (Loader.getMode() === 'mobile' && /android/.test(navigator.userAgent.toLowerCase()))
		colorSelector = new Select("named-color", colorList, 'red');
	
	popup.getById('selector-block').appendChild(colorSelector);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.updatePreview = function()
	{
		var rgb = colorPicker.getRGB();
		popup.getById('color-preview').style.backgroundColor = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
	};
	
	this.updateRGBinputs = function()
	{
		var rgb = colorPicker.getRGB();
		popup.getById('input-red').setAttribute('previousValue', rgb.r);
		popup.getById('input-red').value = rgb.r;
		popup.getById('input-green').setAttribute('previousValue', rgb.g);
		popup.getById('input-green').value = rgb.g;
		popup.getById('input-blue').setAttribute('previousValue', rgb.b);
		popup.getById('input-blue').value = rgb.b;
	};
	
	this.updateHSVinputs = function()
	{
		var hsv = colorPicker.getHSV();
		popup.getById('input-hue').setAttribute('previousValue', hsv.h);
		popup.getById('input-hue').value = hsv.h;
		popup.getById('input-saturation').setAttribute('previousValue', hsv.s);
		popup.getById('input-saturation').value = hsv.s;
		popup.getById('input-value').setAttribute('previousValue', hsv.v);
		popup.getById('input-value').value = hsv.v;
	};
	
	this.updateCMYKinputs = function() {};
	
	this.updateHexInputs = function()
	{
		var hex = colorPicker.getHex();
		popup.getById('input-hex').setAttribute('previousValue', hex);
		popup.getById('input-hex').value = hex;
	};
	
	this.updateColorSelector = function()
	{
		var hexCode = popup.getById('input-hex').value;
		var colorName = 'no-name';
		
		for (var name in Colors.named)
		{
			if (Colors.named[name].toUpperCase() === hexCode.toUpperCase())
				colorName = name;
		}
		
		colorSelector.setCurrentValue(colorName);
	};
	
	this.updateInputs = function()
	{
		color = colorPicker.getRGB();
		$this.updatePreview();
		$this.updateRGBinputs();
		$this.updateHSVinputs();
		$this.updateCMYKinputs();
		$this.updateHexInputs();
		$this.updateColorSelector();
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	colorPicker.onChange = function($data)
	{
		$this.updateInputs();
	};
	
	var filterKey = function($element, $event)
	{
		var onChange = false;
		
		//console.log("Touche : " + $event.keyCode);
		
		var ignoreKeys = [9, 13, 16, 17, 18, 20, 37, 38, 39, 40, 91, 93];
		
		if (ignoreKeys.indexOf($event.keyCode) < 0)
		{
			$element.filter(/[^0-9]/gi, '');
			
			var h = popup.getById('input-hue').value;
			var s = popup.getById('input-saturation').value;
			var v = popup.getById('input-value').value;
			
			if (h > 360)
			{
				h = 360;
				popup.getById('input-hue').value = 360;
			}
			
			if (s > 100)
			{
				s = 100;
				popup.getById('input-saturation').value = 100;
			}
			
			if (v > 100)
			{
				v = 100;
				popup.getById('input-value').value = 100;
			}
			
			var useKeys = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // Pavé numérique
							48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 222]; // Chiffre en haut
		
			if (useKeys.indexOf($event.keyCode) >= 0)
				onChange = true;
		}
		
		return onChange;
	};
	
	var onRGBchange = function()
	{
		var r = popup.getById('input-red').value;
		var g = popup.getById('input-green').value;
		var b = popup.getById('input-blue').value;
		
		if (r > 255)
		{
			r = 255;
			popup.getById('input-red').value = 255;
		}
		
		if (g > 255)
		{
			g = 255;
			popup.getById('input-green').value = 255;
		}
		
		if (b > 255)
		{
			b = 255;
			popup.getById('input-blue').value = 255;
		}
		
		colorPicker.setRGB(r, g, b);
		color = colorPicker.getRGB();
		$this.updatePreview();
		$this.updateHSVinputs();
		$this.updateCMYKinputs();
		$this.updateHexInputs();
		$this.updateColorSelector();
	};
	
	//popup.getById('input-red').onchange = function() { onRGBchange(); };
	popup.getById('input-red').onChange = function() { onRGBchange(); };
	
	popup.getById('input-red').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
			onRGBchange();
	});
	
	//popup.getById('input-green').onchange = function() { onRGBchange(); };
	popup.getById('input-green').onChange = function() { onRGBchange(); };
	
	popup.getById('input-green').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
			onRGBchange();
	});
	
	//popup.getById('input-blue').onchange = function() { onRGBchange(); };
	popup.getById('input-blue').onChange = function() { onRGBchange(); };
	
	popup.getById('input-blue').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
			onRGBchange();
	});
	
	var dateHSVkeyUp = new Date();
	var changeHSVtimer = null;
	
	var onHSVchange = function()
	{
		var h = popup.getById('input-hue').value;
		var s = popup.getById('input-saturation').value;
		var v = popup.getById('input-value').value;
		
		if (h > 360)
		{
			h = 360;
			popup.getById('input-hue').value = 360;
		}
		
		if (s > 100)
		{
			s = 100;
			popup.getById('input-saturation').value = 100;
		}
		
		if (v > 100)
		{
			v = 100;
			popup.getById('input-value').value = 100;
		}
		
		colorPicker.setHSV(h, s, v);
		color = colorPicker.getRGB();
		$this.updatePreview();
		$this.updateRGBinputs();
		$this.updateCMYKinputs();
		$this.updateHexInputs();
		$this.updateColorSelector();
	};
	
	//popup.getById('input-hue').onchange = function() { onHSVchange(); };
	popup.getById('input-hue').onChange = function() { onHSVchange(); };
	
	popup.getById('input-hue').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
		{
			dateHSVkeyUp = new Date();
			
			changeHSVtimer = setTimeout(function()
			{
				var dateActuelle = new Date();
				
				if (dateActuelle.getTime()-dateHSVkeyUp.getTime() >= 500)
				{
					var previousValue = popup.getById('input-hue').getAttribute('previousValue');
					var currentValue = popup.getById('input-hue').value;
					
					if (currentValue !== previousValue)
					{
						onHSVchange();
						popup.getById('input-hue').setAttribute('previousValue', currentValue);
					}
				}
				
			}, 500);
		}
	});
	
	//popup.getById('input-saturation').onchange = function() { onHSVchange(); };
	popup.getById('input-saturation').onChange = function() { onHSVchange(); };
	
	popup.getById('input-saturation').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
		{
			dateHSVkeyUp = new Date();
			
			changeHSVtimer = setTimeout(function()
			{
				var dateActuelle = new Date();
				
				if (dateActuelle.getTime()-dateHSVkeyUp.getTime() >= 500)
				{
					var previousValue = popup.getById('input-saturation').getAttribute('previousValue');
					var currentValue = popup.getById('input-saturation').value;
					
						if (currentValue !== previousValue)
					{
						onHSVchange();
						popup.getById('input-saturation').setAttribute('previousValue', currentValue);
					}
				}
				
			}, 500);
		}
	});
	
	//popup.getById('input-value').onchange = function() { onHSVchange(); };
	popup.getById('input-value').onChange = function() { onHSVchange(); };
	
	popup.getById('input-value').addEvent('keyup', function($event)
	{
		if (filterKey(this, $event) === true)
		{
			dateHSVkeyUp = new Date();
			
			changeHSVtimer = setTimeout(function()
			{
				var dateActuelle = new Date();
				
				if (dateActuelle.getTime()-dateHSVkeyUp.getTime() >= 500)
				{
					var previousValue = popup.getById('input-value').getAttribute('previousValue');
					var currentValue = popup.getById('input-value').value;
					
					if (currentValue !== previousValue)
					{
						onHSVchange();
						popup.getById('input-value').setAttribute('previousValue', currentValue);
					}
					
					clearTimeout(changeHSVtimer);
					changeHSVtimer = null;
				}
				
			}, 500);
		}
	});
	
	var onHEXchange = function()
	{
		var hex = popup.getById('input-hex').value;
		
		colorPicker.setHex(hex);
		color = colorPicker.getRGB();
		$this.updatePreview();
		$this.updateRGBinputs();
		$this.updateHSVinputs();
		$this.updateCMYKinputs();
		$this.updateColorSelector();
	};
	
	//popup.getById('input-hex').onchange = function() { onHEXchange(); };
	popup.getById('input-hex').onChange = function() { onHEXchange(); };
	
	popup.getById('input-hex').addEvent('keyup', function($event)
	{
		var ignoreKeys = [9, 37, 38, 39, 40];
		
		if (ignoreKeys.indexOf($event.keyCode) < 0)
		{
			popup.getById('input-hex').filter(/[^0-9a-fA-F]/gi, '');
			onHEXchange();
		}
	});
	
	//colorSelector.onchange = function($value)
	colorSelector.onChange = function($value)
	{
		var hexCode = Colors.named[$value];
		
		if (!utils.isset(hexCode))
			hexCode = '000000';
		
		popup.getById('input-hex').value = hexCode.toUpperCase();
		colorPicker.setHex(hexCode);
		color = colorPicker.getRGB();
		$this.updatePreview();
		$this.updateRGBinputs();
		$this.updateHSVinputs();
		$this.updateCMYKinputs();
		$this.updateColorSelector();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getRGB = function() { return colorPicker.getRGB(); };
	this.getHSV = function() { return colorPicker.getHSV(); };
	this.getHex = function() { return colorPicker.getHex(); };
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	$this.updateInputs();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("selectColorPopup");