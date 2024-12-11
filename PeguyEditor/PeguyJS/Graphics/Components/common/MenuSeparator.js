function MenuSeparator()
{
	///////////////
	// Attributs //
	///////////////
	

	var html = '<li class="menuSeparator" >'
					+ '<div></div>'
				+ '</li>';
				
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
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
	Loader.hasLoaded("menuSeparator");