function SavePopup($content)
{
	///////////////
	// Attributs //
	///////////////
	
	var content = $content;
	
	var html = '<div class="confirmBlock" >'
					+ '<div id="confirmContent" class="confirmContent" >' + content + '</div>'
					+ '<div id="confirmButtons" class="confirmButtons" >'
						+ '<input type="button" class="cancel" id="dontsave" value="' + KEYWORDS.dontsave + '" />'
						+ '<input type="button" class="cancel" id="cancel" value="' + KEYWORDS.cancel + '" />'
						+ '<input type="button" class="save" id="save" value="' + KEYWORDS.save + '" />'
					+ '</div>'
				+ '</div>';
	
	var popup = new Popup(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onDontSave = function() { return true; };
	this.onCancel = function() {};
	this.onSave = function() { return true; };
	
	popup.getById("dontsave").onClick = function() 
	{
		var isOk = $this.onDontSave();
		
		if (isOk === true)
			$this.hide();
	};
	
	popup.getById("cancel").onClick = function() 
	{
		$this.onCancel();
		$this.hide();
	};
			
	popup.getById("save").onClick = function() 
	{
		var isOk = $this.onSave();
		
		if (isOk === true)
			$this.hide();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getContent = function() { return content; };
	
	// SET
	this.setContent = function($content)
	{
		content = $content;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(popup, this);
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("savePopup");