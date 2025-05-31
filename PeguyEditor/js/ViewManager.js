function ViewManager()
{
	// ajouter le système de plugin pour générer des structures de code (format simple : valeur par défeut du champ JSON, méthode de calcul de la chaîne de caractères)
	// ajouter la liste des émoji à insérer en un clic
	// enrichir mes bibliothèques de bloc de code standards
	// outils de recherche, cherche et remplace
	// un peu d’automatisation sur l’insertion de tabulations

	///////////////
	// Attributs //
	///////////////
	
	var component = new Component('<div></div>');

	//// Menu Bar ////

	var menuBar = new MenuBar();
	
	// File 
					
	var menuBarItemFile = new MenuItem("File");
	var itemNew = new MenuItem("New");
	var itemOpenFile = new MenuItem("Open file...");
	var itemOpenRecent = new MenuItem("Open recent...");
	var itemSave = new MenuItem("Save");
	var itemSaveAs = new MenuItem("Save as...");
	
	// Edit

	var menuBarItemEdit = new MenuItem("Edit");

	// Insert

	var menuBarItemInsert = new MenuItem("Insert");

	//// Grille ////

	var appGrid = new AppGrid();

	//// Panneau du workspace ////

	var workspacePanel = new WorkspacePanel();
	appGrid.getById('leftLeftPanel').appendChild(workspacePanel);

	//// Tab manager ////

	var tabManager = new TabManager();
	tabManager.setEditMode(true);

	appGrid.getById('centerPanel').appendChild(tabManager);

	//// Espace des ressources ////

	var resourcesTabManager = new TabManager();
	appGrid.getById('rightPanel').appendChild(resourcesTabManager);

	//////////////
	// Méthodes //
	//////////////

	this.init = function()
	{
		document.getElementById('screen').removeAllChildren();

		//// Menu Bar ////

		document.getElementById('screen').appendChild(menuBar);

		// File 

		itemSave.setDisable(true);
		itemSaveAs.setDisable(true);

		menuBar.addElement(menuBarItemFile);
		menuBarItemFile.addElement(itemNew);
		menuBarItemFile.addElement(itemOpenFile);
		menuBarItemFile.addElement(itemOpenRecent);
		menuBarItemFile.addElement(itemSave);
		menuBarItemFile.addElement(itemSaveAs);

		// Edit

		//menuBar.addElement(menuBarItemEdit);

		// Insert

		menuBar.addElement(menuBarItemInsert);

		//// Tab manager ////

		document.getElementById('screen').appendChild(appGrid);
		//tabManager.style.top = '34px';
		$this.focus();

		window.electronAPI.loadSettingsInGUI();
	};

	var activateMenu = function()
	{
		itemSave.setDisable(false);
		itemSaveAs.setDisable(false);
	};

	var getDocType = function($filePath)
	{
		var docType = 'plaintext';

		if (/\.py$/.test($filePath))
			docType = 'python';
		else if (/\.rpy$/.test($filePath))
			docType = 'python';
		else if (/\.xml$/.test($filePath))
			docType = 'xml';
		else if (/\.html$/.test($filePath))
			docType = 'html';
		else if (/\.svg$/.test($filePath))
			docType = 'xml';
		else if (/\.sh$/.test($filePath))
			docType = 'bash';
		else if (/\.c$/.test($filePath))
			docType = 'c';
		else if (/\.cpp$/.test($filePath))
			docType = 'cpp';
		else if (/\.css$/.test($filePath))
			docType = 'css';
		else if (/\.java$/.test($filePath))
			docType = 'java';
		else if (/\.json$/.test($filePath))
			docType = 'json';
		else if (/\.lua$/.test($filePath))
			docType = 'lua';
		else if (/\.pl$/.test($filePath))
			docType = 'perl';
		else if (/\.php$/.test($filePath))
			docType = 'php';
		else if (/\.js$/.test($filePath))
			docType = 'javascript';
		else if (/\.sql$/.test($filePath))
			docType = 'sql';
		else if (/\.bas$/.test($filePath))
			docType = 'basic';

		return docType;
	};

	this.createNewTab = function($tabName, $filePath, $code) { createNewTab($tabName, $filePath, $code); };

	var createNewTab = function($tabName, $filePath, $code)
	{
		var docType = getDocType($filePath);
		var newDocument = new Document(docType);
		var tab = new Tab('<span>' + $tabName + '</span>', newDocument);
		tabManager.addTab(tab);
		newDocument.setFilePath($filePath);
		newDocument.setCode($code);
		newDocument.setSaved(true);

		activateMenu();

		tab.onClose = function()
		{
			var close = false;

			var saved = tab.getContent().isSaved();

			console.log("CLOSE");

			if (saved === true)
			{
				close = true;
				window.electronAPI.closeFile(tab.getContent().getFilePath());
			}
			else
			{
				var savePopup = new SavePopup('<p>The modifications of the file "' + tab.getContent().getFilePath() + '" have not been saved. Do you want save them before closing ? </p>');
				document.getElementById('main').appendChild(savePopup);

				savePopup.onDontSave = function()
				{
					tabManager.removeTab(tab);
					window.electronAPI.closeFile(tab.getContent().getFilePath());
					return true;
				};

				savePopup.onSave = async function()
				{
					var saveSuccess = await save(tab);

					if (saveSuccess !== true)
					{
						var message = '<p style="text-align: left;" >An error occured when trying to save the file "' + tab.getLabel() + '".</p>';
						notifCenter.push(message, false);
					}
					else
					{
						tabManager.removeTab(tab);
						this.hide();
					}

					window.electronAPI.closeFile(tab.getContent().getFilePath());

					return saveSuccess;
				};
			}

			console.log("CLOSE : ");
			console.log(close);

			return close;
		};

		tab.onSelect = function($tab) { $tab.getContent().restoreScroll(); };

		newDocument.resize();
	};

	this.openFile = async function($filePath)
	{
		const file = await window.electronAPI.openRecentFile($filePath);

		if (utils.isset(file))
		{
			if (checkIfOpen(file.path) === false)
				createNewTab(file.name, file.path, file.content);
		}
		else
		{
			var message = '<p style="text-align: left;" >The file "' + $filePath + '" doesn\'t exist.</p>';
			notifCenter.push(message, false);
		}
	};

	var onDropFiles = function($event)
	{
		Files.drop($event, async function($fileList)
		{
			for (var i = 0; i < $fileList.length; i++)
			{
				var mimeType = $fileList[i].type;
				
				if (/^text\//.test(mimeType) || /^image\/svg\+xml/.test(mimeType) 
				|| /^application\/javascript/.test(mimeType) || /^application\/json/.test(mimeType) || /^application\/typescript/.test(mimeType)
				|| /^application\/xhtml\+xml/.test(mimeType)|| /^application\/xml/.test(mimeType))
				{
					await $this.openFile($fileList[i].path);
				}
			}
		});
	};

	this.checkSavedFiles = function()
	{
		var isNotSavedFiles = false;

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			if (tabList[i].getContent().isSaved() === false)
			{
				isNotSavedFiles = true;
				i = tabList.length;
			}
		}

		window.electronAPI.setNotSavedFiles(isNotSavedFiles);
	};

	this.confirmCloseApp = function()
	{
		var savePopup = new SavePopup('<p>The modifications of some files have not been saved. Do you want save them before closing ? </p>');
		document.getElementById('main').appendChild(savePopup);

		savePopup.onDontSave = function()
		{
			window.electronAPI.setNotSavedFiles(false);
			window.electronAPI.quit();
			return true;
		};

		savePopup.onSave = async function()
		{
			var tabList = tabManager.getTabList();

			for (var i = 0; i < tabList.length; i++)
			{
				if (tabList[i].getContent().isSaved() === false)
					await save(tabList[i]);
			}

			window.electronAPI.quit();

			return true;
		};
	};

	var save = async function($tab)
	{
		var success = false;
		var fileName = '';

		var filePath = $tab.getContent().getFilePath();
		var code = $tab.getContent().getCode();

		// Enregistrer fichier existant
		if (utils.isset(filePath) && filePath !== '')
		{
			const file = await window.electronAPI.saveFile(filePath, code);

			if (utils.isset(file))
			{
				fileName = file.name;
				success = true;
			}
		}
		// Enregistrer un nouveau fichier
		else
		{
			const file = await window.electronAPI.saveFileAs(code);

			if (utils.isset(file))
			{
				fileName = file.name;
				$tab.setLabel('<span>' + file.name + '</span>');
				$tab.getContent().setFilePath(file.path);
				var docType = getDocType(file.path);
				$tab.getContent().setLanguage(docType);
				workspacePanel.addFile(file);
				success = true;
			}
		}

		if (success === true)
		{
			$tab.getContent().setSaved(true);
			var message = '<p style="text-align: left;" >The file "' + fileName + '" has been saved.</p>';
			notifCenter.push(message, false);
			$this.checkSavedFiles();
		}

		return success;
	};

	this.save = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	var checkIfOpen = function($filePath)
	{
		var open = false;

		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			// S'il est ouvert, on met le focus sur son onglet
			if ($filePath === tabList[j].getContent().getFilePath())
			{
				tabList[j].select();
				open = true;
				j = tabList.length;
			}
		}

		return open;
	};

	this.updateRecentFiles = function($recentFiles)
	{
		itemOpenRecent.removeAllElements();

		for (var i = $recentFiles.recentFiles.length-1; i >= 0 ; i--)
		{
			var recentFileItem = new MenuItem($recentFiles.recentFiles[i]);

			itemOpenRecent.addElement(recentFileItem);

			recentFileItem.onAction = async function()
			{
				await $this.openFile(this.getLabel());
			};
		}
	};

	this.updateCodeLists = function($codeLists)
	{
		for (var i = 0; i < $codeLists.codeLists.length; i++)
			resourcesTabManager.addTab(new Tab('<span>' + $codeLists.codeLists[i].name + '</span>', new QuickCodePanel($codeLists.codeLists[i].name, $codeLists.codeLists[i].list)));

		resourcesTabManager.getTabList()[0].select();
	};

	this.updatePlugIns = function($plugIns)
	{
		menuBarItemInsert.removeAllElements();

		for (var i = 0; i < $plugIns.plugIns.length; i++)
		{
			var script = utils.create("script", { "type": "text/javascript", "src": $plugIns.plugIns[i] });
			document.getElementById('main').appendChild(script);
		}
	};

	this.addPlugInToMenu = function($plugin)
	{
		var pluginItem = new MenuItem($plugin.getName());
		menuBarItemInsert.addElement(pluginItem);
		pluginItem.plugin = $plugin;

		pluginItem.onAction = async function()
		{
			var popup = new UsePluginPopup(this.plugin);
			PEGUY.appendToScreen(popup);
		};
	};

	this.updateSavedStatus = function($saved)
	{
		var notSavedMark = '<span style="color: rgb(242, 98, 33); " >•</span> ';

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var tabLabel = selectedTab.getLabel();

			if ($saved === true)
			{
				var newLabel = tabLabel.replace(notSavedMark, '');
				selectedTab.setLabel(newLabel);
			}
			else if (tabLabel.indexOf(notSavedMark) < 0)
			{
				var newLabel = notSavedMark + tabLabel;
				selectedTab.setLabel(newLabel);
			}
		};
	};

	this.loadLastSession = async function($lastSession)
	{
		console.log($lastSession);

		await workspacePanel.setPath($lastSession.workspacePath);

		for (var i = 0; i < $lastSession.openFiles.length; i++)
		{
			const file = await window.electronAPI.openRecentFile($lastSession.openFiles[i]);

			if (utils.isset(file))
			{
				if (checkIfOpen(file.path) === false)
					createNewTab(file.name, file.path, file.content);
			}
			else
			{
				var message = '<p style="text-align: left;" >The file "' + $lastSession.openFiles[i]+ '" doesn\'t exist.</p>';
				notifCenter.push(message, false);
			}

			delay(100);
		}
	};
	
	this.resize = function()
	{
		tabManager.resize();
		resourcesTabManager.resize();
	};

	this.insertCode = function($codeToInsert)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.getContent().insertCode($codeToInsert);
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	//// File ////

	itemNew.onAction = function()
	{
		console.log("New");
		createNewTab("New file", "", '');
	};

	itemOpenFile.onAction = async function()
	{
		//console.log("Open file...");

		const filesList = await window.electronAPI.openFile();
		var tabList = tabManager.getTabList();

		for (var i = 0; i < filesList.length; i++)
		{
			if (checkIfOpen(filesList[i].path) === false)
				createNewTab(filesList[i].name, filesList[i].path, filesList[i].content);
		}
	};

	itemSave.onAction = async function()
	{
		//console.log("Save");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	itemSaveAs.onAction = async function()
	{
		//console.log("Save as...");

		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var code = selectedTab.getContent().getCode();

			const file = await window.electronAPI.saveFileAs(code);

			if (utils.isset(file))
			{
				selectedTab.setLabel('<span>' + file.name + '</span>');
				selectedTab.getContent().setFilePath(file.path);
				selectedTab.getContent().setSaved(true);
				var docType = getDocType(file.path);
				selectedTab.getContent().setLanguage(docType);
				workspacePanel.addFile(file);
				var message = '<p style="text-align: left;" >The file "' + file.name + '" has been saved.</p>';
				notifCenter.push(message, false);
				$this.checkSavedFiles();
			}
		}
	};

	//// Clavier ////

	Events.save = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	Events.saveAs = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	tabManager.connect('onDropFiles', onDropFiles);

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	
	
	// SET

	var $this = utils.extend(component, this);
	var timer = setInterval(function() { $this.focus(); }, 50);
	return $this;
}
	
// A la fin du fichier Javascript, on signale au module de chargement que le fichier a fini de charger.
if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("viewManager");