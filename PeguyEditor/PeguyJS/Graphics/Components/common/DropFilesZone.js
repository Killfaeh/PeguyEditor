function DropFilesZone($accept)
{
	////////////////
	// Attributes //
	////////////////
	
	var accept = $accept;
	var multiSelect = true;
	
	var html = '<div id="dropFilesZone" class="dropFilesZone" >'
					+ '<div id="background" class="background" >'
						+ '<p id="message" class="message" >' + KEYWORDS.dropFilesInThisArea  + '<br /><br /></p>'
						+ '<div class="wall" ></div>'
					+ '</div>'
					+ '<ul id="filesList" class="filesList" ></ul>'
				+ '</div>';

	var component = new Component(html);
	
	var uploadIcon = Loader.getSVG('icons', 'upload-icon', 300, 300);
	component.getById('message').appendChild(uploadIcon);
	
	var previewList = [];

	/////////////
	// Methods //
	/////////////

	this.addPreview = function($preview)
	{
		var index = previewList.indexOf($preview);

		if (index < 0)
		{
			previewList.push($preview);
			component.getById('filesList').appendChild($preview);
			
			if (utils.isset($preview.setParent))
				$preview.setParent($this);
		}
		
		$preview.onSelect = function($preview)
		{
			if (multiSelect !== true)
				$this.unselectAll();
			
			setTimeout(function() { onSelectFiles(); }, 50);
		};
		
		$preview.onUnselect = function($preview) { onSelectFiles(); };
		$preview.onDelete = function($preview) { confirmDeleteOneFile($preview); };
		
		$preview.createDefaultPreview = function($preview) { $this.createDefaultPreview($preview); };
		$preview.createTextPreview = function($preview) { $this.createTextPreview($preview); };
		$preview.createImagePreview = function($preview) { $this.createImagePreview($preview); };
		$preview.createPDFpreview = function($preview) { $this.createPDFpreview($preview); };
		$preview.updatePreview();
		
		component.getById('background').style.display = 'none';
		onSelectFiles();
	};

	this.insertPreviewInto = function($preview, $index)
	{
		var index = previewList.indexOf($preview);

		if (index < 0)
			previewList.splice(index, 1);

		previewList.splice(index, 0, $preview);
		component.getById('filesList').insertAt($preview, $index);
		
		if (utils.isset($preview.setParent))
			$preview.setParent($this);
		
		$preview.onSelect = function($preview)
		{
			if (multiSelect !== true)
				$this.unselectAll();
			
			setTimeout(function() { onSelectFiles(); }, 50);
		};
		
		$preview.onUnselect = function($preview) { onSelectFiles(); };
		$preview.onDelete = function($preview) { confirmDeleteOneFile($preview); };
		
		$preview.createDefaultPreview = function($preview) { $this.createDefaultPreview($preview); };
		$preview.createTextPreview = function($preview) { $this.createTextPreview($preview); };
		$preview.createImagePreview = function($preview) { $this.createImagePreview($preview); };
		$preview.createPDFpreview = function($preview) { $this.createPDFpreview($preview); };
		$preview.updatePreview();
		
		component.getById('background').style.display = 'none';
		onSelectFiles();
	};

	this.removePreview = function($preview)
	{
		var index = previewList.indexOf($preview);

		if (index >= 0)
		{
			previewList.splice(index, 1);

			if (utils.isset($preview.parentNode))
				$preview.parentNode.removeChild($preview);
			
			if (utils.isset($preview.setParent))
				$preview.setParent(null);
		}
		
		if (previewList.length > 0)
			component.getById('background').style.display = 'none';
		else
			component.getById('background').style.display = 'block';
		
		onSelectFiles();
	};

	this.removeAllPreview = function()
	{
		previewList = [];
		component.getById('filesList').removeAllChildren();
		component.getById('background').style.display = 'block';
		onSelectFiles();
	};

	this.unselectAll = function()
	{
		for (var i = 0; i < previewList.length; i++)
			previewList[i].unselect();
		
		onSelectFiles();
	};
	
	var confirmDeleteOneFile = function($preview)
	{
		var confirmPopup = new ConfirmPopup('<div>'
												+ '<p>' + KEYWORDS.areYouSureYouWantToRemoveThisFileFromTheList + '</p>'
											+ '</div>', true);
		
		confirmPopup.onOk = function() 
		{
			$this.removePreview($preview);
			$this.onRemoveFiles([$preview]);
			onSelectFiles();
			return true;
		};
		
		document.getElementById('main').appendChild(confirmPopup);
	};

	this.removeSelectedFiles = function()
	{
		var selectedFiles = [];
		
		for (var i = 0; i < previewList.length; i++)
		{
			if (previewList[i].isSelected() === true)
				selectedFiles.push(previewList[i]);
		}
		
		if (selectedFiles.length > 0)
		{
			var confirmPopup = new ConfirmPopup('<div>'
													+ '<p>' + KEYWORDS.areYouSureYouWantToRemoveSelectedFilesFromTheList + '</p>'
												+ '</div>', true);
			
			confirmPopup.onOk = function() 
			{
				for (var i = 0; i < selectedFiles.length; i++)
					$this.removePreview(selectedFiles[i]);
				
				$this.onRemoveFiles(selectedFiles);
				onSelectFiles();
				
				return true;
			};
			
			document.getElementById('main').appendChild(confirmPopup);
		}
	};

	var onDropFiles = function($event)
	{
		console.log("Execute onDropFiles...");
		
		Files.accept = accept;
		
		Files.drop($event, function($files)
		{
			$this.unselectAll();
			
			var newPreviews = [];
			
			for (var i = 0; i < $files.length; i++)
				newPreviews.push(new FilePreview($files[i].name, $files[i].type, $files[i].data));
			
			for (var i = 0; i < newPreviews.length; i++)
			{
				$this.addPreview(newPreviews[i]);
				newPreviews[i].select();
			}
			
			$this.onAddFiles(newPreviews);
			onSelectFiles();
		});
	};
	
	this.addFiles = function($files)
	{
		$this.unselectAll();
		
		var newPreviews = [];
		
		for (var i = 0; i < $files.length; i++)
			newPreviews.push(new FilePreview($files[i].name, $files[i].type, $files[i].data));
		
		for (var i = 0; i < newPreviews.length; i++)
		{
			$this.addPreview(newPreviews[i]);
			newPreviews[i].select();
		}
		
		$this.onAddFiles(newPreviews);
		onSelectFiles();
	};
	
	//// Générateurs d'aperçu ////
	
	this.createDefaultPreview = function($preview)
	{
		
	};
	
	this.createTextPreview = function($preview)
	{
		
	};
	
	this.createImagePreview = function($preview)
	{
		$preview.getPreview().src = $preview.getFileData();
	};
	
	this.createPDFpreview = function($preview)
	{
		
	};

	/////////////////
	// Init events //
	/////////////////
	
	this.onAddFiles = function($filesList) {};
	this.onRemoveFiles = function($filesList) {};
	this.onSelectFiles = function($fileList) {};
	
	var onSelectFiles = function()
	{
		var selectedFiles = [];
		
		for (var i = 0; i < previewList.length; i++)
		{
			if (previewList[i].isSelected() === true)
				selectedFiles.push(previewList[i]);
		}
		
		$this.onSelectFiles(selectedFiles);
	};
	
	component.onClick = function() { $this.unselectAll(); };
	
	component.onDrop = function($event) { Events.emit('onDropFiles', [$event]); };
	
	component.connect('onDropFiles', onDropFiles);

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.isMultiSelect = function() { return multiSelect; };
	this.getPreview = function() { return preview; };

	// SET
	
	this.setMultiSelect = function($multiSelect) { multiSelect = $multiSelect; };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("dropFilesZone");
