String.prototype.replaceAll = function($strToReplace, $newStr)
{
	var output = this;
	
	var improbableStr = '[[[hgdgugjhgjklfhlkjtlkhjkrhklhjkthjkjlkhdjklhk]]]';
	
	while (output.indexOf($strToReplace) >= 0)
		output = output.replace($strToReplace, improbableStr);
	
	while (output.indexOf(improbableStr) >= 0)
		output = output.replace(improbableStr, $newStr);
	
	return output;
};

String.prototype.insertAt = function($text, $index)
{
	return this.slice(0, $index) + $text + this.slice($index);
};

String.prototype.getDate = function()
{
	var newDate = new Date();
	
	if (this !== '')
	{
		var dateElements = this.split('-');
		newDate = new Date(parseInt(dateElements[0]), parseInt(dateElements[1])-1, parseInt(dateElements[2]));
	}
	
	if (!(newDate instanceof Date) || isNaN(newDate.valueOf()))
		newDate = new Date();
	
	return newDate;
};

String.prototype.getLocalDate = function($language, $options)
{
	var newDate = new Date();
	
	if (this !== '')
	{
		var dateElements = this.split('-');
		newDate = new Date(parseInt(dateElements[0]), parseInt(dateElements[1])-1, parseInt(dateElements[2]));
	}
	
	if (!(newDate instanceof Date) || isNaN(newDate.valueOf()))
		newDate = new Date();
	
	return newDate.toLocaleDateString($language, $options);
};

String.prototype.removeAccents = function()
{
	var str = this;

	var accents = 
	{
		a: 'ªÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäÃãĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺ',
		ae: 'ÆæǼǽẚ',
		b: 'ḂḃḄḅḆḇ',
		c: 'ĆćĈĉČčĊċÇçḈḉȻȼ',
		d: 'ĎďḊḋḐḑḌḍḒḓḎḏĐđÐð',
		dz: 'ǱǲǳǄǅǆ',
		e: 'ÉéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛ',
		f: 'Ḟḟƒ',
		g: 'ǴǵĞğĜĝĠġĢģḠḡ',
		h: 'ĤĥḦḧḢḣḨḩḤḥḪḫẖĦħ',
		i: 'ÍíÌìĬĭÎîǏǐÏïḮḯĨĩİĮįĪīỈỉȈȉȊȋỊịḬḭı',
		ij: 'Ĳĳ',
		j: 'Ĵĵ',
		k: 'ḰḱĶķḲḳḴḵ',
		l: 'ĹĺĽľĻļḶḷḸḹḼḽḺḻŁłĿŀȽ',
		lj: 'Ǉǈǉ',
		m: 'ḾḿṀṁṂṃ',
		n: 'ŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉ',
		nj: 'Ǌǋǌ',
		o: 'ºÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿŌōṒṓṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộ',
		oe: 'Œœ',
		p: 'ṔṕṖṗ',
		r: 'ŔŕŘřṘṙŖŗȐȑȒȓṚṛṜṝṞṟ',
		s: 'ŚśṤṥŜŝŠšṦṧṠṡŞşṢṣṨṩȘșſẛȿ',
		ss: 'ßẞ',
		t: 'ŤťẗṪṫŢţṬṭȚțṰṱṮṯŦŧȾ',
		u: 'ÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừỮữỬửỰựỤụṲṳṶṷṴṵ',
		v: 'ṼṽṾṿ',
		w: 'ẂẃẀẁŴŵẘẄẅẆẇẈẉ',
		x: 'ẌẍẊẋ',
		y: 'ÝýỲỳŶŷẙÿŸỸỹẎẏȲȳỶỷỴỵ',
		z: 'ŹźẐẑŽžŻżẒẓẔẕɀ',
		th: 'Þþ'
	};

	for (var letter in accents)
	{
		for (var i = 0; i < accents[letter].length; i++)
		{
			var regex = new RegExp(accents[letter][i], 'g');
			str = str.replace(regex, letter);
		}
	}

	return str;
};

String.prototype.formatTel = function()
{
	var str = this;
	var output = str;
	
	if (str !== "")
	{
		str = str.replace(/ /gi, '');

		output = "";

		for (var i = 0; i < str.length; i++)
		{
			output += str.charAt(i);
			
			if (i%2 !== 0)
				output += ' ';
		}
	}
	
	return output;
};

