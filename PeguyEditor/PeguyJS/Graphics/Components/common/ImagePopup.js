function ImagePopup($url, $title)
{
	///////////////
	// Attributs //
	///////////////

	var url = $url;
	var title = $title;
	var zoom = false;

	var html = '<div class="imagePopup" >'
					+ '<img id="img" class="img" src="' + url + '" alt="' + title + '" title="' + title + '" />'
					+ '<div id="closeIcon" class="close" ></div>'
					+ '<div class="wall" ></div>'
				+ '</div>';
				
	var component = new Component(html);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
	component.getById('closeIcon').appendChild(closeIcon);
	
	//var popupMouseDown = false;
	var innerMouseDown = false;
	
	//////////////
	// Méthodes //
	//////////////

	this.onHide = function() { return true; };

	this.hide = function()
	{
		setTimeout(function()
		{
			var confirmHide = $this.onHide();
		
			if (confirmHide !== false)
			{
				if (utils.isset(component) && utils.isset(component.parentNode))
					component.parentNode.removeChild(component);
				
				if (utils.isset($this.blur) && $this instanceof Window)
					$this.blur();
					
				Components.removePopup($this);
			}
			
		}, 50);
	};
	
	this.close = this.hide;

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	this.onLoad = function() {};
	
	component.getById('img').onload = function() { $this.onLoad(); };

	component.getById('closeIcon').onClick = this.hide;

	this.onInnerClick = function() {};

	if (Loader.getMode() === 'classic')
	{
		component.getById('img').onMouseDown = function()
		{
			//popupMouseDown = true;
			innerMouseDown = true;
		};
		
		component.getById('img').onClick = function()
		{
			$this.onInnerClick();
			//popupMouseDown = false;
			innerMouseDown = false;
		};
	
		//component.onMouseDown = function() { popupMouseDown = true; };
	
		component.onClick = function()
		{
			if (innerMouseDown === false)
				this.hide();
	
			//popupMouseDown = false;
			innerMouseDown = false;
		};
	}

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getUrl = function() { return url; };
	this.getTitle = function() { return title; };
	this.getZoom = function() { return zoom; };
	this.isInnerMouseDown = function() { return innerMouseDown; };
	
	// SET
	this.setUrl = function($url)
	{
		url = $url;
		component.getById('img').src = url;
	};
	
	this.setTitle = function($title)
	{
		title = $title;
		component.getById('img').setAttribute('title', title);
		component.getById('img').setAttribute('alt', title);
	};
	
	this.setZoom = function($zoom) { zoom = $zoom; };
	
	this.setInnerMouseDown = function($innerMouseDown) { innerMouseDown = $innerMouseDown; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	Components.addPopup($this);
	$this.focus();
	return $this; 
}

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("imagePopup");