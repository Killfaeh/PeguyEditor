function EditCommandsBar()
{
	///////////////
	// Attributs //
	///////////////

	var html = '<div class="editCommandsBar" >'
					+ '<div id="viewMode" class="viewMode" >'
						+ '<span id="editIcon" ></span>'
					+ '</div>'
					+ '<div id="editMode" class="editMode" >'
						+ '<span id="saveIcon" ></span>'
						+ '<span id="closeIcon" ></span>'
					+ '</div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var editIcon = Loader.getSVG('icons', 'edit-icon', 17, 17);
	var saveIcon = Loader.getSVG('icons', 'save-icon', 17, 17);
	var closeIcon = Loader.getSVG('icons', 'close-icon', 17, 17);
	
	editIcon.setAttribute("title", KEYWORDS.edit);
	saveIcon.setAttribute("title", KEYWORDS.save);
	closeIcon.setAttribute("title", KEYWORDS.close);
	
	//component.getById('viewMode').appendChild(editIcon);
	//component.getById('editMode').appendChild(saveIcon);
	//component.getById('editMode').appendChild(closeIcon);
	
	component.getById('editIcon').appendChild(editIcon);
	component.getById('saveIcon').appendChild(saveIcon);
	component.getById('closeIcon').appendChild(closeIcon);
	
	//saveIcon.style.display = 'none';
	component.getById('saveIcon').style.display = 'none';
	
	var editMode = false;
	var changed = false;
	
	//////////////
	// Méthodes //
	//////////////

	var editModeOn = function()
	{
		editMode = true;
		component.getById('viewMode').style.display = 'none';
		component.getById('editMode').style.display = 'inline-block';
		$this.onEditModeOn();
	};
	
	this.editModeOn = function() { editModeOn(); };
	
	var editModeOff = function()
	{
		editMode = false;
		component.getById('viewMode').style.display = 'inline-block';
		component.getById('editMode').style.display = 'none';
		$this.setChanged(false);
		$this.onEditModeOff();
	};
	
	this.editModeOff = function() { editModeOff(); };
	
	this.close = function()
	{
		if (changed === true)
		{
			$this.onCloseWhileNotSaved(function($close)
			{
				if ($close === true)
					editModeOff();
			});
		}
		else
			editModeOff();
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onCloseWhileNotSaved = function($callback) { $callback(true); };
	this.onEditModeOn = function() {};
	this.onEditModeOff = function() {};
	//this.onChange = function() {};
	this.onSave = function($callback) { $callback(true); };
	
	editIcon.onClick = function() { editModeOn(); };
	
	saveIcon.onClick = function()
	{
		$this.onSave(function($saved)
		{
			if ($saved === true)
			{
				$this.setChanged(false);
				editModeOff();
			}
		});
	};
	
	closeIcon.onClick = function() { $this.close(); };
	
	component.getById('editIcon').onToolTip = KEYWORDS.edit;
	component.getById('saveIcon').onToolTip = KEYWORDS.save;
	component.getById('closeIcon').onToolTip = KEYWORDS.close;

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isEditMode = function() { return editMode; };
	this.isChanged = function() { return changed; };
	
	// SET
	
	this.setChanged = function($changed)
	{
		changed = $changed; 
		
		if (changed === true)
			component.getById('saveIcon').style.display = 'inline-block';
			//saveIcon.style.display = 'inline';
		else
			component.getById('saveIcon').style.display = 'none';
			//saveIcon.style.display = 'none';
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("editCommandsBar");