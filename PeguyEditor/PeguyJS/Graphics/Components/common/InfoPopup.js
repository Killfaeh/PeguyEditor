function InfoPopup($content)
{
	///////////////
	// Attributs //
	///////////////

	var content = $content;

	var html = '<div class="infoBlock" >'
					+ '<div id="infoContent" class="infoContent" >' + content + '</div>'
					+ '<div id="infoButtons" class="infoButtons" >'
						+ '<input type="button" id="close" value="' + KEYWORDS.close + '" />'
					+ '</div>'
				+ '</div>';

	var popup = new Popup(html);

	//////////////
	// Méthodes //
	//////////////

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onClose = function() {};
	popup.onHide = function() { $this.onClose(); };
	popup.getById("close").onClick = function() { $this.hide(); };

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
	Loader.hasLoaded("infoPopup");