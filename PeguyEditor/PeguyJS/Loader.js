
///////////////////////
// Chargeur d'images //
///////////////////////

function ImgLoader($url, $name)
{
	///////////////
	// Attributs //
	///////////////

	var url = $url;
	var name = $name;
	var loaded = false;

	//////////////
	// Méthodes //
	//////////////

	this.onload = function() {};

	var onload = function()
	{
		console.log("Has loaded image : " + name);
		
		if (loaded === false)
			loaded = true;

		$this.onload();
	};
	
	var onError = function()
	{
		url = url.replace(Loader.getStyle(), 'Default');
		$this.load();
	};

	this.load = function()
	{
		if (loaded !== true)
		{
			var img = new Image();

			img.onload = function()
			{
				if (loaded !== true)
					onload();
			};
			
			img.onerror = function() { onError(); };

			img.setAttribute("src", url + "?token=" + Loader.getToken());
		}
		else
			onload();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getURL = function() { return url; };
	this.isLoaded = function() { return loaded; };

	// SET
	this.setName = function($name) { name = $name; };
	this.setURL = function($url) { url = $url; };

	var $this = this;
}

//////////////////////////////
// Chargeur de fichiers SVG //
//////////////////////////////

function SVGLoader($url, $name)
{
	///////////////
	// Attributs //
	///////////////

	var url = $url;
	var name = $name;
	var loaded = false;
	var source = document.createElement('object');
	source.setAttribute('type', 'image/svg+xml');
	
	//////////////
	// Méthodes //
	//////////////

	//// Chargement ////
	
	this.onload = function() {};

	var onload = function()
	{
		console.log("Has loaded SVG : " + name);
		
		if (loaded === false)
			loaded = true;

		$this.onload();
	};
	
	var onError = function()
	{
		console.log("Erreur SVG");
		url = url.replace(Loader.getStyle(), 'Default');
		$this.load();
	};

	this.load = function()
	{
		if (loaded !== true)
		{
			source = document.createElement('object');
			source.setAttribute('type', 'image/svg+xml');
			source.style.position = 'absolute';
			source.style.left = '-100000px';
			source.style.right = '-100000px';
			
			source.onload = function() 
			{
				if (loaded !== true)
				{
					source.setAttribute('style', 'display:none;');
					onload();
				}
			};
			
			source.onerror = function() { onError(); };
			source.addEventListener("error", function() { onError(); });
			
			source.setAttribute('data', url + "?token=" + Loader.getToken());
			var body = document.getElementsByTagName('BODY')[0];
			body.appendChild(source);
		}
		else
			onload();
	};
	
	//// Récupération d'un groupe dans le DOM SVG ////

	this.get = function($id, $width, $height)
	{
		var svgDoc = source.contentDocument.getElementsByTagName('svg')[0];
		var group = svgDoc.getElementById($id).cloneNode(true);
		var newSVG = svgDoc.cloneNode();
		newSVG.appendChild(group);
		newSVG.setAttribute("viewBox", group.getAttribute('viewBox'));
		newSVG.setAttribute("width", $width);
		newSVG.setAttribute("height", $height);
		
		newSVG.position = function()
		{
			var element = this;
			var x	   = 0;
			var y	   = 0;
			var scrollX = 0;
			var scrollY = 0;
		
			do
			{
				var rect = element.getBoundingClientRect();
				
				if (utils.isset(element.offsetLeft))
					x += element.offsetLeft;
				else
					x += rect.x;
				
				if (utils.isset(element.offsetTop))
					y += element.offsetTop;
				else
					y += rect.y;
				
				if (utils.isset(element.scrollLeft))
					scrollX += element.scrollLeft;
				
				if (utils.isset(element.scrollTop))
					scrollY += element.scrollTop;
				
				element = element.offsetParent;
			}
			while (utils.isset(element) && utils.isset(element.tagName));
		
			x -= scrollX;
			y -= scrollY;
			
			return { 'x': x, 'y': y };
		};
		
		newSVG.mousePosition = function($event)
		{
			var element = this;
			var x	   = $event.clientX;
			var y	   = $event.clientY;
			var scrollX = 0;
			var scrollY = 0;
		
			
			do
			{
				if (utils.isset(element.scrollLeft))
					scrollX += element.scrollLeft;
				
				if (utils.isset(element.scrollTop))
					scrollY += element.scrollTop;
				
				element = element.parent;
			}
			while (utils.isset(element) && utils.isset(element.tagName));
		
			x -= scrollX;
			y -= scrollY;
			
			return { 'x': x, 'y': y };
		};
		
		newSVG.containsInChildren = function($node)
		{
			var contains = false;
			
			if (utils.isset($node))
			{
				var parentNode = $node.parentNode;
				
				while (utils.isset(parentNode))
				{
					if (parentNode === this)
					{
						contains = true;
						parentNode = null;
					}
					else
						parentNode = parentNode.parentNode;
				}
			}
			
			return contains;
		};
		
		newSVG.onmouseover = function($event)
		{
			$event = $event || window.event; // Compatibilité IE
			
			var catchNode = $event.targetNode();
			var relatedTarget = $event.relatedTarget || $event.fromElement; // Idem
			
			if (!this.containsInChildren(relatedTarget))
			{
				if (utils.isset(this.onToolTip) && this.onToolTip !== "")
				{
					var toolTip = new ToolTip(this, this.onToolTip);
					var mousePosition = this.mousePosition($event);
					
					if (utils.isset(toolTip.update))
						toolTip.update(mousePosition.x, mousePosition.y);
				}
				
				if (utils.isset(this.onMouseOver))
					this.onMouseOver($event);
			}
		};
		
		newSVG.onmouseout = function($event)
		{
			$event = $event || window.event; // Compatibilité IE
			
			var catchNode = $event.targetNode();
			var relatedTarget = $event.relatedTarget || $event.toElement; // Idem
			
			if (!this.containsInChildren(relatedTarget))
			{
				if (utils.isset(this.toolTipOpen))
					this.toolTipOpen.startFadeOut();
				
				if (utils.isset(this.onMouseOut))
					this.onMouseOut($event);
			}
		};
		
		return newSVG;
	};
	
	//// Récupération de toutes les icônes ////
	
	this.getAll = function($width, $height)
	{
		var svgList = [];
		var svgDoc = source.contentDocument.getElementsByTagName('svg')[0];
		var groups = svgDoc.childNodes;
		
		for (var i = 0; i < groups.length; i++)
		{
			if (groups[i].nodeType !== Node.TEXT_NODE && groups[i].tagName === 'g')
			{
				var group = groups[i].cloneNode(true);
				var newSVG = svgDoc.cloneNode();
				newSVG.appendChild(group);
				newSVG.setAttribute("viewBox", group.getAttribute('viewBox'));
				newSVG.setAttribute("width", $width);
				newSVG.setAttribute("height", $height);
				newSVG.setAttribute("file", name);
				newSVG.setAttribute("name", groups[i].getAttribute('id'));
				svgList.push(newSVG);
			}
		}
		
		return svgList;
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getURL = function() { return url; };
	this.isLoaded = function() { return loaded; };
	this.getSource = function() { return source; };

	// SET
	this.setName = function($name) { name = $name; };
	this.setURL = function($url) { url = $url; };

	var $this = this;
}

///////////////////////////////////
// Chargeur de feuilles de style //
///////////////////////////////////

function StyleLoader($url, $name)
{
	///////////////
	// Attributs //
	///////////////

	var url = $url;
	var name = $name;
	var loaded = false;

	//////////////
	// Méthodes //
	//////////////

	this.onload = function() {};

	var onload = function()
	{
		console.log("Has loaded CSS : " + name);
		
		if (loaded === false)
			loaded = true;

		$this.onload();
	};
	
	var onError = function()
	{
		url = url.replace(Loader.getStyle(), 'Default');
		$this.load();
	};

	this.load = function()
	{
		if (loaded !== true)
		{
			var headers = document.getElementsByTagName("head");
			var head = headers[0];
			var styleSheet = document.createElement("link");

			styleSheet.onload = function()
			{
				if (loaded !== true)
					onload();
			};
			
			styleSheet.onerror = function() { onError(); };

			if (styleSheet.addEventListener)
			{
				styleSheet.addEventListener('load', function()
				{
					if (loaded !== true)
						onload();
				}, false);
			}

			styleSheet.onreadystatechange = function()
			{
				var state = styleSheet.readyState;

				if (state === 'loaded' || state === 'complete')
				{
					styleSheet.onreadystatechange = null;

					if (loaded !== true)
						onload();
				}
				else
					onError();
			};

			styleSheet.setAttribute("rel", "stylesheet");
			styleSheet.setAttribute("href", url + "?token=" + Loader.getToken());
			head.appendChild(styleSheet);
		}
		else
			onload();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getURL = function() { return url; };
	this.isLoaded = function() { return loaded; };

	// SET
	this.setName = function($name) { name = $name; };
	this.setURL = function($url) { url = $url; };

	var $this = this;
}

/////////////////////////////////////
// Chargeur de fichiers Javascript //
/////////////////////////////////////

function ScriptLoader($url, $name)
{
	///////////////
	// Attributs //
	///////////////

	var url = $url;
	var name = $name;
	var loaded = false;

	//////////////
	// Méthodes //
	//////////////

	this.onload = function() {};

	var onload = function()
	{
		console.log("Has loaded script : " + name);
		
		if (loaded === false)
			loaded = true;

		$this.onload();
	};

	this.load = function()
	{
		if (loaded !== true)
		{
			var script = document.createElement("script");
			script.src = url + "?token=" + Loader.getToken();
			document.getElementById('main').appendChild(script);
		}
		else
			onload();
	};

	this.hasLoaded = function()
	{
		onload();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.getName = function() { return name; };
	this.getURL = function() { return url; };
	this.isLoaded = function() { return loaded; };

	// SET
	this.setName = function($name) { name = $name; };
	this.setURL = function($url) { url = $url; };

	var $this = this;
}

////////////////////////////////////////////////////////////////////////////////////
// Chargeur de composents combinant un fichier Javascript et une feuille de style //
////////////////////////////////////////////////////////////////////////////////////

function ComponentLoader($name, $scriptURL, $styleURL)
{
	///////////////
	// Attributs //
	///////////////

	var script = new ScriptLoader($scriptURL, $name);
	var style = new StyleLoader($styleURL, $name);

	var name = $name;
	var scriptURL = $scriptURL;
	var styleURL = $styleURL;

	var scriptLoaded = false;
	var styleLoaded = false;
	var loaded = false;

	//////////////
	// Méthodes //
	//////////////

	this.onload = function() {};

	var onload = function()
	{
		if (script.isLoaded() && style.isLoaded())
		{
			console.log("Has loaded component : " + name);
			loaded = true;
			$this.onload();
		}
	};

	this.load = function()
	{
		if (script.isLoaded() && style.isLoaded())
			onload();
		else
		{
			style.onload = function() { onload(); };
			script.onload = function() { onload(); };
			style.load();
			script.load();
		}
	};

	this.hasLoaded = function()
	{
		script.hasLoaded();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	this.isLoaded = function() { return loaded; };

	var $this = this;
}

///////////////////////////////////////////////////////
// Gestionnaire de chargement de ressouces statiques //
///////////////////////////////////////////////////////

function Loader($root, $style)
{
	KEYWORDS = {};
	
	///////////////
	// Attributs //
	///////////////

	var init = false;
	var root = $root;
	var style = 'Default';
	
	if ($style !== null && $style !== undefined && $style !== '')
		style = $style;
	
	var token = "0";
	var additionnalModules = [];
	var nbImg = 0;
	var imgLoaded = 0;
	var nbSvg = 0;
	var svgLoaded = 0;
	var nbCSS = 0;
	var cssLoaded = 0;
	var nbScripts = 0;
	var scriptLoaded = 0;
	var nbComponents = 0;
	var componentLoaded = 0;
	var loaded = false;
	//var url = document.URL;
	var url = window.location.href;
	var mode = 'classic';
	var language = navigator.language || navigator.userLanguage;
	var userAgent = navigator.userAgent;
	var platform = navigator.platform;
	
	console.log("USERAGENT : " + userAgent);
	console.log("LANGUAGE : " + language);
	
	// Pour éviter de forcer l'utilisateur à vider le cache à chaque mise à jour
	// En environnement de test cette valeur change tout le temps
	// En environnement de prod', c'est le numéro de version ou la date de mise à jour
	//if ((/^file:/.test(url)) || (/local/.test(url)) || (/192.168/.test(url)))
		token = Math.ceil(Math.random()*10000);

	// Détecter si on est sur support mobile ou non

	var terminauxMobiles = ['android', 'iphone', 'i phone', 'ipad', 'i pad', 'blackberry',
						'symbian', 'symbianos', 'symbos', 'netfront', 
						'model-orange', 'javaplatform', 'iemobile',
						'windows phone', 'windowsphone', 'samsung', 'htc', 
						'opera mobile', 'opera mobi', 'opera mini', 
						'operamobile', 'operamobi', 'operamini', 
						'huawei', 'blazer', 'bolt', 'doris', 'fennec', 
						'gobrowser', 'iris', 'maemo browser', 'maemobrowser', 
						'mib', 'cldc', 'minimo', 'semc-browser', 'skyfire', 
						'teashark', 'teleca', 'uzard', 'uzardweb', 'meego', 
						'nokia', 'bb10', 'playbook'];

	var chaineRegex = ""; 
	
	for (var i = 0; i < terminauxMobiles.length; i++)
	{
		if (i > 0)
			chaineRegex += "|";
		
		chaineRegex += terminauxMobiles[i];
	}
	
	var userAgentRegex = new RegExp('(' + chaineRegex + ')');

	//console.log("Useragent : " + navigator.userAgent);

	if (userAgentRegex.test(navigator.userAgent.toLowerCase().replace(" ", "")))
		mode = 'mobile';
	else
	{
		if ((/mac os x/.test(navigator.userAgent.toLowerCase().replace(" ", "")) || /macosx/.test(navigator.userAgent.toLowerCase().replace(" ", ""))) && document.createTouch !== null && document.createTouch !== undefined)
			mode = 'mobile';
		else
			mode = 'classic';
	}
		
	//mode = 'mobile';

	//// Tableau des images ////
	
	var images = {};
	
	//images['icon-layer'] = new ImgLoader("/Public/ProceduralGenerator/images/icons/icon-layer.png?token=" + token, 'icon-layer');
	
	//// Tableau des SVG ////
	
	var svgFiles = {};
	
	svgFiles['icons'] = new SVGLoader(root + 'PeguyJS/Graphics/Images/' + style + '/icons.svg', 'icons');
	
	//// Tableaux des CSS ////
	
	var styles = {}; 

	styles['init'] = new StyleLoader(root + 'PeguyJS/Graphics/Style/' + style + '/common/init.css', 'init');

	//// Tableaux des scripts ////

	var scripts = {}; 

	// Utils/
	
	scripts['utils'] = new ScriptLoader(root + 'PeguyJS/Utils/utils.js', 'utils');
	scripts['peguy'] = new ScriptLoader(root + 'PeguyJS/Utils/Peguy.js', 'peguy');
	scripts['dataManager'] = new ScriptLoader(root + 'PeguyJS/Utils/dataManager.js', 'dataManager');
	scripts['dom'] = new ScriptLoader(root + 'PeguyJS/Utils/dom.js', 'dom');
	scripts['events'] = new ScriptLoader(root + 'PeguyJS/Utils/events.js', 'events');
	scripts['date'] = new ScriptLoader(root + 'PeguyJS/Utils/date.js', 'date');
	scripts['string'] = new ScriptLoader(root + 'PeguyJS/Utils/string.js', 'string');
	scripts['debug'] = new ScriptLoader(root + 'PeguyJS/Utils/debug.js', 'debug');
	scripts['colors'] = new ScriptLoader(root + 'PeguyJS/Utils/colors.js', 'colors');
	scripts['files'] = new ScriptLoader(root + 'PeguyJS/Utils/files.js', 'files');
	//scripts['array'] = new ScriptLoader('/Public/Common/scripts/utils/array.js', 'array');
	//scripts['loop'] = new ScriptLoader('/Public/Common/scripts/utils/loop.js', 'loop');

	// Graphics/
	
	// Graphics/Components
	
	scripts['components'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Components.js', 'components');
	scripts['component'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Component.js', 'component');
	scripts['screen'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Screen.js', 'screen');
	scripts['infoPopup'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/InfoPopup.js', 'infoPopup');
	scripts['inputRadio'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/InputRadio.js', 'inputRadio');
	scripts['inputCheckBox'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/InputCheckBox.js', 'inputCheckBox');
	scripts['option'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Option.js', 'option');
	scripts['confirmPopup'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/ConfirmPopup.js', 'confirmPopup');
	scripts['savePopup'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/SavePopup.js', 'savePopup');
	scripts['canvas2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Canvas2D.js', 'canvas2D');
	scripts['treeBranch'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/TreeBranch.js', 'treeBranch');
	scripts['treeLeaf'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/TreeLeaf.js', 'treeLeaf');
	scripts['table'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Table.js', 'table');
	scripts['notification'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Notification.js', 'notification');
	scripts['menuItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/' + mode + '/MenuItem.js', 'menuItem');
	scripts['menuSeparator'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/MenuSeparator.js', 'menuSeparator');
	scripts['autoCompleteKeyValue'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/AutoCompleteKeyValue.js', 'autoCompleteKeyValue');
	scripts['tab'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Tab.js', 'tab');
	scripts['accordionItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/AccordionItem.js', 'accordionItem');
	scripts['listItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/ListItem.js', 'listItem');
	scripts['inputNumber'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/' + mode + '/InputNumber.js', 'inputNumber');
	scripts['embedPDF'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/EmbedPDF.js', 'embedPDF');
	scripts['desktopItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/' + mode + '/DesktopItem.js', 'desktopItem');
	scripts['folderItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/' + mode + '/FolderItem.js', 'folderItem');
	scripts['fileItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/' + mode + '/FileItem.js', 'fileItem');
	scripts['label'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/Label.js', 'label');
	scripts['filePreview'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/FilePreview.js', 'filePreview');
	
	if (mode === 'classic')
	{
		scripts['comboBoxItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/classic/ComboBoxItem.js', 'comboBoxItem');
		scripts['dockItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/classic/DockItem.js', 'dockItem');
	}
	else
		scripts['textarea'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/mobile/Textarea.js', 'textarea');
	
	// Graphics/SVG
	
	scripts['svg'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/SVG/SVG.js', 'svg');
	scripts['svgLinearGradient'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/SVG/SVGlinearGradient.js', 'svgLinearGradient');
	scripts['svgRadialGradient'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/SVG/SVGradialGradient.js', 'svgRadialGradient');
	scripts['svgHTML'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/SVG/SVGhtml.js', 'svgHTML');
	
	// Network
	
	scripts['httpRequestJson'] = new ScriptLoader(root + 'PeguyJS/Network/HttpRequestJson.js', 'httpRequestJson');
	
	//// Tableaux des composents ////

	var components = {};

	components['popup'] = new ComponentLoader('popup', root + 'PeguyJS/Graphics/Components/common/Popup.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/popup.css');
	components['freeze-screen'] = new ComponentLoader('freeze-screen', root + 'PeguyJS/Graphics/Components/common/FreezeScreen.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/freezeScreen.css');
	components['radioList'] = new ComponentLoader('radioList', root + 'PeguyJS/Graphics/Components/common/RadioList.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/radioList.css');
	components['checkBoxList'] = new ComponentLoader('checkBoxList', root + 'PeguyJS/Graphics/Components/common/CheckBoxList.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/checkBoxList.css');
	components['select'] = new ComponentLoader('select', root + 'PeguyJS/Graphics/Components/common/Select.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/select.css');
	components['comboBox'] = new ComponentLoader('comboBox', root + 'PeguyJS/Graphics/Components/' + mode + '/ComboBox.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/comboBox.css');
	components['autoComplete'] = new ComponentLoader('autoComplete', root + 'PeguyJS/Graphics/Components/' + mode + '/AutoComplete.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/autoComplete.css');
	//components['contentEditable'] = new ComponentLoader('contentEditable', root + 'PeguyJS/Graphics/Components/common/ContentEditable.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/contentEditable.css');
	components['tree'] = new ComponentLoader('tree', root + 'PeguyJS/Graphics/Components/common/Tree.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/tree.css');
	components['colorPicker'] = new ComponentLoader('colorPicker', root + 'PeguyJS/Graphics/Components/common/ColorPicker.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/colorPicker.css');
	components['selectColorPopup'] = new ComponentLoader('selectColorPopup', root + 'PeguyJS/Graphics/Components/common/SelectColorPopup.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/selectColorPopup.css');
	components['colorPalette'] = new ComponentLoader('colorPalette', root + 'PeguyJS/Graphics/Components/common/ColorPalette.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/colorPalette.css');
	components['inputFile'] = new ComponentLoader('inputFile', root + 'PeguyJS/Graphics/Components/common/InputFile.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/inputFile.css');
	components['imagesManager'] = new ComponentLoader('imagesManager', root + 'PeguyJS/Graphics/Components/common/ImagesManager.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/imagesManager.css');
	components['imagePopup'] = new ComponentLoader('imagePopup', root + 'PeguyJS/Graphics/Components/common/ImagePopup.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/imagePopup.css');
	components['inputSearch'] = new ComponentLoader('inputSearch', root + 'PeguyJS/Graphics/Components/common/InputSearch.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/inputSearch.css');
	components['notificationsManager'] = new ComponentLoader('notificationsManager', root + 'PeguyJS/Graphics/Components/common/NotificationsManager.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/notificationsManager.css');
	components['contextMenu'] = new ComponentLoader('contextMenu', root + 'PeguyJS/Graphics/Components/common/ContextMenu.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/contextMenu.css');
	components['contextPalette'] = new ComponentLoader('contextPalette', root + 'PeguyJS/Graphics/Components/common/ContextPalette.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/contextPalette.css');
	components['contextPanel'] = new ComponentLoader('contextPanel', root + 'PeguyJS/Graphics/Components/common/ContextPanel.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/contextPanel.css');
	components['toolTip'] = new ComponentLoader('toolTip', root + 'PeguyJS/Graphics/Components/common/ToolTip.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/toolTip.css');
	components['editCommandsBar'] = new ComponentLoader('editCommandsBar', root + 'PeguyJS/Graphics/Components/common/EditCommandsBar.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/editCommandsBar.css');
	components['checkBox'] = new ComponentLoader('checkBox', root + 'PeguyJS/Graphics/Components/common/CheckBox.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/checkBox.css');
	components['horizontalSlide'] = new ComponentLoader('horizontalSlide', root + 'PeguyJS/Graphics/Components/common/HorizontalSlide.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/horizontalSlide.css');
	components['verticalSlide'] = new ComponentLoader('verticalSlide', root + 'PeguyJS/Graphics/Components/common/VerticalSlide.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/verticalSlide.css');
	components['consoleFrame'] = new ComponentLoader('consoleFrame', root + 'PeguyJS/Graphics/Components/common/ConsoleFrame.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/consoleFrame.css');
	components['menuBar'] = new ComponentLoader('menuBar', root + 'PeguyJS/Graphics/Components/common/MenuBar.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/menuBar.css');
	components['button'] = new ComponentLoader('button', root + 'PeguyJS/Graphics/Components/common/Button.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/button.css');
	components['tabManager'] = new ComponentLoader('tabManager', root + 'PeguyJS/Graphics/Components/common/TabManager.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/tabManager.css');
	components['accordion'] = new ComponentLoader('accordion', root + 'PeguyJS/Graphics/Components/common/Accordion.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/accordion.css');
	components['slider'] = new ComponentLoader('slider', root + 'PeguyJS/Graphics/Components/common/Slider.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/slider.css');
	components['switch'] = new ComponentLoader('switch', root + 'PeguyJS/Graphics/Components/common/Switch.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/switch.css');
	components['listBox'] = new ComponentLoader('listBox', root + 'PeguyJS/Graphics/Components/common/ListBox.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/listBox.css');
	components['progressBar'] = new ComponentLoader('progressBar', root + 'PeguyJS/Graphics/Components/common/ProgressBar.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/progressBar.css');
	components['scrollPanel'] = new ComponentLoader('scrollPanel', root + 'PeguyJS/Graphics/Components/common/ScrollPanel.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/scrollPanel.css');
	components['desktop'] = new ComponentLoader('desktop', root + 'PeguyJS/Graphics/Components/' + mode + '/Desktop.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/desktop.css');
	components['fileSystem'] = new ComponentLoader('fileSystem', root + 'PeguyJS/Graphics/Components/' + mode + '/FileSystem.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/fileSystem.css');
	components['iDIcon'] = new ComponentLoader('iDIcon', root + 'PeguyJS/Graphics/Components/common/IDIcon.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/iDIcon.css');
	components['labelList'] = new ComponentLoader('labelList', root + 'PeguyJS/Graphics/Components/common/LabelList.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/labelList.css');
	components['dropFilesZone'] = new ComponentLoader('dropFilesZone', root + 'PeguyJS/Graphics/Components/common/DropFilesZone.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/dropFilesZone.css');
	components['iconsMenu'] = new ComponentLoader('iconsMenu', root + 'PeguyJS/Graphics/Components/common/IconsMenu.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/iconsMenu.css');
	components['buttonsMenu'] = new ComponentLoader('buttonsMenu', root + 'PeguyJS/Graphics/Components/common/ButtonsMenu.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/buttonsMenu.css');
	components['toolsBar'] = new ComponentLoader('toolsBar', root + 'PeguyJS/Graphics/Components/common/ToolsBar.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/toolsBar.css');
	
	if (mode === 'mobile')
	{
		components['inputText'] = new ComponentLoader('inputText', root + 'PeguyJS/Graphics/Components/mobile/InputText.js', root + 'PeguyJS/Graphics/Style/' + style + '/mobile/inputText.css');
		components['inputDate'] = new ComponentLoader('inputDate', root + 'PeguyJS/Graphics/Components/mobile/InputDate.js', root + 'PeguyJS/Graphics/Style/' + style + '/mobile/inputDate.css');
		//components['inputFile'] = new ComponentLoader('inputFile', root + 'PeguyJS/Graphics/Components/mobile/InputFile.js', root + 'PeguyJS/Graphics/Style/' + style + '/mobile/inputFile.css');
	}
	else
	{
		components['calendar'] = new ComponentLoader('calendar', root + 'PeguyJS/Graphics/Components/classic/Calendar.js', root + 'PeguyJS/Graphics/Style/' + style + '/classic/calendar.css');
		components['frame'] = new ComponentLoader('frame', root + 'PeguyJS/Graphics/Components/classic/Frame.js', root + 'PeguyJS/Graphics/Style/' + style + '/classic/frame.css');
		components['invisibleFreezeScreen'] = new ComponentLoader('frame', root + 'PeguyJS/Graphics/Components/classic/InvisibleFreezeScreen.js', root + 'PeguyJS/Graphics/Style/' + style + '/classic/invisibleFreezeScreen.css');
		components['dock'] = new ComponentLoader('dock', root + 'PeguyJS/Graphics/Components/' + mode + '/Dock.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/dock.css');
		components['testCodePanel'] = new ComponentLoader('testCodePanel', root + 'PeguyJS/Graphics/Components/' + mode + '/TestCodePanel.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/testCodePanel.css');
	}
	
	//////////////
	// Méthodes //
	//////////////

	this.onload = function() {};

	var onload = function()
	{
		if (loaded === false && imgLoaded >= nbImg && svgLoaded >= nbSvg && cssLoaded >= nbCSS && scriptLoaded >= nbScripts && componentLoaded >= nbComponents)
		{
			loaded = true;
			
			setTimeout(function()
			{
				console.log("END LOADING ! ");
				
				if (init === false)
				{
					Events.init();
					init = true;
					
					PEGUY.url = url;
					PEGUY.mode = mode;
					PEGUY.language = language;
					PEGUY.userAgent = userAgent;
					PEGUY.platform = platform;
					
					Debug.console = new ConsoleFrame();
					
					window.onerror = function($message, $source, $lineno, $colno, $error)
					{
						var stack = '';
						
						if (utils.isset($error))
							stack = $error.stack;
						else
							stack = $message;
						
						Debug.console.log('<span class="error" >' + $message + '<br />' + stack + '</span>');
						Debug.onError($message, $source, $lineno, $colno, $error);
					};
				}
				
				$this.onload();
			}, 10);
		}
	};

	// Chargement initial
	this.load = function()
	{
		// Keywords/
		
		// Français
		if (/^fr.*/.test(language) || /^FR.*/.test(language) || /^Fr.*/.test(language))
		{
			language = 'fr';
			scripts['keywords'] = new ScriptLoader(root + 'PeguyJS/Keywords/fr.js', 'keywords');
		}
		// Espagnol
		else if (/^es.*/.test(language) || /^ES.*/.test(language) || /^Es.*/.test(language) || /^spa.*/.test(language) || /^SPA.*/.test(language) || /^Spa.*/.test(language))
		{
			language = 'es';
			scripts['keywords'] = new ScriptLoader(root + 'PeguyJS/Keywords/es.js', 'keywords');
		}
		// Anglais
		else
		{
			language = 'en-US';
			scripts['keywords'] = new ScriptLoader(root + 'PeguyJS/Keywords/en.js', 'keywords');
		}
		
		// Module kanban
		
		if (additionnalModules.indexOf('kanban') >= 0)
		{
			scripts['kanbanColumn'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/KanbanColumn.js', 'kanbanColumn');
			scripts['kanbanCard'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/KanbanCard.js', 'kanbanCard');
			components['kanban'] = new ComponentLoader('kanban', root + 'PeguyJS/Graphics/Components/common/Kanban.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/kanban.css');
		}
		
		// Module contentEditable
		
		if (additionnalModules.indexOf('contentEditable') >= 0)
		{
			components['contentEditable'] = new ComponentLoader('contentEditable', root + 'PeguyJS/Graphics/Components/common/ContentEditable.js', root + 'PeguyJS/Graphics/Style/' + style + '/' + mode + '/contentEditable.css');
		}

		// Module codeEditor
		
		if (additionnalModules.indexOf('codeEditor') >= 0)
		{
			components['codeEditor'] = new ComponentLoader('codeEditor', root + 'PeguyJS/Graphics/Components/common/CodeEditor.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/codeEditor.css');
		}
		
		// Module math
		
		if (additionnalModules.indexOf('canvas3D') >= 0 && additionnalModules.indexOf('math') < 0)
			additionnalModules.push('math');

		if (additionnalModules.indexOf('math') >= 0)
		{
			scripts['math'] = new ScriptLoader(root + 'PeguyJS/Math/Math.js', 'math');
			scripts['polynomial'] = new ScriptLoader(root + 'PeguyJS/Math/Polynomial.js', 'polynomial');
			scripts['trigo'] = new ScriptLoader(root + 'PeguyJS/Math/Trigo.js', 'trigo');
			scripts['vectors'] = new ScriptLoader(root + 'PeguyJS/Math/Vectors.js', 'vectors');
			scripts['math-polygon'] = new ScriptLoader(root + 'PeguyJS/Math/MathPolygon.js', 'math-polygon');
			scripts['matrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/Matrix.js', 'matrix');
			scripts['orthoMatrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/OrthoMatrix.js', 'orthoMatrix');
			scripts['perspectiveMatrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/PerspectiveMatrix.js', 'perspectiveMatrix');
			scripts['rotateMatrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/RotateMatrix.js', 'rotateMatrix');
			scripts['scaleMatrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/ScaleMatrix.js', 'scaleMatrix');
			scripts['translateMatrix'] = new ScriptLoader(root + 'PeguyJS/Math/Matrix/TranslateMatrix.js', 'translateMatrix');
		}
		
		// Module chart
	
		if (additionnalModules.indexOf('charts') >= 0)
		{
			scripts['chart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/Chart.js', 'chart');
			scripts['columnChart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/ColumnChart.js', 'columnChart');
			scripts['lineChart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/LineChart.js', 'lineChart');
			scripts['pieChart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/PieChart.js', 'pieChart');
			scripts['donutChart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/DonutChart.js', 'donutChart');
			scripts['gaugeChart'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/charts/GaugeChart.js', 'gaugeChart');
		}
		
		// Module nodes
		
		if (additionnalModules.indexOf('nodes') >= 0)
		{
			scripts['nodeItem'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/NodeItem.js', 'nodeItem');
			scripts['nodeInput'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/NodeInput.js', 'nodeInput');
			scripts['nodeOutput'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/NodeOutput.js', 'nodeOutput');
			scripts['nodesLink'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/NodesLink.js', 'nodesLink');
			scripts['nodesGroup'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/common/NodesGroup.js', 'nodesLink');
			components['nodesPanel'] = new ComponentLoader('nodesPanel', root + 'PeguyJS/Graphics/Components/common/NodesPanel.js', root + 'PeguyJS/Graphics/Style/' + style + '/common/nodesPanel.css');
		}
		
		// Module canvas2D
		
		if (additionnalModules.indexOf('canvas2D') >= 0)
		{
			scripts['object2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Object2D.js', 'object2D');
			scripts['group2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Group2D.js', 'group2D');
			scripts['linearGradient2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/LinearGradient2D.js', 'linearGradient2D');
			scripts['radialGradient2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/RadialGradient2D.js', 'radialGradient2D');
			scripts['conicGradient2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/ConicGradient2D.js', 'conicGradient2D');
			scripts['image2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Image2D.js', 'image2D');
			scripts['sprite2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Sprite2D.js', 'sprite2D');
			scripts['rect2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Rect2D.js', 'rect2D');
			scripts['circle2D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas2D/Circle2D.js', 'circle2D');
		}

		// Module canvas3D

		if (additionnalModules.indexOf('canvas3D') >= 0)
		{
			scripts['canvas3D'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/Canvas3D.js', 'canvas3D');
			scripts['canvas3DEditor'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/Canvas3DEditor.js', 'canvas3DEditor');
			scripts['gl-buffer'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLBuffer.js', 'gl-buffer');
			scripts['gl-camera'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLCamera.js', 'gl-camera');
			scripts['gl-group'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLGroup.js', 'gl-group');
			scripts['gl-instance'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLInstance.js', 'gl-instance');
			scripts['gl-light'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLLight.js', 'gl-light');
			scripts['gl-material'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLMaterial.js', 'gl-material');
			scripts['gl-object'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/GLObject.js', 'gl-object');
			scripts['shader'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/Shader.js', 'shader');
			scripts['shader-program'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/ShaderProgram.js', 'shader-program');
			scripts['texture'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/Texture.js', 'texture');

			scripts['gl-data'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/GLData.js', 'gl-data');
			scripts['gl-working-grid'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/GLWorkingGrid.js', 'gl-working-grid');
			scripts['gl-working-mark'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/GLWorkingMark.js', 'gl-working-mark');
			scripts['gl-cone'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLCone.js', 'gl-cone');
			scripts['gl-cuboid'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLCuboid.js', 'gl-cuboid');
			scripts['gl-cuboid-sphere'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLCuboidSphere.js', 'gl-cuboid-sphere');
			scripts['gl-cylinder'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLCylinder.js', 'gl-cylinder');
			scripts['gl-disc'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLDisc.js', 'gl-disc');
			scripts['gl-line'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLLine.js', 'gl-line');
			scripts['gl-pipe'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPipe.js', 'gl-pipe');
			scripts['gl-polygon'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPolygon.js', 'gl-polygon');
			scripts['gl-polyline'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPolyline.js', 'gl-polyline');
			scripts['gl-prism'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPrism.js', 'gl-prism');
			scripts['gl-prism-from-polygon'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPrismFromPolygon.js', 'gl-prism-from-polygon');
			scripts['gl-prism-revolution'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPrismRevolution.js', 'gl-prism-revolution');
			scripts['gl-pyramid'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPyramid.js', 'gl-pyramid');
			scripts['gl-pyramid-from-polygon'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPyramidFromPolygon.js', 'gl-pyramid-from-polygon');
			scripts['gl-quad'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLQuad.js', 'gl-quad');
			scripts['gl-rect'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLRect.js', 'gl-rect');
			scripts['gl-revolution'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLRevolution.js', 'gl-revolution');
			scripts['gl-ring'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLRing.js', 'gl-ring');
			scripts['gl-uv-ellipsoid'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLUVEllipsoid.js', 'gl-uv-ellipsoid');
			scripts['gl-uv-sphere'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLUVSphere.js', 'gl-uv-sphere');
			scripts['gl-ribbon-from-curve'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLRibbonFromCurve.js', 'gl-ribbon-from-curve');
			scripts['gl-prism-from-curve'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/items/primitives/GLPrismFromCurve.js', 'gl-prism-from-curve');

			scripts['fragment-bump'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderBump.js', 'fragment-bump');
			scripts['fragment-color'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderColor.js', 'fragment-color');
			scripts['fragment-color-ramp'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderColorRamp.js', 'fragment-color-ramp');
			scripts['fragment-init'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderInit.js', 'fragment-init');
			scripts['fragment-manga'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderManga.js', 'fragment-manga');
			scripts['fragment-modeling'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderModeling.js', 'fragment-modeling');
			scripts['fragment-material'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderMaterial.js', 'fragment-material');
			scripts['fragment-monochrome'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderMonochrome.js', 'fragment-monochrome');
			scripts['fragment-normals'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderNormals.js', 'fragment-normals');
			scripts['fragment-outline'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderOutline.js', 'fragment-outline');
			scripts['fragment-sobel-edge'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/FragmentShaderSobelEdge.js', 'fragment-sobel-edge');
			scripts['vertex-color'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/VertexShaderColor.js', 'vertex-color');
			scripts['vertex-init'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/VertexShaderInit.js', 'vertex-init');
			scripts['vertex-material'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/VertexShaderMaterial.js', 'vertex-material');
			scripts['vertex-normals'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/VertexShaderNormals.js', 'vertex-normals');
			scripts['vertex-normals-texture'] = new ScriptLoader(root + 'PeguyJS/Graphics/Components/canvas3D/shaders/VertexShaderNormalsTexture.js', 'vertex-normals-texture');
			
		}
		
		loaded = false;
		nbImg = 0;
		imgLoaded = 0;
		nbSvg = 0;
		svgLoaded = 0;
		nbCSS = 0;
		cssLoaded = 0;
		nbScripts = 0;
		scriptLoaded = 0;
		nbComponents = 0;
		componentLoaded = 0;

		// Initialisation des nombres de ressources
		for (var key in images)
			nbImg++;
		
		for (var key in svgFiles)
			nbSvg++;

		for (var key in styles)
			nbCSS++;

		for (var key in scripts)
			nbScripts++;

		for (var key in components)
			nbComponents++; 

		// Charger les images initiales
		for (var key in images)
		{
			images[key].onload = function()
			{
				imgLoaded++;
				onload();
			};

			images[key].load();
		}
		
		// Charger les fichiers SVG initiaux
		for (var key in svgFiles)
		{
			svgFiles[key].onload = function()
			{
				svgLoaded++;
				onload();
			};

			svgFiles[key].load();
		}

		// Charger les feuilles de style initiales
		for (var key in styles)
		{
			styles[key].onload = function()
			{
				cssLoaded++;
				onload();
			};

			styles[key].load();
		}

		// Charger les scripts initiaux
		for (var key in scripts)
		{
			scripts[key].onload = function()
			{
				scriptLoaded++;
				onload();
			};

			scripts[key].load();
		}

		// Charger les composents initiaux
		for (var key in components)
		{
			components[key].onload = function()
			{
				componentLoaded++;
				onload();
			};

			components[key].load();
		}
	};

	this.hasLoaded = function($name)
	{
		//console.log("Has loaded js : " + $name);
		
		if (scripts[$name] !== null && scripts[$name] !== undefined)
			scripts[$name].hasLoaded();
		else if (components[$name] !== null && components[$name] !== undefined)
			components[$name].hasLoaded();
	};

	// Pour charger après coup une nouvelle image
	this.useImg = function($url, $name, $onLoad)
	{
		if (images[$name] === null || images[$name] === undefined)
			images[$name] = new ImgLoader($url, $name);
		
		images[$name].onload = $onLoad;
		images[$name].load();
	};
	
	// Pour ajouter une image après coup sans lancer le chargement immédiatement
	this.addImg = function($url, $name)
	{
		if (images[$name] === null || images[$name] === undefined)
			images[$name] = new ImgLoader($url, $name);
	};
	
	// Pour charger après coup un nouveau fichier SVG
	this.useSVG = function($url, $name, $onLoad)
	{
		if (svgFiles[$name] === null || svgFiles[$name] === undefined)
			svgFiles[$name] = new SVGLoader($url, $name);
		
		svgFiles[$name].onload = $onLoad;
		svgFiles[$name].load();
	};
	
	// Pour ajouter un fichier SVG après coup sans lancer le chargement immédiatement
	this.addSVG = function($url, $name)
	{
		if (svgFiles[$name] === null || svgFiles[$name] === undefined)
			svgFiles[$name] = new SVGLoader($url, $name);
	};
	
	// Pour charger après coup une nouvelle feuille de style
	this.useStyle = function($url, $name, $onLoad)
	{
		if (styles[$name] === null || styles[$name] === undefined)
			styles[$name] = new StyleLoader($url, $name);
		
		styles[$name].onload = $onLoad;
		styles[$name].load();
	};
	
	// Pour ajouter un style après coup sans lancer le chargement immédiatement
	this.addStyle = function($url, $name)
	{
		if (styles[$name] === null || styles[$name] === undefined)
			styles[$name] = new StyleLoader($url, $name);
	};
	
	// Pour charger après coup un nouveau fichier de javascript
	this.useScript = function($url, $name, $onLoad)
	{
		if (scripts[$name] === null || scripts[$name] === undefined)
			scripts[$name] = new ScriptLoader($url, $name);
		
		scripts[$name].onload = $onLoad;
		scripts[$name].load();
	};
	
	// Pour ajouter après coup un nouveau fichier de javascript sans lancer le chargement immédiatement
	this.addScript = function($url, $name)
	{
		if (scripts[$name] === null || scripts[$name] === undefined)
			scripts[$name] = new ScriptLoader($url, $name);
	};
	
	// Pour charger après coup un nouveau composent
	this.useComponent = function($styleURL, $scriptURL, $name, $onLoad)
	{
		if (components[$name] === null || components[$name] === undefined)
			components[$name] = new ComponentLoader($name, $scriptURL, $styleURL);
		
		components[$name].onload = $onLoad;
		components[$name].load();
	};
	
	// Pour ajouter après coup un nouveau composent sans lancer le chargement immédiatement
	this.addComponent = function($styleURL, $scriptURL, $name)
	{
		if (components[$name] === null || components[$name] === undefined)
			components[$name] = new ComponentLoader($name, $scriptURL, $styleURL);
	};
	
	// Si on ne veut pas charger tous les composents de la bibliothèque par défaut.
	this.exclude = function($excludeList)
	{
		for (var i = 0; i < $excludeKey.length; i++)
		{
			delete images[$excludeKey[i]];
			delete svgFiles[$excludeKey[i]];
			delete styles[$excludeKey[i]];
			delete scripts[$excludeKey[i]];
			delete components[$excludeKey[i]];
		}
	};
	
	this.addModule = function($module)
	{
		if (additionnalModules.indexOf($module) < 0)
			additionnalModules.push($module);
	};
	
	this.addModules = function($modules)
	{
		for (var i = 0; i < $modules.length; i++)
		{
			if (additionnalModules.indexOf($modules[i]) < 0)
				additionnalModules.push($modules[i]);
		}
	};
	
	this.removeModule = function($module)
	{
		var index = additionnalModules.indexOf($module);
		
		if (index >= 0)
			additionnalModules = additionnalModules.splice(index, 1);
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	this.getRoot = function() { return root; };
	this.getToken = function() { return token; };
	this.getMode = function() { return mode; };
	this.getLanguage = function() { return language; };
	this.getStyle = function() { return style; };
	
	this.getImg = function($id)
	{
		var img = new Image();
		img.src = images[$id].getURL();
		return img;
	};

	this.getSVG = function($name, $id, $width, $height)
	{
		var svg  = null;
		
		if (svgFiles[$name] !== undefined && svgFiles[$name] !== null)
			svg = svgFiles[$name].get($id, $width, $height);
	
		return svg;
	};
	
	this.getAllSVG = function($width, $height)
	{
		var svgList = [];
		
		for (var name in svgFiles)
		{
			var subList = svgFiles[name].getAll($width, $height);
			
			for (var i = 0; i < subList.length; i++)
				svgList.push(subList[i]);
		}
		
		return svgList;
	};
	
	// SET
	this.setRoot = function($root) { root = $root; };
	this.setToken = function($token) { token = $token; };
	this.setLanguage = function($language) { language = $language; };
	this.setStyle = function($style) { style = $style; };
	
	var $this = this;
}