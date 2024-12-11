function FilePreview($fileName, $fileType, $fileData)
{
	////////////////
	// Attributes //
	////////////////

	var fileName = $fileName;
	var fileType = $fileType;
	var fileData = $fileData;
	var selected = false;
	
	var html = '<li class="filePreview" >'
					+ '<div id="preview" class="preview" ></div>'
					+ '<div id="display" class="display" ></div>'
					+ '<div id="delete" class="delete" ></div>'
					+ '<div id="multipages" class="multipages" ></div>'
					+ '<div class="wall" ></div>'
				+ '</li>';

	var component = new Component(html);
	
	var preview = document.createElement('img');
	//preview.width = 30;
	preview.height = 200;
	component.getById('preview').appendChild(preview);
	
	var displayIcon = Loader.getSVG('icons', 'magnifying-glass-icon', 25, 25);
	component.getById('display').appendChild(displayIcon);
	
	var deleteIcon = Loader.getSVG('icons', 'black-close-icon', 25, 25);
	component.getById('delete').appendChild(deleteIcon);

	/////////////
	// Methods //
	/////////////
	
	this.createDefaultPreview = function($preview) {};
	this.createTextPreview = function($preview) {};
	this.createImagePreview = function($preview) {};
	this.createPDFpreview = function($preview) {};

	this.updatePreview = function()
	{
		if (/^image/.test(fileType))
			this.createImagePreview($this);
		else if (fileType === 'application/pdf')
			this.createPDFpreview($this);
		else
			this.createDefaultPreview($this);
	};

	this.select = function()
	{
		$this.onSelect($this);
		selected = true;
		component.addClass('selected');
	};

	this.unselect = function()
	{
		selected = false;
		component.removeClass('selected');
		$this.onUnselect($this);
	};
	
	/////////////////
	// Init events //
	/////////////////
	
	this.onSelect = function($preview) {};
	this.onUnselect = function($preview) {};
	this.onDelete = function($preview) {};
	
	component.getById('display').onClick = function()
	{
		if (/^image/.test(fileType))
		{
			var imagePopup = new ImagePopup(fileData, '');
			document.getElementById('main').appendChild(imagePopup);
		}
	};
	
	component.getById('delete').onClick = function() { $this.onDelete($this); };
	
	component.onMouseOver = function()
	{
		this.getById('display').style.display = 'block';
		this.getById('delete').style.display = 'block';
	};
	
	component.onMouseOut = function()
	{
		this.getById('display').style.display = 'none';
		this.getById('delete').style.display = 'none';
	};
	
	component.onClick = function()
	{
		if (selected === true)
			$this.unselect();
		else
			$this.select();
	};
	
	component.onDragStart = preview.onDragStart = function($event)
	{
		Events.preventDefault($event);
		Events.stopPropagation($event);
	};

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getFileName = function() { return fileName; };
	this.getFileData = function() { return fileData; };
	this.isSelected = function() { return selected; };
	this.getPreview = function() { return preview; };

	// SET

	this.setFileName = function($fileName) { fileName = $fileName; };
	this.setFileData = function($fileData) { fileData = $fileData; };
	//this.setSelected = function($selected) { selected = $selected; };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("filePreview");
