function ConfirmPopup($content, $yesNo)
{
	///////////////
	// Attributs //
	///////////////
	
	var content = $content;
	var yesNo = $yesNo;
	
	var html = '<div class="confirmBlock" >'
					+ '<div id="confirmContent" class="confirmContent" >' + content + '</div>'
					+ '<div id="confirmButtons" class="confirmButtons" >'
						+ '<input type="button" id="cancel" class="cancel" value="' + KEYWORDS.cancel + '" />'
						+ '<input type="button" id="ok" class="ok" value="' + KEYWORDS.ok + '" />'
					+ '</div>'
				+ '</div>';
	
	var popup = new Popup(html);
	
	if (yesNo === true)
	{
		popup.getById('cancel').value = KEYWORDS.no;
		popup.getById('ok').value = KEYWORDS.yes;
	}
	
	//////////////
	// Méthodes //
	//////////////
	
	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onCancel = function() {};
	this.onOk = function() { return true; };
	
	popup.getById('closeIcon').onClick = function()
	{
		$this.onCancel();
		$this.hide();
	};
	
	popup.getById("cancel").onClick = function() 
	{
		$this.onCancel();
		$this.hide();
	};
			
	popup.getById("ok").onClick = function() 
	{
		var isOk = $this.onOk();
		
		if (isOk === true)
			$this.hide();
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getContent = function() { return content; };
	
	// SET
	
	this.setCancelLabel = function($cancelLabel) { popup.getById("cancel").value = $cancelLabel; };
	this.setOkLabel = function($okLabel) { popup.getById("ok").value = $okLabel; };
	
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
	Loader.hasLoaded("confirmPopup");