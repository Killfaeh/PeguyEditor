var Screen = 
{
	body: document.getElementById('main'),
	screen: document.getElementById('screen'),

	menuBar: null,
	dock: null,
	content: null,

	width: 0,
	height: 0,
	scrollX: 0,
	scrollY: 0,

	scrollbarDisplayed: true,
	
	/////////////////////////////////////////////////////////
	// Récupérer les dimension de la fenêtre du navigateur //
	/////////////////////////////////////////////////////////
	
	getWidth: function()
	{
		Screen.width = Screen.body.offsetWidth;
		return Screen.width; 
	},

	getHeight: function()
	{
		Screen.height = Screen.body.offsetHeight;
		return Screen.height; 
	},
	
	///////////////////////
	// Gestion du scroll //
	///////////////////////
	
	//// Récupérer la position du scroll de l'écran ////

	getScrollX: function()
	{
		if (Screen.scrollbarDisplayed)
		{
			if (utils.isset(window.pageXOffset)
					&& (window.pageXOffset > 0 || window.pageYOffset > 0))
				Screen.scrollX = window.pageXOffset;
			else if (utils.isset(document.documentElement.scrollTop))
				Screen.scrollX = document.documentElement.scrollLeft;
			else if (utils.isset(document.body.scrollTop))
				Screen.scrollX = document.body.scrollLeft;
		}
		
		return Screen.scrollX;
	},

	getScrollY: function()
	{
		if (Screen.scrollbarDisplayed)
		{
			if (utils.isset(window.pageXOffset)
					&& (window.pageXOffset > 0 || window.pageYOffset > 0)) 
				Screen.scrollY = window.pageYOffset;
			else if (utils.isset(document.documentElement.scrollTop))
				Screen.scrollY = document.documentElement.scrollTop;
			else if (utils.isset(document.body.scrollTop))
				Screen.scrollY = document.body.scrollTop;
		}

		return Screen.scrollX;
	},
	
	//// Imposer la position du scroll de l'écran ////

	scrollToX: function($scrollX)
	{
		Screen.scrollX = $scrollX;

		if (utils.isset(window.scrollTo))
			window.scrollTo(Screen.scrollX, Screen.scrollY);

		if (utils.isset(document.documentElement.scrollTop))
			document.documentElement.scrollLeft = Screen.scrollX;
		else if (utils.isset(document.body.scrollTop))
			document.body.scrollLeft = Screen.scrollX;
		else if (utils.isset(window.pageXOffset) && (window.pageXOffset > 0 || window.pageYOffset > 0))
			window.pageXOffset = Screen.scrollX;
	}, 
	
	scrollToY: function($scrollY)
	{
		Screens.scrollY = $scrollY;

		if (utils.isset(window.scrollTo))
			window.scrollTo(Screen.scrollX, Screen.scrollY);
		
		if (utils.isset(document.documentElement.scrollTop))
			document.documentElement.scrollTop = Screen.scrollY;
		else if (utils.isset(document.body.scrollTop))
			document.body.scrollTop = Screen.scrollY;
		else if (utils.isset(window.pageXOffset) && (window.pageXOffset > 0 || window.pageYOffset > 0))
			window.pageYOffset = Screen.scrollY;
	},
	
	//// Afficher/Masquer les barres de scroll ////

	displayScrollBar: function()
	{
		Screen.scrollbarDisplayed = true;
		Screen.body.style.overflow = "auto";
		Screen.scrollToX(Screen.scrollX);
		Screen.scrollToY(Screen.scrollY);
		Screen.scrollX();
		Screen.scrollY();
	},
	
	hideScrollBar: function()
	{
		Screen.scrollbarDisplayed = false;
		Screen.body.style.overflow = "hidden";
		Screen.scrollToX(Screen.scrollX);
		Screen.scrollToY(Screen.scrollY);
	},
	
	////////////////////////////
	// Gestion des composents //
	////////////////////////////

	//// Ajouter la barre de menu ////

	setMenuBar: function($menu)
	{
		if (utils.isset($menu))
		{
			if (utils.isset(Screen.menuBar))
				Screen.body.removeChild(Screen.menuBar);

			Screen.menuBar = $menu;
			Screen.body.insertAt(Screen.menuBar, 0);
			Screen.menuBar.style.zIndex = '1000000000';
		}
	},

	//// Ajouter le dock ////

	setDock: function($dock)
	{
		if (utils.isset($dock))
		{
			if (utils.isset(Screen.dock))
				this.body.removeChild(Screen.dock);
			
			Screen.dock = $dock;
			Screen.body.insertAt(dock, 0);
			Screen.dock.style.zIndex = "1000000000";

			/*
			var dock = this.dock;
			var screen 	= window;
			screen.addEvent('resize', function()
			{
				dock.resize();
				dock.center();
			});
			//*/
		}
	},
	
	//// Ajouter contenu (un peu comme dans une fenêtre, popup ou boîte de dialogue) ////

	setContent: function($content)
	{
		if (utils.isset($content))
		{
			if (utils.isset(Screen.content))
				Screen.screen.removeChild(Screen.content);
			
			Screen.content = $content;
			Screen.screen.insertAt(Screen.content, 0);
			Screen.content.style.zIndex = "1000";
		}
	}, 
	
	//// Virer le contenu ////

	removeContent: function()
	{
		if (utils.isset(Screen.content))
			Screen.body.removeChild(Screen.content); 
		
		Screen.content = null;
	},
	
	////////////////////////////////////////////////////////////
	// Mise à jour des informations lors du redimensionnement //
	////////////////////////////////////////////////////////////
	
	onResize: function()
	{
		Screen.getWidth(); 
		Screen.getHeight(); 
		Screen.getScrollX(); 
		Screen.getScrollY(); 
	}
};

if (Loader !== null && Loader !== undefined)
	Loader.hasLoaded("screen");