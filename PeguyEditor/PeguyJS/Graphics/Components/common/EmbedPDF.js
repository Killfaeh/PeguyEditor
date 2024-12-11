function EmbedPDF($url, $width, $height)
{
	///////////////
	// Attributs //
	///////////////
	
	var url = $url;
	var width = $width;
	var height = $height;

	var html = '<div class="embedPDF" >' 
					+ '<object data="' + url + '" type="application/pdf" width="' + width + 'px" height="' + height + 'px" >'
						+ '<embed src="' + url + '" type="application/pdf" >'
							+ '<p>No PDF support.</p>'
						+ '</embed>'
					+ '</object>'
				+ '</div>';

	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("embedPDF");