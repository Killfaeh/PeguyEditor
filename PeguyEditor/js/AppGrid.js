function AppGrid()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="appGrid" >'
				+ '<div id="leftPanel" class="leftPanel" >'
					+ '<div id="openAssets" class="openAssets" ></div>'
					+ '<div id="leftLeftPanel" class="leftPanel" >'
					+ '</div>'
					+ '<div id="centerPanel" class="centerPanel" >'
					+ '</div>'
				+'</div>'
				+ '<div id="rightPanel" class="rightPanel" >'
				+ '</div>'
			+ '</div>';
	
	var component = new Component(html);
	
	var slide1 = new HorizontalSlide(component.getById('leftPanel'), component.getById('rightPanel'), 250);
	var slide2 = new HorizontalSlide(component.getById('leftLeftPanel'), component.getById('centerPanel'), 250);
	
	component.appendChild(slide1);
	component.getById('leftPanel').appendChild(slide2);

	var closeIcon = Loader.getSVG('icons', 'right-double-arrow-icon', 15, 15);
	var openIcon = Loader.getSVG('icons', 'left-double-arrow-icon', 15, 15);

	component.getById('openAssets').appendChild(closeIcon);
	component.getById('openAssets').appendChild(openIcon);
	
	openIcon.style.display = 'none';
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	slide1.onDrag = function() { viewManager.resize(); };
	slide2.onDrag = function() { viewManager.resize(); };

	var oldPosition = "0px";
	var oldWidth = "500px";

	closeIcon.onClick = function()
	{
		openIcon.removeAttribute('style');
		closeIcon.style.display = 'none';
		slide1.style.display = 'none';
		oldPosition = component.getById('leftPanel').getStyle('right');
		oldWidth = component.getById('leftPanel').getStyle('width');
		component.getById('rightPanel').style.display = 'none';
		component.getById('leftPanel').style.right = '0px';
		component.getById('leftPanel').style.width = 'unset';
		viewManager.resize();
	};

	openIcon.onClick = function()
	{
		closeIcon.removeAttribute('style');
		slide1.style.display = 'block';
		openIcon.style.display = 'none';
		component.getById('rightPanel').style.display = 'block';
		component.getById('leftPanel').style.right = oldPosition;
		component.getById('leftPanel').style.width = oldWidth;
		viewManager.resize();
	}
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this;
}

if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("appGrid");