function InputFile($accept, $capture, $placeholder, $name, $multiple, $autoResize)
{
	///////////////
	// Attributs //
	///////////////
	
	var accept = $accept;
	var capture = $capture;
	var placeholder = $placeholder;
	var name = $name;
	var multiple = $multiple;
	var autoResize = $autoResize;
	var readonly = false;
	var files = [];
	var fileName = "";
	var fileData = "";
	var fileType = "";
	//var loadedFiles = 0;
	
	if (!utils.isset(multiple))
		multiple = false;

	if (!utils.isset(autoResize))
		autoResize = 20;

	var inputHTML = '<input type="file" id="input" ';
	
	if (utils.isset(name) && name !== '')
		inputHTML = inputHTML + 'name="' + name + '" ';
	else
	{
		name = 'input';
		inputHTML = inputHTML + 'name="input" ';
	}
	
	if (utils.isset(accept) && accept !== '')
		inputHTML = inputHTML + 'accept="' + accept + '" ';
	
	if (utils.isset(capture) && capture !== '')
		inputHTML = inputHTML + 'capture="' + capture + '" ';
	
	if (utils.isset(multiple) && multiple === true)
		inputHTML = inputHTML + 'multiple="multiple" ';
	
	inputHTML = inputHTML + ' />';

	var html = '<div class="inputFile" >'
					+ '<div class="input" >'
						+ '<form id="form" target="iframe" method="post" enctype="multipart/form-data" >'
							+ inputHTML
						+ '</form>'
						+ '<label for="input" id="mask" class="mask" >'
							+ '<span id="icon" ></span>'
							+ '<span id="placeholder" >' + placeholder + '</span>'
							+ '<div class="wall" ></div>'
						+ '</label>'
					+ '</div>'
					+ '<div id="preview" class="preview" ></div>'
					+ '<div class="wall" ></div>'
				+ '</div>';

	var component = new Component(html);
	
	var pdfIcon = Loader.getSVG('icons', 'pdf-icon', 30, 30);
	
	//////////////
	// Méthodes //
	//////////////
	
	this.focus = function()
	{
		$this.clear();
		//component.getById('mask').style.display = 'none';
	};
	
	this.blur = function()
	{
		//component.getById('mask').style.display = 'block';
	};
	
	this.clear = function()
	{
		component.getById('form').reset();
		component.getById('preview').removeAllChildren();
		$this.autoResize();
	};
	
	var updatePreview = function($url)
	{
		var img = document.createElement('img');
		img.width = 30;
		img.height = 30;
		img.src = $url;
		
		//var iconSize = $this.getById('icon').offsetWidth;
		//var placeholderSize = $this.getById('placeholder').offsetWidth;
		//$this.style.width = (iconSize + placeholderSize + 44) + 'px';
		//$this.style.minWidth = (iconSize + placeholderSize + 44) + 'px';
		
		resize();
		
		component.getById('preview').appendChild(img);
	};
	
	var resize = function()
	{
		var iconSize = $this.getById('icon').offsetWidth;
		var placeholderSize = $this.getById('placeholder').offsetWidth;
		$this.style.width = (iconSize + placeholderSize + 44) + 'px';
		$this.style.minWidth = (iconSize + placeholderSize + 44) + 'px';
	};
	
	/*
	this.sendTo = function($url, $params, $callback)
	{
		if (utils.isset($callback))
			onLoad = $callback;
		else
			onLoad = function($value) {};
		
		component.getById('hidden-input').removeAllChildren();
		
		for (key in $params)
		{
			var input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', key);
			input.setAttribute('value', $params[key]);
			component.getById('hidden-input').appendChild(input);
		}
		
		component.getById('form').setAttribute('action', $url);
		
		component.getById('form').submit();
	};
	//*/
	
	this.autoResize = function()
	{
		var iconSize = $this.getById('icon').offsetWidth;
		var placeholderSize = $this.getById('placeholder').offsetWidth;
		
		if (utils.isset(autoResize) && autoResize > 0)
		{
			if (iconSize <= 0 && placeholderSize <= 0)
				setTimeout(function() { $this.autoResize(); }, autoResize);
			else
			{
				$this.style.width = (iconSize + placeholderSize + 12) + 'px';
				$this.style.minWidth = (iconSize + placeholderSize + 12) + 'px';
			}
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onFocus = function() {};
	this.onChange = function($value) {};
	this.onBlur = function() {};
	
	component.getById('input').onfocus = function()
	{
		Components.focusAllInputText();
		$this.onFocus();
	};
	
	component.getById('input').onblur = function()
	{
		Components.blurAllInputText();
		$this.onBlur();
	};
	
	var onChange = function()
	{
		//loadedFiles++;
		
		//if (loadedFiles >= document.forms['form' + $this.getId()][name].files.length)
			$this.onChange(fileData);
	};
	
	component.getById('input').onChange = function()
	{ 
		//loadedFiles = 0;
		
		if (document.forms['form' + $this.getId()][name].files.length > 0)
		{
			if (multiple === true)
			{
				files = [];
				fileName = [];
				fileData = [];
				fileType = [];
			}
			
			Files.drop({ dataTransfer: { effectAllowed: 'all', files: document.forms['form' + $this.getId()][name].files } }, function($files)
			{
				for (var i = 0; i < $files.length; i++)
				{
					var file = $files[i];
					
					if (multiple === true)
					{
						files.push(file);
						fileName.push(file.name);
						fileType.push(file.type);
						fileData.push(file.data);
					}
					else
					{
						files = file;
						fileName = file.name;
						fileType = file.type;
						fileData = file.data;
					}
				}
				
				//if ($files.length === 1)
				if ($files.length === 1 && multiple !== true)
				{
					if (/^image/.test($files[0].type))
						updatePreview($files[0].data);
					else if (/^application\/pdf/.test($files[0].type))
					{
						resize();
						component.getById('preview').appendChild(pdfIcon);
					}
				}
				
				onChange();
			});
		}
		else
			$this.onChange("");
	};
	
	/*
	var onLoad = function($value) {};
	
	Components.iframeOnload[component.getId()] = function()
	{
		console.log("Réponse à l'envoie de fichier : ");
		console.log(component.getById('iframe'));
	};
	//*/
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getAccept = function() { return accept; };
	this.getCapture = function() { return capture; };
	this.getPlaceholder = function() { return placeholder; };
	this.getName = function() { return name; };
	this.isReadOnly = function() { return readonly; };
	this.getFiles = function() { return files; };
	this.getFileData = function() { return fileData; };
	this.getFileType = function() { return fileType; };
	this.getFileName = function() { return fileName; };

	// SET
	
	this.setAccept = function($accept)
	{
		accept = $accept;
		component.getById('input').setAttribute('accept', accept);
	};
	
	this.setCapture = function($capture)
	{
		capture = $capture;
		component.getById('input').setAttribute('capture', capture);
	};
	
	this.setPlaceholder = function($placeholder)
	{
		placeholder = $placeholder;
		component.getById('placeholder').removeAllChildren();
		component.getById('placeholder').appendChild(document.createTextNode(placeholder));
	};
	
	this.setName = function($name)
	{
		name = $name;
		component.getById('input').setAttribute('name', name);
	};
	
	this.setReadonly = function($readonly)
	{
		readonly = $readonly;
		
		if (readonly === true)
			component.getById('input').setAttribute('readonly', 'readonly');
		else
			component.getById('input').removeAttribute('readonly');
	};
	
	this.remove = function() { Components.removeInputText($this); };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Components.addInputText($this);
	
	if (utils.isset(autoResize) && autoResize > 0)
		setTimeout(function() { $this.autoResize(); }, autoResize);
	
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("inputFile");