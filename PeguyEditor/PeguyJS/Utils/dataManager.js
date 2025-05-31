
///////////////////////////////////////////////////
// Fonctions relatives au traitement des données //
///////////////////////////////////////////////////

var dataManager = 
{
	// Fonction qui vérifier si la chaîne de caractères est bien formattée JSON avant de l'interpréter 
	parseJSON: function($data)
	{
		var json = {};

		try
		{
			json = JSON.parse($data);
		}
		catch ($error)
		{
			json = {"error":$data};
		}

		return json;
	},
	
	// Transformer une chaîne de caractères en XML
	StringToXML: function($str)
	{
		if (window.ActiveXObject)
		{
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML($str);
		} 
		else 
		{
			var parser = new DOMParser();
			var doc = parser.parseFromString($str, 'text/xml');
		}
		return doc;
	}, 
	
	// Convertir des données URL en binaire
	dataURIToBinary: function($dataURI)
	{
		var base64Index = $dataURI.indexOf(';base64,') + ';base64,'.length;
		var base64 = $dataURI.substring(base64Index);
		var raw = window.atob(base64);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for(var i = 0; i < rawLength; i++)
			array[i] = raw.charCodeAt(i);
			
		return array;
	},
	
	// Convertir les données d'une image SVG en PNG
	svgDataToPNG: function($data, $callback)
	{
		var tmpImg = document.createElement('img');
		
		tmpImg.onload = function()
		{
			var tmpCanvas = new Canvas2D();
			
			tmpCanvas.style.position = "absolute";
			tmpCanvas.style.left = (-10*tmpImg.width) + "px";
			tmpCanvas.style.top = (-10*tmpImg.height) + "px";
			
			// Test
			//tmpCanvas.style.left = "0px";
			//tmpCanvas.style.top = "0px";
			
			document.getElementById('main').appendChild(tmpCanvas);
			
			var ratio = tmpImg.width/tmpImg.height;
			var imgWidth = tmpImg.width;
			var imgHeight = tmpImg.height;
			
			tmpCanvas.setWidth(imgWidth);
			tmpCanvas.setHeight(imgHeight);
			tmpCanvas.getContext().drawImage(tmpImg, 0, 0, imgWidth, imgHeight);
			
			var imgData = tmpCanvas.toDataURL('image/png', 0.9);
			
			$callback(imgData);
			
			document.getElementById('main').removeChild(tmpCanvas);
		};
		
		tmpImg.src = $data;
	},

	// Encoder les entitées HTML dans une chaîne de caractères
	encodeHTMLEntities: function($str)
	{
		var encodedStr = $str;
		
		if (utils.isset($str) && utils.isset($str.replace))
		{
			encodedStr = $str.replaceAll(/[\u00A0-\u9999<>\&]/g, function($char) { return '&#' + $char.charCodeAt(0) + ';'; });
			encodedStr = encodedStr.replaceAll(" ", "&#160;");
		}
		
		return encodedStr;
	},
	
	decodeHTMLEntities: function($html)
	{
		var decodedStr = $html;
		
		if (utils.isset($html))
		{
			var txt = document.createElement('textarea');
			txt.innerHTML = $html;
			decodedStr = txt.value;
		}
		
		return decodedStr;
	},
	
	toClipboard: function($data, $onSuccess, $onError)
	{
		if (!navigator.clipboard)
		{
			var textArea = document.createElement("textarea");
			textArea.value = $data;
			
			textArea.style.top = "-1000000000px";
			textArea.style.left = "-1000000000px";
			textArea.style.width = "100px";
			textArea.style.height = "100px";
			textArea.style.position = "absolute";
			
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			
			try
			{
				var successful = document.execCommand('copy');
				
				if (successful)
					$onSuccess();
				else
					$onError({});
			}
			catch ($error) { $onError($error); }
			
			document.body.removeChild(textArea);
		}
		else
		{
			navigator.clipboard.writeText($data).then(function() { $onSuccess(); }, function($error) { $onError($error); });
		}
	}
};

////////////////////////////////////////////////
// Fonction de filtrage et typage des données //
////////////////////////////////////////////////

var DataFilter = 
{
	numeric: function($data)
	{
		if (isNaN($data))
			return null;
		else
			return parseFloat($data);
	},
	
	integer: function($data)
	{
		if (Number.isInteger($data) || /[0-9]+/.test($data))
			return parseInt($data); 
		else
			return null;
	},
	
	boolean: function($data)
	{
		if (typeof $data === "boolean")
			return $data;
		else if ($data <= 0)
			return false
		else if ($data > 0)
			return true;
		else
			return null;
	},
	
	string: function($data)
	{
		if (typeof $data === "string")
			return $data;
		else
			return null;
	},
	
	stringNoHTML: function($data)
	{
		var encodedStr = null;
		
		if (utils.isset($data) && utils.isset($data.replace))
		{
			encodedStr = $data.replace(/[\u00A0-\u9999<>\&]/g, function($char) { return '&#' + $char.charCodeAt(0) + ';'; });
			encodedStr = encodedStr.replace(" ", "&#160;");
		}
		
		return encodedStr;
	},
	
	ASCII: function($data)
	{
		if (typeof $data === "string" && /^[0-9a-zA-Z]+$/.test($data))
			return $data;
		else
			return null;
	},
	
	date: function($data)
	{
		if (typeof $data === "string" && /^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/.test($data))
			return $data;
		else
			return null;
	},
	
	dateTime: function($data)
	{
		if (typeof $data === "string" && /^[0-9]{4}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$|^[0-9]{4}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]\.[0-9]*$/.test($data))
			return $data;
		else
			return null;
	},
	
	time: function($data)
	{
		if (typeof $data === "string" && /^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$|^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\.[0-9]*$/.test($data))
			return $data;
		else
			return null;
	},
	
	year: function($data)
	{
		if (typeof $data === "string" && /^[0-9]{4}$/.test($data))
			return $data;
		else
			return null;
	},
	
	mail: function($data)
	{
		if (typeof $data === "string" && /^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{1,16}$/.test($data))
			return $data;
		else
			return null;
	},
	
	url: function($data)
	{
		//if (typeof $data === "string" && /^(((https?|ftp|#):\/\/(w{3}\.)?)(?<!www)(\w+-?)*\.([a-z]{2,4}))$/.test($data))
		//if (typeof $data === "string" && /^(https?|ftp|#):\/\/(w{3}\.)?/.test($data))
		if (typeof $data === "string" && /^(ftp|http|https):\/\/[^ "]+$/.test($data))
			return $data;
		else
			return null;
	},
	
	base64: function($data)
	{
		//if (typeof $data === "string" && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test($data))
		if (typeof $data === "string" && /^data:[0-9a-zA-Z*]+\/[0-9a-zA-Z*]+;base64,[A-Za-z0-9+/=]+$/.test($data))
			return $data;
		else
			return null;
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("dataManager");