function FreezeScreen($content)
{
	///////////////
	// Attributs //
	///////////////

	var content = $content;

	var html = '<div class="freezeScreen" >'
					+ '<div id="freezeScreenContent" class="freezeScreenContent" >' + content + '<div class="wall" ></div></div>'
					+ '<div class="wall" ></div>'
				+ '</div>';
				
	var component = new Component(html);
	
	//////////////
	// Méthodes //
	//////////////

	this.hide = function()
	{
		if (utils.isset(component) && utils.isset(component.parentNode))
			component.parentNode.removeChild(component);
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
		component.getById("freezeScreenContent").appendChild(component.stringToHtml(content));
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("freeze-screen");