var Format = 
{
	isInFontsList: function($fontName, $fontsList)
	{
		var inFontsList = false;
		
		for (var i = 0; i < $fontsList.length; i++)
		{
			if ($fontName === $fontsList[i].value)
			{
				inFontsList = true;
				i = $fontsList.length;
			}
		}
		
		return inFontsList;
	},
	
	parseHtmlNode: function($node, $config)
	{
		var tags = ['div', 'p', 'span', 'br'];
		var attributes = ['title', 'class', 'type', 'id'];
		var colorsList = $config.colorsList;
		var imagesUploadModes = $config.imagesUploadModes;
		
		if ($config.bold === true)
		{
			tags.push('b');
			tags.push('strong');
		}
		
		if ($config.italic === true)
		{
			tags.push('i');
			tags.push('em');
		}
		
		if ($config.underline === true)
			tags.push('u');
		
		if ($config.strike === true)
		{
			tags.push('s');
			tags.push('strike');
		}
		
		if ($config.fontSize === true || $config.textColor === true || $config.font === true)
			tags.push('font');
		
		if ($config.title === true)
		{
			tags.push('h1');
			tags.push('h2');
			tags.push('h3');
			tags.push('h4');
			tags.push('h5');
			tags.push('h6');
		}
		
		if ($config.quote === true)
			tags.push('blockquote');
		
		if ($config.code === true)
		{
			tags.push('pre');
			//tags.push('code');
		}
		
		if ($config.lists === true)
		{
			tags.push('ul');
			tags.push('ol');
			tags.push('li');
		}
		
		if ($config.tables === true)
		{
			tags.push('table');
			tags.push('tbody');
			tags.push('thead');
			tags.push('tfoot');
			tags.push('tr');
			tags.push('th');
			tags.push('td');
		}
		
		if ($config.links === true)
		{
			tags.push('a');
			attributes.push('href');
		}
		
		if ($config.images === true)
		{
			tags.push('img');
			attributes.push('src');
		}
		
		var result = document.createElement('div');
		
		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var tagName = $node.tagName;
			
			if (utils.isset(tagName) && tagName !== "")
				tagName = $node.tagName.toLowerCase();
			
			if (utils.isset(tagName) && tags.indexOf(tagName) >= 0)
			{
				result = document.createElement(tagName);
				
				if (utils.isset($node.childNodes))
				{
					if (tagName === 'b' || tagName === 'strong')
						result = document.createElement('b');
					else if (tagName === 'i' || tagName === 'em')
						result = document.createElement('i');
					else if (tagName === 's' || tagName === 'strike')
						result = document.createElement('strike');
					else if (tagName === 'div' || tagName === 'p' 
								|| tagName === 'ul' || tagName === 'ol' || tagName === 'li' 
								|| tagName === 'table' || tagName === 'tr' || tagName === 'th' || tagName === 'td' 
								|| tagName === 'blockquote' 
								|| tagName === 'h1'|| tagName === 'h2'|| tagName === 'h3'|| tagName === 'h4'|| tagName === 'h5'|| tagName === 'h6')
					{
						var style = $node.getAttribute('style');
						
						if (utils.isset(style) && style !== '')
						{
							if ($config.align === true && /text-align: ?justify;?/.test(style))
								result.style.textAlign = "justify";
							else if ($config.align === true && /text-align: ?center;?/.test(style))
								result.style.textAlign = "center";
							else if ($config.align === true && /text-align: ?right;?/.test(style))
								result.style.textAlign = "right";
							else if ($config.align === true && /text-align: ?left;?/.test(style))
								result.style.textAlign = "left";
						}
					}
					
					if ($config.addAnchor === true)
					{
						if (tagName === 'div' || tagName === 'p' 
								|| tagName === 'li' || tagName === 'th' || tagName === 'td' 
								//|| tagName === 'blockquote' || tagName === 'pre' 
								|| tagName === 'h1'|| tagName === 'h2'|| tagName === 'h3'|| tagName === 'h4'|| tagName === 'h5'|| tagName === 'h6')
						{
							var anchorValue = (new Date()).getTime();
							var anchorSpan = document.createElement('span');
							anchorSpan.setAttribute('id', anchorValue);
							anchorSpan.setAttribute('class', 'anchor');
							result.appendChild(anchorSpan);
						}
					}
					
					var anchor = result;
					
					if (tagName !== 'pre')
					{
						var style = $node.getAttribute('style');
						
						if (utils.isset(style) && style !== '')
						{
							if ($config.fontSize === true && /font-size: ?[0-9emEMpxpXptPT.%]+;?/.test(style))
							{
								var fontSizeRegex = new RegExp("font-size: ?([0-9emEMpxpXptPT.%]+);?");
								var size = style.match(fontSizeRegex)[1];
								
								var font = document.createElement('font');
								anchor.appendChild(font);
								anchor = font;
								
								anchor.style.fontSize = size;
							}
							
							var colorRegex = new RegExp("([^-]color|^color): ?#([0-9a-fA-F]{6});?");
							var matchColor = style.match(colorRegex);
							
							if ($config.textColor === true && utils.isset(matchColor))
							{
								var color = matchColor[2];
								var inColorsList = Colors.filterHex(color, colorsList);
								var equal = Colors.compare(color, $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									var font = document.createElement('font');
									anchor.appendChild(font);
									anchor = font;
									
									anchor.style.color = "#" + color;
								}
							}
							
							colorRegex = new RegExp("([^-]color|^color): ?rgb\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}) ?\\);?");
							matchColor = style.match(colorRegex);
							
							if ($config.textColor === true && utils.isset(matchColor))
							{
								var red = matchColor[2];
								var green = matchColor[3];
								var blue = matchColor[4];
								var inColorsList = Colors.filterRGB(red, green, blue, colorsList);
								var equal = Colors.compare('rgb(' + red + ',' + green + ',' + blue + ')', $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									var font = document.createElement('font');
									anchor.appendChild(font);
									anchor = font;
									
									anchor.style = "color: rgb(" + red + ", " + green + ", " + blue + ");";
								}
							}
							
							colorRegex = new RegExp("([^-]color|^color): ?rgba\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}) ?\\);?");
							matchColor = style.match(colorRegex);
							
							if ($config.textColor === true && utils.isset(matchColor))
							{
								var red = matchColor[2];
								var green = matchColor[3];
								var blue = matchColor[4];
								var inColorsList = Colors.filterRGB(red, green, blue, colorsList);
								var equal = Colors.compare('rgb(' + red + ',' + green + ',' + blue + ')', $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									var font = document.createElement('font');
									anchor.appendChild(font);
									anchor = font;
									
									anchor.style.color = "rgb(" + red + ", " + green + ", " + blue + ");";
								}
							}
							
							if ($config.font === true && /font-family: ?"?'?[^"']+'?"?;?/.test(style))
							{
								var fontRegex = new RegExp('font-family: ?"?\'?([^"\']+)\'?"?;?');
								var fontName = style.match(fontRegex)[1];
								
								var inFontsList = Format.isInFontsList(fontName, $config.fontList);
								
								if (inFontsList === true)
								{
									var font = document.createElement('font');
									anchor.appendChild(font);
									anchor = font;
									
									anchor.style.fontFamily = fontName;
								}
							}
							
							if ($config.bold === true && /font-weight: ?bold;?/.test(style))
							{
								var b = document.createElement('b');
								anchor.appendChild(b);
								anchor = b;
							}
							
							if ($config.italic === true && /font-style: ?italic;?/.test(style))
							{
								var i = document.createElement('i');
								anchor.appendChild(i);
								anchor = i;
							}
							
							if ($config.underline === true && /text-decoration: ?underline;?/.test(style))
							{
								var u = document.createElement('u');
								anchor.appendChild(u);
								anchor = u;
							}
							
							if ($config.strike === true && /text-decoration: ?line-through;?/.test(style))
							{
								var strike = document.createElement('strike');
								anchor.appendChild(strike);
								anchor = strike;
							}
							
							if (/font-weight: ?normal;?/.test(style))
							{
								var span = document.createElement('span');
								anchor.appendChild(span);
								anchor = span;
								span.style.fontWeight = "normal";
							}
						}
					}
					
					if (tagName !== 'pre')
					{
						console.log("C'est pas un bloc de code : " + tagName);
						
						var childNodes = $node.childNodes;
						
						for (var i = 0; i < childNodes.length; i++)
						{
							if (childNodes[i].className !== 'anchor')
								anchor.appendChild(Format.parseHtmlNode(childNodes[i], $config));
						}
					}
					else
						anchor.innerHTML = $node.innerText;
				}
				
				var nodeAttributes = $node.attributes;
				
				for (var i = 0; i < nodeAttributes.length; i++)
				{
					var name = nodeAttributes[i].name;
					
					if (attributes.indexOf(name) >= 0)
					{
						if (name === 'src')
						{
							var src = nodeAttributes[i].value;
							
							if (utils.isset(src) && src !== '' 
								&& (utils.isset(DataFilter.url(src)) 
									|| ($config.imgSecureURL !== '' && src.match($config.imgSecureURL))
									|| (imagesUploadModes.inlineData === true && utils.isset(DataFilter.base64(src)))))
							{
								if (/(.*\.jpg$|.*\.JPG$|.*\.jpeg$|.*\.JPEG$|.*\.png$|.*\.PNG$|.*\.gif$|.*\.GIF|.*\.svg$|.*\.SVG$)/.test(src)
									|| ($config.imgSecureURL !== '' && src.match($config.imgSecureURL))
									|| (imagesUploadModes.inlineData === true && /^data:image\/([0-9a-zA-Z]+);base64,/.test(src)))
								{
									result.setAttribute('src', nodeAttributes[i].value);
								}
							}
						}
						else if (name === 'href')
						{
							var href = nodeAttributes[i].value;
							
							if (utils.isset(href) && href !== '' && utils.isset(DataFilter.url(href)))
								result.setAttribute('src', nodeAttributes[i].value);
						}
						else if (name === 'class')
							result.setAttribute('class', nodeAttributes[i].value.replace('&#160;hljs', ''));
						else
							result.setAttribute(name, nodeAttributes[i].value);
					}
				}
			}
		}
		else
			result = document.createTextNode($node.textContent);
		
		return result;
	},
	
	purgeNodeStyle: function($node, $config)
	{
		//var result = document.createElement('p');
		var result = document.createTextNode('');
		
		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var tagName = $node.tagName;
			
			if (utils.isset(tagName) && tagName !== "")
				tagName = $node.tagName.toLowerCase();
			
			if (utils.isset(tagName))
			{
				// Cas des blocs
				if (tagName === 'div' || tagName === 'p' || tagName === 'ul' || tagName === 'ol' || tagName === 'table' || tagName === 'blockquote' || tagName === 'pre' 
					|| tagName === 'h1'|| tagName === 'h2'|| tagName === 'h3'|| tagName === 'h4'|| tagName === 'h5'|| tagName === 'h6')
				{
					if (tagName === 'div')
						result = document.createElement('div');
					else
						result = document.createElement('p');
					
					if (utils.isset($node.childNodes))
					{
						var childNodes = $node.childNodes;
						
						for (var i = 0; i < childNodes.length; i++)
						{
							if (childNodes[i].className !== 'anchor')
							{
								var childResult = Format.purgeNodeStyle(childNodes[i], $config);
								
								if (childResult.nodeType === Node.TEXT_NODE || (utils.isset(childResult.childNodes) && childResult.childNodes.length > 0))
									result.appendChild(childResult);
							}
						}
						
						if ($config.addAnchor === true)
						{
							if (utils.isset(result.childNodes) && result.childNodes.length > 0)
							{
								var anchorValue = (new Date()).getTime();
								var anchorSpan = document.createElement('span');
								anchorSpan.setAttribute('id', anchorValue);
								anchorSpan.setAttribute('class', 'anchor');
								result.insertBefore(anchorSpan, result.firstChild);
							}
						}
					}
				}
				else if (tagName === 'br')
					result = document.createElement('br');
				else
					result = document.createTextNode($node.textContent);
			}
		}
		else
			result = document.createTextNode($node.textContent);
		
		return result;
	},
	
	anchorOffset: 0,
	
	putAnchorIntoBBcode: function($node)
	{
		var code = '';
		var tagName = $node.tagName;
		
		if (utils.isset(tagName) && tagName !== "")
			tagName = $node.tagName.toLowerCase();
		
		if (tagName === 'div' || tagName === 'p' 
			|| tagName === 'li' || tagName === 'th' || tagName === 'td' 
			|| tagName === 'blockquote' || tagName === 'pre' 
			|| tagName === 'h1'|| tagName === 'h2'|| tagName === 'h3'|| tagName === 'h4'|| tagName === 'h5'|| tagName === 'h6')
		{
			var anchorId = 0;
			
			var anchorList = $node.getElementsByClassName('anchor');
			
			if (utils.isset(anchorList) && anchorList.length > 0 && anchorList[0] === $node.firstChild)
				anchorId = anchorList[0].getAttribute('id');
			else
			{
				anchorId = (new Date()).getTime() + "" + Format.anchorOffset;
				Format.anchorOffset++;
			}
			
			code = '[anchor]' + anchorId + '[/anchor]';
		}
		
		return code;
	},
	
	nodeToBBCode: function($node, $config)
	{
		var tags = ['div', 'p', 'span', 'br'];
		var attributes = ['title', 'class', 'type', 'id'];
		var colorsList = $config.colorsList;
		var imagesUploadModes = $config.imagesUploadModes;
		
		if ($config.bold === true)
		{
			tags.push('b');
			tags.push('strong');
		}
		
		if ($config.italic === true)
		{
			tags.push('i');
			tags.push('em');
		}
		
		if ($config.underline === true)
			tags.push('u');
		
		if ($config.strike === true)
		{
			tags.push('s');
			tags.push('strike');
		}
		
		if ($config.fontSize === true || $config.textColor === true)
			tags.push('font');
		
		if ($config.title === true)
		{
			tags.push('h1');
			tags.push('h2');
			tags.push('h3');
			tags.push('h4');
			tags.push('h5');
			tags.push('h6');
		}
		
		if ($config.quote === true)
			tags.push('blockquote');
		
		if ($config.code === true)
		{
			tags.push('pre');
			//tags.push('code');
		}
		
		if ($config.lists === true)
		{
			tags.push('ul');
			tags.push('ol');
			tags.push('li');
		}
		
		if ($config.tables === true)
		{
			tags.push('table');
			tags.push('tbody');
			tags.push('thead');
			tags.push('tfoot');
			tags.push('tr');
			tags.push('th');
			tags.push('td');
		}
		
		if ($config.links === true)
		{
			tags.push('a');
			attributes.push('href');
		}
		
		if ($config.images === true)
		{
			tags.push('img');
			attributes.push('src');
		}
		
		var result = "";
		
		if ($node.nodeType !== Node.TEXT_NODE)
		{
			var tagName = $node.tagName;
			
			if (utils.isset(tagName) && tagName !== "")
				tagName = $node.tagName.toLowerCase();
			
			//console.log("Tag name : " + tagName);
			
			if (utils.isset(tagName) && tags.indexOf(tagName) >= 0)
			{
				var open = "";
				var close = "";
				
				//if (utils.isset($node.childNodes) && $node.childNodes.length > 0)
				if (tagName !== 'img' && tagName !== 'br')
				{
					if (tagName === 'b' || tagName === 'strong')
					{
						open = "[b]";
						close = "[/b]";
					}
					else if (tagName === 'i' || tagName === 'em')
					{
						open = "[i]";
						close = "[/i]";
					}
					else if (tagName === 's' || tagName === 'strike')
					{
						open = "[s]";
						close = "[/s]";
					}
					else if (tagName === 'u')
					{
						open = "[u]";
						close = "[/u]";
					}
					else if (tagName === 'h1'|| tagName === 'h2'|| tagName === 'h3'|| tagName === 'h4'|| tagName === 'h5'|| tagName === 'h6')
					{
						open = '[' + tagName + ']';
						close = '[/' + tagName + ']';
						//open = '\n\n' + open;
						//close = close + '\n\n';
						
						//open = '\n' + open;
						close = close + '\n\n';
						
						if ($config.addAnchor === true)
							open = open + Format.putAnchorIntoBBcode($node);
					}
					else if (tagName === 'p'|| tagName === 'div')
					{
						//open = '\n\n';
						//close = '\n\n';
						
						//open = '\n';
						close = '\n\n';
						
						var style = $node.getAttribute('style');
						
						if ($config.addAnchor === true && (!utils.isset(style) || style === ''))
							open = open + Format.putAnchorIntoBBcode($node);
					}
					
					if (tagName === 'ul')
					{
						open = '[list]\n';
						close = '[/list]\n\n';
					}
					else if (tagName === 'ol')
					{
						open = '[list=1]\n';
						close = '[/list]\n\n';
					}
					else if (tagName === 'li')
						open = '[*]\n';
					else if (tagName === 'table')
					{
						open = '[table]\n';
						close = '[/table]\n\n';
					}
					else if (tagName === 'tr')
					{
						open = '[tr]\n';
						close = '[/tr]\n';
					}
					else if (tagName === 'th')
					{
						open = '[th]';
						close = '[/th]\n';
					}
					else if (tagName === 'td')
					{
						open = '[td]';
						close = '[/td]\n';
					}
					else if (tagName === 'blockquote')
					{
						open = '[quote]';
						close = '[/quote]\n\n';
					}
					else if (tagName === 'pre')
					{
						var className = $node.getAttribute('class');
						
						if (utils.isset(className))
							className = className.replace('&#160;hljs', '');
						
						open = '[code]';
						
						if (utils.isset(className) && /[a-z0-9-]+/.test(className))
						{
							className = className.replace('language-', '');
							open = '[code=' + className + ']';
						}
						
						close = '[/code]\n\n';
					}
					else if (tagName === 'a')
					{
						if (utils.isset(DataFilter.url($node.getAttribute('href'))))
						{
							open = '[url=' + $node.getAttribute('href') + ']';
							close = '[/url]';
						}
					}
					
					//if ($config.addAnchor === true)
					//	open = open + Format.putAnchorIntoBBcode($node);
					
					var style = $node.getAttribute('style');
					
					if (utils.isset(style) && style !== '')
					{
						if ($config.align === true && /text-align: ?justify;?/.test(style) && !/.*\[justify\]$/.test(open))
						{
							open = open + '[justify]';
							close = '[/justify]' + close;
							
							if ($config.addAnchor === true)
								open = open + Format.putAnchorIntoBBcode($node);
						}
						
						if ($config.align === true && /text-align: ?center;?/.test(style) && !/.*\[center\]$/.test(open))
						{
							open = open + '[center]';
							close = '[/center]' + close;
							
							if ($config.addAnchor === true)
								open = open + Format.putAnchorIntoBBcode($node);
						}
						
						if ($config.align === true && /text-align: ?right;?/.test(style) && !/.*\[right\]$/.test(open))
						{
							open = open + '[right]';
							close = '[/right]' + close;
							
							if ($config.addAnchor === true)
								open = open + Format.putAnchorIntoBBcode($node);
						}
						
						if ($config.align === true && /text-align: ?left;?/.test(style) && !/.*\[left\]$/.test(open))
						{
							open = open + '[left]';
							close = '[/left]' + close;
							
							if ($config.addAnchor === true)
								open = open + Format.putAnchorIntoBBcode($node);
						}
						
						if ($config.addAnchor === true && /.*\[\/anchor\]$/.test(open))
							open = open + Format.putAnchorIntoBBcode($node);
						
						if ($config.bold === true && /font-weight: ?bold;?/.test(style) && !/.*\[b\]$/.test(open))
						{
							open = open + '[b]';
							close = '[/b]' + close;
						}
						
						if ($config.italic === true && /font-style: ?italic;?/.test(style) && !/.*\[i\]$/.test(open))
						{
							open = open + '[i]';
							close = '[/i]' + close;
						}
						
						if ($config.underline === true && /text-decoration: ?underline;?/.test(style) && !/.*\[u\]$/.test(open))
						{
							open = open + '[u]';
							close = '[/u]' + close;
						}
						
						if ($config.strike === true && /text-decoration: ?line-through;?/.test(style) && !/.*\[s\]$/.test(open))
						{
							open = open + '[s]';
							close = '[/s]' + close;
						}
						
						if ($config.fontSize === true && /font-size: ?[0-9emEM.%]+;?/.test(style) && !/.*\[size=[0-9]+\]$/.test(open))
						{
							var fontSizeRegex = new RegExp("font-size: ?([0-9emEMpxPXptPT.%]+);?");
							var size = style.match(fontSizeRegex)[1];
							
							if (/[0-9.]+em/.test(size))
								open = open + '[size=' + (parseFloat(size.replace('em', ''))*100) + ']';
							else if (/[0-9]+%/.test(size))
								open = open + '[size=' + size.replace('%', '') + ']';
							else if (/[0-9]+px/.test(size))
								open = open + '[size=' + (Math.round(parseFloat(size.replace('em', ''))/10*100)) + ']';
							
							close = '[/size]' + close;
						}
						
						if ($config.font === true && /font-family:/.test(style))
						{
							//console.log("Style : " + style);
							
							if (/font-family: ?"?'?[^"']+"?'?;?/.test(style) && !/.*\[font=[^"']+\]$/.test(open))
							{
								var fontRegex = new RegExp('font-family: ?"?\'?([^"\']+)\'?"?;?');
								var fontName = style.match(fontRegex)[1];
								
								var inFontsList = Format.isInFontsList(fontName, $config.fontList);
								
								if (inFontsList === true)
								{
									open = open + '[font=' + fontName + ']';
									close = '[/font]' + close;
								}
							}
						}
						
						if ($config.textColor === true)
						{
							var colorHexRegex = new RegExp("([^-]color|^color): ?#([0-9a-fA-F]{6});?");
							var colorRgbRegex = new RegExp("([^-]color|^color): ?rgb\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}) ?\\);?");
							var colorRgbaRegex = new RegExp("([^-]color|^color): ?rgba\\(([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}), ?([0-9]{1,3}) ?\\);?");
							
							var matchColorHex = style.match(colorHexRegex);
							var matchColorRGB = style.match(colorRgbRegex);
							var matchColorRGBA = style.match(colorRgbaRegex);
							
							var inColorsList = false;
							
							if (utils.isset(matchColorHex))
							{
								var color = matchColorHex[2];
								var inColorsList = Colors.filterHex(color, colorsList);
								var equal = Colors.compare(color, $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									open = open + '[color=#' + color + ']';
									close = '[/color]' + close;
								}
							}
							else if (utils.isset(matchColorRGB))
							{
								var red = matchColorRGB[2];
								var green = matchColorRGB[3];
								var blue = matchColorRGB[4];
								var inColorsList = Colors.filterRGB(red, green, blue, colorsList);
								var equal = Colors.compare('rgb(' + red + ',' + green + ',' + blue + ')', $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									var color = Colors.rgbToHex(red, green, blue);
								
									open = open + '[color=#' + color + ']';
									close = '[/color]' + close;
								}
							}
							else if (utils.isset(matchColorRGBA))
							{
								var red = matchColorRGBA[2];
								var green = matchColorRGBA[3];
								var blue = matchColorRGBA[4];
								var inColorsList = Colors.filterRGB(red, green, blue, colorsList);
								var equal = Colors.compare('rgb(' + red + ',' + green + ',' + blue + ')', $config.defaultColor);
								
								if (inColorsList === true && equal === false)
								{
									var color = Colors.rgbToHex(red, green, blue);
								
									open = open + '[color=#' + color + ']';
									close = '[/color]' + close;
								}
							}
						}
					}
					
					var childNodes = $node.childNodes;
					
					for (var i = 0; i < childNodes.length; i++)
					{
						if (childNodes[i].className !== 'anchor')
							open = open + Format.nodeToBBCode(childNodes[i], $config);
					}
				}
				else
				{
					if (tagName === 'img')
					{
						var src = $node.getAttribute('src');
						
						if (utils.isset(src) && src !== '' 
							&& (utils.isset(DataFilter.url(src)) 
								|| ($config.imgSecureURL !== '' && src.match($config.imgSecureURL))
								|| (imagesUploadModes.inlineData === true && utils.isset(DataFilter.base64(src)))))
						{
							if (/(.*\.jpg$|.*\.JPG$|.*\.jpeg$|.*\.JPEG$|.*\.png$|.*\.PNG$|.*\.gif$|.*\.GIF|.*\.svg$|.*\.SVG$)/.test(src)
								|| ($config.imgSecureURL !== '' && src.match($config.imgSecureURL))
								|| (imagesUploadModes.inlineData === true && /^data:image\/([0-9a-zA-Z]+);base64,/.test(src)))
							{
								open = open + '[img]' + src + '[/img]';
							}
						}
					}
					else if (tagName === 'br')
						open = open + '\n';
				}
				
				result = result + open + close;
			}
		}
		else
			result = result + $node.textContent.replace(/\r/gi, '').replace(/\n/gi, '');
		
		//console.log("BB Code : " + result);
		
		result = result.replace(/\[anchor\][0-9]{1,}\[\/anchor\]\n/gi, '');
		result = result.replace(/\[anchor\][0-9]{1,}\[\/anchor\]\r/gi, '');
		
		return result;
	},
	
	bbCodeToHTML: function($message, $config)
	{
		var config = $config;
		var colorsList = $config.colorsList;
		var imagesUploadModes = $config.imagesUploadModes;
		
		var result = '<p>' + dataManager.encodeHTMLEntities($message) + '</p>';
		
		result = result.replace(/\r*/gi, '');
		
		if (config.keepBR !== true)
			result = result.replace(/\n{2,}/gi, '[br][br]');
		
		result = result.replace(/\n/gi, '[br]');
		
		//console.log(result);
		
		// Ancres
		if ($config.addAnchor === true)
			result = result.replace(/\[anchor\](.*?)\[\/anchor\]/gi, '<span id="$1" class="anchor" ></span>');
		
		result = result.replace(/\[br\]\[(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)/gi, '[$1');
		result = result.replace(/\[\/(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)\]\[br\]/gi, '[/$1]');
		result = result.replace(/\[(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)/gi, '</p>[$1');
		result = result.replace(/\[\/(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)\]/gi, '[/$1]<p>');
		result = result.replace(/\[\/(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)\]<p><\/p>\[(right|left|center|justify|h1|h2|h3|h4|h5|h6|code|quote|list|table)/gi, '[/$1][$2');
		
		//console.log(result);
		
		// Code
		if (config.code === true)
		{
			result = result.replace(/\[code=([a-zA-Z0-9]+?) hljs\]/gi, '[code=$1]');
			result = result.replace(/\[code=([a-zA-Z0-9]+?)&#160;hljs\]/gi, '[code=$1]');
			
			var matchCode = result.match(/\[code\](.*?)\[\/code\]/gi);
			
			if (utils.isset(matchCode) && matchCode.length > 0)
			{
				for (var i = 0; i < matchCode.length; i++)
				{
					var code = matchCode[i].replace('[code]', '').replace('[/code]', '');
					
					code = code.replace(/\[br\]/gi, '{br}');
					code = code.replace(/\[p\]/gi, '{br}');
					code = code.replace(/\[/gi, '{[}');
					code = code.replace(/\]/gi, '{]}');
					result = result.replace(matchCode[i], '<pre>' + code + '</pre>');
				}
			}
			
			matchCode = result.match(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi);
			
			if (utils.isset(matchCode) && matchCode.length > 0)
			{
				for (var i = 0; i < matchCode.length; i++)
				{
					var language = matchCode[i].replace(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi, '$1');
					var code = matchCode[i].replace(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi, '$2');
					
					code = code.replace(/\[br\]/gi, '{br}');
					code = code.replace(/\[p\]/gi, '{br}');
					code = code.replace(/\[/gi, '{[}');
					code = code.replace(/\]/gi, '{]}');
					result = result.replace(matchCode[i], '<pre class="language-' + language.toLowerCase() + '" >' + code + '</pre>');
				}
			}
		}
		
		// Sauts de ligne
		result = result.replace(/\[br\]\[br\]/gi, '</p><p>');
		result = result.replace(/\[p\]/gi, '</p><p>');
		result = result.replace(/\[br\]/gi, '<br />');
		result = result.replace(/\[br\/\]/gi, '<br />');
		
		// Alignement du texte
		if (config.align === true)
		{
			result = result.replace(/\[right\](.*?)\[\/right\]/gi, '<p style="text-align: right; " >$1</p>');
			result = result.replace(/\[left\](.*?)\[\/left\]/gi, '<p style="text-align: left; " >$1</p>');
			result = result.replace(/\[center\](.*?)\[\/center\]/gi, '<p style="text-align: center; " >$1</p>');
			result = result.replace(/\[justify\](.*?)\[\/justify\]/gi, '<p style="text-align: justify; " >$1</p>');
		}

		// Titres
		if (config.title === true)
		{
			result = result.replace(/\[h1\](.*?)\[\/h1\]/gi, '<h1>$1</h1>');
			result = result.replace(/\[h2\](.*?)\[\/h2\]/gi, '<h2>$1</h2>');
			result = result.replace(/\[h3\](.*?)\[\/h3\]/gi, '<h3>$1</h3>');
			result = result.replace(/\[h4\](.*?)\[\/h4\]/gi, '<h4>$1</h4>');
			result = result.replace(/\[h5\](.*?)\[\/h5\]/gi, '<h5>$1</h5>');
			result = result.replace(/\[h6\](.*?)\[\/h6\]/gi, '<h6>$1</h6>');
		}
		
		// Citations
		if (config.quote === true)
		{
			result = result.replace(/\[quote\](.*?)\[\/quote\]/gi, '<blockquote><p>$1</p></blockquote>');
			result = result.replace(/\[quote="(.*?)"\](.*?)\[\/quote\]/gi, '<blockquote><p class="user-name" >$1 ' + KEYWORDS.said + ':</p><p>$2</p></blockquote>');
		}
		
		// Listes à puces
		if (config.lists === true)
		{
			result = result.replace(/\n+\[\*\]/gi, '[*]');
			result = result.replace(/<br \/>\[\*\]/gi, '[*]');
			result = result.replace(/<br\/>\[\*\]/gi, '[*]');
			result = result.replace(/<br>\[\*\]/gi, '[*]');
			result = result.replace(/<\/p><p>\[\*\]/gi, '[*]');
			
			result = result.replace(/\n+\[\/list\]/gi, '[/list]');
			result = result.replace(/<br \/>\[\/list\]/gi, '[/list]');
			result = result.replace(/<br\/>\[\/list\]/gi, '[/list]');
			result = result.replace(/<br>\[\/list\]/gi, '[/list]');
			result = result.replace(/<\/p><p>\[\/list\]/gi, '[/list]');
			
			result = result.replace(/\[\*\]/gi, '[*][*]');
			result = result.replace(/\[\/list\]/gi, '[*][/list]');
			result = result.replace(/\[\*\](.+?)\[\*\]/gi, '<li>$1</li>');
			result = result.replace(/\[\*\]/gi, '');
			
			result = result.replace(/\[list\](.*?)\[\/list\]/gi, '<ul>$1</ul>');
			result = result.replace(/\[list=[0-9]+\](.*?)\[\/list\]/gi, '<ol>$1</ol>');
			result = result.replace(/\[list=[a-z]+\](.*?)\[\/list\]/gi, '<ol type="a" >$1</ol>');
			result = result.replace(/\[list=[A-Z]+\](.*?)\[\/list\]/gi, '<ol type="A" >$1</ol>');
		}
		
		// Tableaux
		if (config.tables === true)
		{
			result = result.replace(/\n+\[tr\]/gi, '[tr]');
			result = result.replace(/<br \/>\[tr\]/gi, '[tr]');
			result = result.replace(/<br\/>\[tr\]/gi, '[tr]');
			result = result.replace(/<br>\[tr\]/gi, '[tr]');
			result = result.replace(/<\/p><p>\[tr\]/gi, '[tr]');
			
			result = result.replace(/\n+\[\/tr\]/gi, '[/tr]');
			result = result.replace(/<br \/>\[\/tr\]/gi, '[/tr]');
			result = result.replace(/<br\/>\[\/tr\]/gi, '[/tr]');
			result = result.replace(/<br>\[\/tr\]/gi, '[/tr]');
			result = result.replace(/<\/p><p>\[\/tr\]/gi, '[/tr]');
			
			result = result.replace(/\n+\[th\]/gi, '[th]');
			result = result.replace(/<br \/>\[th\]/gi, '[th]');
			result = result.replace(/<br\/>\[th\]/gi, '[th]');
			result = result.replace(/<br>\[th\]/gi, '[th]');
			result = result.replace(/<\/p><p>\[th\]/gi, '[th]');
			
			result = result.replace(/\n+\[td\]/gi, '[td]');
			result = result.replace(/<br \/>\[td\]/gi, '[td]');
			result = result.replace(/<br\/>\[td\]/gi, '[td]');
			result = result.replace(/<br>\[td\]/gi, '[td]');
			result = result.replace(/<\/p><p>\[td\]/gi, '[td]');
			
			result = result.replace(/\n+\[\/table\]/gi, '[/table]');
			result = result.replace(/<br \/>\[\/table\]/gi, '[/table]');
			result = result.replace(/<br\/>\[\/table\]/gi, '[/table]');
			result = result.replace(/<br>\[\/table\]/gi, '[/table]');
			result = result.replace(/<\/p><p>\[\/table\]/gi, '[/table]');
			
			var matchTD = result.match(/\[td\](.*?)\[\/td\]/gi);
			
			if (utils.isset(matchTD) && matchTD.length > 0)
			{
				for (var i = 0; i < matchTD.length; i++)
				{
					var cell = matchTD[i].replace('[td]', '').replace('[/td]', '');
					
					if (/.*?(<br \/>|<br\/>|<br>|<p|<\/p>|<div|<\/div>|<h1|<\/h1>|<h2|<\/h2>|<h3|<\/h3>|<h4|<\/h4>|<h5|<\/h5>|<h6|<\/h6>|<ul|<\/ul>|<ol|<\/ol>|<li|<\/li>|<table|<\/table>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>|<blockquote|<\/blockquote>)+?.*?/.test(cell))
						result = result.replace(matchTD[i], '<td><p>' + cell + '</p></td>');
					else
						result = result.replace(matchTD[i], '<td>' + cell + '</td>');
				}
			}
			
			var matchTH = result.match(/\[th\](.*?)\[\/th\]/gi);
			
			if (utils.isset(matchTH) && matchTH.length > 0)
			{
				for (var i = 0; i < matchTH.length; i++)
				{
					var cell = matchTH[i].replace('[th]', '').replace('[/th]', '');
					
					if (/.*?(<br \/>|<br\/>|<br>|<p|<\/p>|<div|<\/div>|<h1|<\/h1>|<h2|<\/h2>|<h3|<\/h3>|<h4|<\/h4>|<h5|<\/h5>|<h6|<\/h6>|<ul|<\/ul>|<ol|<\/ol>|<li|<\/li>|<table|<\/table>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>|<blockquote|<\/blockquote>)+?.*?/.test(cell))
						result = result.replace(matchTH[i], '<th><p>' + cell + '</p></th>');
					else
						result = result.replace(matchTH[i], '<th>' + cell + '</th>');
				}
			}
			
			result = result.replace(/\[tr\](.+?)\[\/tr\]/gi, '<tr>$1</tr>');
			result = result.replace(/\[table\](.*?)\[\/table\]/gi, '<table>$1</table>');
		}
		
		// Taille du texte
		if (config.fontSize === true)
		{
			var matchSize = result.match(/\[size=(200|1[0-9][0-9]|[2-9][0-9])\](.*?)\[\/size\]/gi);
			
			if (utils.isset(matchSize) && matchSize.length > 0)
			{
				for (var i = 0; i < matchSize.length; i++)
				{
					var size = matchSize[i].replace(/\[size=(200|1[0-9][0-9]|[2-9][0-9])\](.*?)\[\/size\]/gi, '$1');
					var content = matchSize[i].replace(/\[size=(200|1[0-9][0-9]|[2-9][0-9])\](.*?)\[\/size\]/gi, '$2');
					
					if (/.*?(<br \/>|<br\/>|<br>|<p|<\/p>|<div|<\/div>|<h1|<\/h1>|<h2|<\/h2>|<h3|<\/h3>|<h4|<\/h4>|<h5|<\/h5>|<h6|<\/h6>|<ul|<\/ul>|<ol|<\/ol>|<li|<\/li>|<table|<\/table>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>|<blockquote|<\/blockquote>)+?.*?/.test(content))
						result = result.replace(matchSize[i], '</p><div style="font-size: ' + size + '%; " ><p>' + content + '</p></div><p>');
					else
						result = result.replace(matchSize[i], '<font style="font-size: ' + size + '%; " >' + content + '</font>');
				}
			}
		}
		
		// Couleur du texte
		if (config.textColor === true)
		{
			var matchColor = result.match(/\[color=#([0-9a-fA-F]{6})\](.*?)\[\/color\]/gi);
			
			if (utils.isset(matchColor) && matchColor.length > 0)
			{
				for (var i = 0; i < matchColor.length; i++)
				{
					var color = matchColor[i].replace(/\[color=#([0-9a-fA-F]{6})\](.*?)\[\/color\]/gi, '$1');
					var content = matchColor[i].replace(/\[color=#([0-9a-fA-F]{6})\](.*?)\[\/color\]/gi, '$2');
					var inColorsList = Colors.filterHex(color, colorsList);
					var equal = Colors.compare(color, $config.defaultColor);
					
					if (inColorsList === true && equal === false)
					{
						if (/.*?(<br \/>|<br\/>|<br>|<p|<\/p>|<div|<\/div>|<h1|<\/h1>|<h2|<\/h2>|<h3|<\/h3>|<h4|<\/h4>|<h5|<\/h5>|<h6|<\/h6>|<ul|<\/ul>|<ol|<\/ol>|<li|<\/li>|<table|<\/table>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>|<blockquote|<\/blockquote>)+?.*?/.test(content))
							result = result.replace(matchColor[i], '</p><div style="color: #' + color + '; " ><p>' + content + '</p></div><p>');
						else
							result = result.replace(matchColor[i], '<font style="color: #' + color + '; " >' + content + '</font>');
					}
					else
						result = result.replace(matchColor[i], content);
				}
			}
		}
		
		// Police du texte
		if (config.font === true)
		{
			var matchFont = result.match(/\[font=([^\]"'=><]*)\](.*?)\[\/font\]/gi);
			
			if (utils.isset(matchFont) && matchFont.length > 0)
			{
				for (var i = 0; i < matchFont.length; i++)
				{
					var font = matchFont[i].replace(/\[font=([^\]"'=><]*)\](.*?)\[\/font\]/gi, '$1').replace("&#160;", " ");
					var content = matchFont[i].replace(/\[font=([^\]"'=><]*)\](.*?)\[\/font\]/gi, '$2');
					
					var inFontsList = Format.isInFontsList(font, config.fontList);
					
					if (inFontsList === true)
					{
						if (/.*?(<br \/>|<br\/>|<br>|<p|<\/p>|<div|<\/div>|<h1|<\/h1>|<h2|<\/h2>|<h3|<\/h3>|<h4|<\/h4>|<h5|<\/h5>|<h6|<\/h6>|<ul|<\/ul>|<ol|<\/ol>|<li|<\/li>|<table|<\/table>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>|<blockquote|<\/blockquote>)+?.*?/.test(content))
							result = result.replace(matchFont[i], '</p><div style="font-family: \'' + font + '\'; " ><p>' + content + '</p></div><p>');
						else
							result = result.replace(matchFont[i], '<font style="font-family: \'' + font + '\'; " >' + content + '</font>');
					}
					else
						result = result.replace(matchFont[i], content);
					
					//console.log(content);
				}
			}
		}
		
		// Formatage du texte
		if (config.bold === true)
			result = result.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
		
		if (config.italic === true)
			result = result.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
		
		if (config.underline === true)
			result = result.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
		
		if (config.strike === true)
			result = result.replace(/\[s\](.*?)\[\/s\]/gi, '<strike>$1</strike>');
		
		// Liens
		if (config.links === true)
		{
			var matchLinks = result.match(/\[url\](.*?)\[\/url\]/gi);
			
			if (utils.isset(matchLinks) && matchLinks.length > 0)
			{
				for (var i = 0; i < matchLinks.length; i++)
				{
					var url = matchLinks[i].replace('[url]', '').replace('[/url]', '');
					
					//if (/^(https?|ftp|#):\/\/[^\s$.?#].[^\s]*$/.test(url))
					if (utils.isset(DataFilter.url(url)))
						result = result.replace(matchLinks[i], '<a href="' + url + '" >' + url + '</a>');
				}
			}
			
			matchLinks = result.match(/\[url=(.*?)\](.*?)\[\/url\]/gi);
			
			if (utils.isset(matchLinks) && matchLinks.length > 0)
			{
				for (var i = 0; i < matchLinks.length; i++)
				{
					var url = matchLinks[i].replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '$1');
					var title = matchLinks[i].replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '$2');
					
					//if (/^(https?|ftp|#):\/\/[^\s$.?#].[^\s]*$/.test(url))
					if (utils.isset(DataFilter.url(url)))
						result = result.replace(matchLinks[i], '<a href="' + url + '" title="' + title + '" >' + title + '</a>');
				}
			}
			
			matchLinks = result.match(/\[email\](.*?)\[\/email\]/gi);
			
			if (utils.isset(matchLinks) && matchLinks.length > 0)
			{
				for (var i = 0; i < matchLinks.length; i++)
				{
					var url = matchLinks[i].replace('[email]', '').replace('[/email]', '');
					
					if (/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(url))
						result = result.replace(matchLinks[i], '<a href="mailto:' + url + '" >' + url + '</a>');
				}
			}
		}
		
		// Image
		if (config.images === true)
		{
			var matchImg = result.match(/\[img\](.*?)\[\/img\]/gi);
			
			if (utils.isset(matchImg) && matchImg.length > 0)
			{
				for (var i = 0; i < matchImg.length; i++)
				{
					var url = matchImg[i].replace('[img]', '').replace('[/img]', '');
					
					//if (/^(https?|ftp|#):\/\/[^\s$.?#].[^\s]*$/.test(url))
					if (utils.isset(url) && url !== '' 
						&& (utils.isset(DataFilter.url(url)) 
							|| ($config.imgSecureURL !== '' && url.match($config.imgSecureURL))
							|| (imagesUploadModes.inlineData === true && utils.isset(DataFilter.base64(url)))))
					{
						if (/(.*\.jpg$|.*\.JPG$|.*\.jpeg$|.*\.JPEG$|.*\.png$|.*\.PNG$|.*\.gif$|.*\.GIF|.*\.svg$|.*\.SVG$)/.test(url)
							|| ($config.imgSecureURL !== '' && url.match($config.imgSecureURL))
							|| (imagesUploadModes.inlineData === true && /^data:image\/([0-9a-zA-Z]+);base64,/.test(url)))
						{
							result = result.replace(matchImg[i], '<img src="' + url + '" />');
							//result = result.replace(matchImg[i], '<img src="' + url + '" style="width: 500px; " />');
						}
					}
				}
			}
		}
		
		// Réarangement des blocks vides et des sauts de ligne
		
		if (config.keepBR !== true)
		{
			while (/<br \/><br \/>/.test(result))
				result = result.replace(/<br \/><br \/>/gi, '<br />');
			
			while (/<span id="[0-9]+" class="anchor" ><\/span><\/p>/.test(result))
				result = result.replace(/<span id="[0-9]+" class="anchor" ><\/span><\/p>/gi, '</p>');
		}
		else
		{
			while (/<p><span id="[0-9]+" class="anchor" ><\/span><\/p>/.test(result))
				result = result.replace(/<p><span id="[0-9]+" class="anchor" ><\/span><\/p>/gi, '<p></p>');
		}
		
		while (/<p([^>]*?)><br \/>/.test(result))
				result = result.replace(/<p([^>]*?)><br \/>/gi, '<p$1>');
		
		while (/<br \/><\/p>/.test(result))
				result = result.replace(/<br \/><\/p>/gi, '</p>');
		
		while (/<br \/><p([^>]*?)>/.test(result))
				result = result.replace(/<br \/><p([^>]*?)>/gi, '<p$1>');
		
		while (/<\/p><br \/>/.test(result))
				result = result.replace(/<\/p><br \/>/gi, '</p>');
		
		while (/<p><p/.test(result))
				result = result.replace(/<p><p/gi, '<p');
		
		while (/<\/p><\/p>/.test(result))
				result = result.replace(/<\/p><\/p>/gi, '</p>');
		
		if (config.keepBR !== true)
		{
			result = result.replace(/<p([^>]*?)><\/p>/gi, '');
			result = result.replace(/<p><\/p>/gi, '');
		}
		
		result = result.replace(/(<br \/>)+<\//gi, '</');
		result = result.replace(/<p([^>]*?)>(<br \/>)+/gi, '<p$1>');
		result = result.replace(/<div([^>]*?)>(<br \/>)+/gi, '<div$1>');
		result = result.replace(/<h1([^>]*?)>(<br \/>)+/gi, '<h1$1>');
		result = result.replace(/<h2([^>]*?)>(<br \/>)+/gi, '<h2$1>');
		result = result.replace(/<h3([^>]*?)>(<br \/>)+/gi, '<h3$1>');
		result = result.replace(/<h4([^>]*?)>(<br \/>)+/gi, '<h4$1>');
		result = result.replace(/<h5([^>]*?)>(<br \/>)+/gi, '<h5$1>');
		result = result.replace(/<h6([^>]*?)>(<br \/>)+/gi, '<h6$1>');
		result = result.replace(/<blockquote(.*?)>(<br \/>)+/gi, '<blockquote$1>');
		result = result.replace(/<ul([^>]*?)>(<br \/>)+/gi, '<ul$1>');
		result = result.replace(/<ol([^>]*?)>(<br \/>)+/gi, '<ol$1>');
		result = result.replace(/<li([^>]*?)>(<br \/>)+/gi, '<li$1>');
		result = result.replace(/<table([^>]*?)>(<br \/>)+/gi, '<table$1>');
		result = result.replace(/<tr([^>]*?)>(<br \/>)+/gi, '<tr$1>');
		result = result.replace(/<th([^>]*?)>(<br \/>)+/gi, '<th$1>');
		result = result.replace(/<td([^>]*?)>(<br \/>)+/gi, '<td$1>');
		result = result.replace(/<code([^>]*?)>(\{br\})+/gi, '<code$1>');
		
		result = result.replace(/<p([^>]*?)>/gi, '\n<p$1>');
		result = result.replace(/<\/p>/gi, '</p>\n');
		result = result.replace(/<div([^>]*?)>/gi, '\n<div$1>');
		result = result.replace(/<\/div>/gi, '</div>\n');
		result = result.replace(/<h1([^>]*?)>/gi, '\n<h1$1>');
		result = result.replace(/<\/h1>/gi, '</h1>\n');
		result = result.replace(/<h2([^>]*?)>/gi, '\n<h2$1>');
		result = result.replace(/<\/h2>/gi, '</h2>\n');
		result = result.replace(/<h3([^>]*?)>/gi, '\n<h3$1>');
		result = result.replace(/<\/h3>/gi, '</h3>\n');
		result = result.replace(/<h4([^>]*?)>/gi, '\n<h4$1>');
		result = result.replace(/<\/h4>/gi, '</h4>\n');
		result = result.replace(/<h5([^>]*?)>/gi, '\n<h5$1>');
		result = result.replace(/<\/h5>/gi, '</h5>\n');
		result = result.replace(/<h6([^>]*?)>/gi, '\n<h6$1>');
		result = result.replace(/<\/h6>/gi, '</h6>\n');
		result = result.replace(/<blockquote([^>]*?)>/gi, '\n<blockquote$1>');
		result = result.replace(/<\/blockquote>/gi, '</blockquote>\n');
		result = result.replace(/<ul([^>]*?)>/gi, '\n<ul$1>');
		result = result.replace(/<\/ul>/gi, '</ul>\n');
		result = result.replace(/<ol([^>]*?)>/gi, '\n<ol$1>');
		result = result.replace(/<\/ol>/gi, '</ol>\n');
		result = result.replace(/<li([^>]*?)>/gi, '\n<li$1>');
		result = result.replace(/<\/li>/gi, '</li>\n');
		result = result.replace(/<table([^>]*?)>/gi, '\n<table$1>');
		result = result.replace(/<\/table>/gi, '</table>\n');
		result = result.replace(/<tr([^>]*?)>/gi, '\n<tr$1>');
		result = result.replace(/<\/tr>/gi, '</tr>\n');
		result = result.replace(/<th([^>]*?)>/gi, '\n<th$1>');
		result = result.replace(/<\/th>/gi, '</th>\n');
		result = result.replace(/<td([^>]*?)>/gi, '\n<td$1>');
		result = result.replace(/<\/td>/gi, '</td>\n');
		
		result = result.replace(/\{br\}/gi, '<br />');
		result = result.replace(/\{\[\}/gi, '[');
		result = result.replace(/\{\]\}/gi, ']');
		
		//console.log("HTML : " + result);
		
		return result;
	},
	
	bbCodeToHTMLsimple: function($message)
	{
		var result = '<p>' + dataManager.encodeHTMLEntities($message) + '</p>';
		
		result = result.replace(/\r*/gi, '');
		result = result.replace(/\n{2,}/gi, '[br][br]');
		result = result.replace(/\n/gi, '[br]');
		
		//console.log(result);

		result = result.replace(/\[br\]\[(code|quote)/gi, '[$1');
		result = result.replace(/\[\/(code|quote)\]\[br\]/gi, '[/$1]');
		result = result.replace(/\[(code|quote)/gi, '</p>[$1');
		result = result.replace(/\[\/(code|quote)\]/gi, '[/$1]<p>');
		result = result.replace(/\[\/(code|quote)\]<p><\/p>\[(code|quote)/gi, '[/$1][$2');
		
		//console.log(result);
		
		// Code
		result = result.replace(/\[code=([a-zA-Z0-9]+?) hljs\]/gi, '[code=$1]');
		result = result.replace(/\[code=([a-zA-Z0-9]+?)&#160;hljs\]/gi, '[code=$1]');
		
		var matchCode = result.match(/\[code\](.*?)\[\/code\]/gi);
		
		if (utils.isset(matchCode) && matchCode.length > 0)
		{
			for (var i = 0; i < matchCode.length; i++)
			{
				var code = matchCode[i].replace('[code]', '').replace('[/code]', '');
				
				code = code.replace(/\[br\]/gi, '{br}');
				code = code.replace(/\[p\]/gi, '{br}');
				code = code.replace(/\[/gi, '{[}');
				code = code.replace(/\]/gi, '{]}');
				result = result.replace(matchCode[i], '<pre>' + code + '</pre>');
			}
		}
		
		matchCode = result.match(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi);
		
		if (utils.isset(matchCode) && matchCode.length > 0)
		{
			for (var i = 0; i < matchCode.length; i++)
			{
				var language = matchCode[i].replace(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi, '$1');
				var code = matchCode[i].replace(/\[code=([a-zA-Z0-9]+?)\](.*?)\[\/code\]/gi, '$2');
				
				code = code.replace(/\[br\]/gi, '{br}');
				code = code.replace(/\[p\]/gi, '{br}');
				code = code.replace(/\[/gi, '{[}');
				code = code.replace(/\]/gi, '{]}');
				result = result.replace(matchCode[i], '<pre class="language-' + language.toLowerCase() + '" >' + code + '</pre>');
			}
		}
		
		// Sauts de ligne
		result = result.replace(/\[br\]\[br\]/gi, '</p><p>');
		result = result.replace(/\[p\]/gi, '</p><p>');
		result = result.replace(/\[br\]/gi, '<br />');
		result = result.replace(/\[br\/\]/gi, '<br />');
		
		// Citations
		result = result.replace(/\[quote\](.*?)\[\/quote\]/gi, '<blockquote><p>$1</p></blockquote>');
		result = result.replace(/\[quote="(.*?)"\](.*?)\[\/quote\]/gi, '<blockquote><p class="user-name" >$1 ' + KEYWORDS.said + ':</p><p>$2</p></blockquote>');
		
		// Formatage du texte
		result = result.replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>');
		result = result.replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>');
		result = result.replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>');
		result = result.replace(/\[s\](.*?)\[\/s\]/gi, '<strike>$1</strike>');
		
		// Réarangement des blocks vides et des sauts de ligne
		while (/<br \/><br \/>/.test(result))
			result = result.replace(/<br \/><br \/>/gi, '<br />');
		
		while (/<span id="[0-9]+" class="anchor" ><\/span><\/p>/.test(result))
			result = result.replace(/<span id="[0-9]+" class="anchor" ><\/span><\/p>/gi, '</p>');
		
		while (/<p([^>]*?)><br \/>/.test(result))
				result = result.replace(/<p([^>]*?)><br \/>/gi, '<p$1>');
		
		while (/<br \/><\/p>/.test(result))
				result = result.replace(/<br \/><\/p>/gi, '</p>');
		
		while (/<br \/><p([^>]*?)>/.test(result))
				result = result.replace(/<br \/><p([^>]*?)>/gi, '<p$1>');
		
		while (/<\/p><br \/>/.test(result))
				result = result.replace(/<\/p><br \/>/gi, '</p>');
		
		while (/<p><p/.test(result))
				result = result.replace(/<p><p/gi, '<p');
		
		while (/<\/p><\/p>/.test(result))
				result = result.replace(/<\/p><\/p>/gi, '</p>');
		
		result = result.replace(/<p([^>]*?)><\/p>/gi, '');
		result = result.replace(/<p><\/p>/gi, '');
		
		result = result.replace(/(<br \/>)+<\//gi, '</');
		result = result.replace(/<p([^>]*?)>(<br \/>)+/gi, '<p$1>');
		result = result.replace(/<div([^>]*?)>(<br \/>)+/gi, '<div$1>');
		result = result.replace(/<blockquote(.*?)>(<br \/>)+/gi, '<blockquote$1>');
		result = result.replace(/<code([^>]*?)>(\{br\})+/gi, '<code$1>');
		
		result = result.replace(/<p([^>]*?)>/gi, '\n<p$1>');
		result = result.replace(/<\/p>/gi, '</p>\n');
		result = result.replace(/<div([^>]*?)>/gi, '\n<div$1>');
		result = result.replace(/<\/div>/gi, '</div>\n');
		result = result.replace(/<blockquote([^>]*?)>/gi, '\n<blockquote$1>');
		result = result.replace(/<\/blockquote>/gi, '</blockquote>\n');
		
		result = result.replace(/\{br\}/gi, '<br />');
		result = result.replace(/\{\[\}/gi, '[');
		result = result.replace(/\{\]\}/gi, ']');
		
		//console.log("HTML : " + result);
		
		return result;
	}, 
	
	numberToMoney: function($value, $currency, $round)
	{
		var valueToDisplay = 'null';
		
		if (utils.isset($value))
		{
			var language = 'en-US';
			
			if (/^fr.*/.test(Loader.getLanguage()) || /^FR.*/.test(Loader.getLanguage()) || /^Fr.*/.test(Loader.getLanguage()))
				language = 'fr-FR';
			
			var value = Math.round(100.0*$value)/100.0;
			var strValue = value + '';
			valueToDisplay = value.toLocaleString(language, { maximumSignificantDigits: strValue.length }) + ' ' + $currency;
			
			if (utils.isset($round) && $round > 0)
			{
				var nbDigit = strValue.replace(/^-/, '').length-1;
				var nb3digit = Math.floor(nbDigit/3.0);
				
				if ($round <= 1)
				{
					if (nb3digit >= 1)
					{
						var roundValue = Math.round(value/1000.0);
						var maximumSignificantDigits = (roundValue + '').length;
						valueToDisplay = roundValue.toLocaleString(language, { maximumSignificantDigits: maximumSignificantDigits }) + ' k' + $currency;
					}
				}
				else
				{
					if (nb3digit === 1)
					{
						var roundValue = Math.round(value/1000.0);
						var maximumSignificantDigits = (roundValue + '').length;
						valueToDisplay = roundValue.toLocaleString(language, { maximumSignificantDigits: maximumSignificantDigits }) + ' k' + $currency;
					}
					else if (nb3digit >= 2)
					{
						var roundValue = Math.round(value/100000.0)/10.0;
						var maximumSignificantDigits = (roundValue + '').length;
						valueToDisplay = roundValue.toLocaleString(language, { maximumSignificantDigits: maximumSignificantDigits }) + ' M' + $currency;
					}
				}
			}
		}
		
		return valueToDisplay;
	}
};

if (typeof Loader !== 'undefined' && Loader !== undefined && Loader !== null)
	Loader.hasLoaded("string");