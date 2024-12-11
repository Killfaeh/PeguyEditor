function WorkspacePanel($path)
{
	///////////////
	// Attributs //
	///////////////

	var path = $path;
	var filesList = [];

	var component = new Component('<div class="workspacePanel" >'
									+ '<div id="topPanel" class="topPanel" >'
										+ '<input id="change-workspace-button" type="button" value="Change workspace" />'
										+ '<div id="refresh-icon" class="refresh-icon" ></div>'
									+ '</div>'
									+ '<div id="bottomPanel" class="panel bottomPanel" >'
									+ '</div>'
								+ '</div>');

	//// Bouton refresh ////

	var refreshIcon = Loader.getSVG('icons', 'refresh-icon', 20, 20);
	component.getById('refresh-icon').appendChild(refreshIcon);

	//// Arbre ////

	var tree = new Tree(false);
	tree.setEditMode(false);
	component.getById('bottomPanel').appendChild(tree);

	//////////////
	// Méthodes //
	//////////////

	var addFileToBranch = function($branch)
	{
		var popupHTML = '<h3>Create new file</h3>'
						+ '<p><input id="file-name" type="text" placeholder="File name" /></p>';

		var confirmPopup = new ConfirmPopup(popupHTML);

		confirmPopup.onOk = async function()
		{
			var isOk = false;

			var fileName = this.getById('file-name').value;

			if (!utils.isset(fileName) || fileName === '')
			{
				var errorPopup = new InfoPopup('<p style="text-align: left;" >The file name is missing.</p>');
				document.getElementById('main').appendChild(errorPopup);

				// Ajouter un contrôle si un fichier existe déjà ici
			}
			else
			{
				var filePath = fileName;

				if ($branch === tree)
					filePath = path + '/' + fileName;
				else
					filePath = $branch.path + '/' + fileName;

				filePath = filePath.replace(/\/+/, '/');

				const file = await window.electronAPI.saveFile(filePath, '');

				if (utils.isset(file))
				{
					$this.addFile(file);
					viewManager.createNewTab(file.name, file.path, file.content);
					isOk = true;
					confirmPopup.hide();
				}

				isOk = true;
			}

			return isOk;
		};

		document.getElementById('main').appendChild(confirmPopup);
	};

	var refreshBranch = async function($branch)
	{
		$branch.select();

		var output = await window.electronAPI.loadSubWorkspace($branch.path);

		if (utils.isset(output))
		{
			tree.emptyBranch($branch);
			loadBranch(output.files, $branch);
			tree.deselectAll();
		}
	};

	var loadBranch = function($list, $parent)
	{
		for (var i = 0; i < $list.length; i++)
		{
			var file = $list[i];

			if (file.isDirectory)
			{
				var html = '<span class="label-block" >'
								+ file.name
							+ '</span>';

				var branch = new TreeBranch(html, true);
				branch.name = file.name;
				branch.path = file.path;
				branch.dirPath = file.dirPath;
				tree.addElement(branch);
				loadBranch(file.children, branch);

				if (file.nbChildren > 0)
					branch.getById('arrow').style.display = 'inline';

				branch.onOpen = async function($element) { refreshBranch(this); };

				branch.onContextMenu = function($event)
				{
					Events.preventDefault($event);
					var mousePosition = document.getElementById('main').mousePosition($event);
					var contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);

					var refreshMenu = new MenuItem("Refresh");
					refreshMenu.branch = this;
					contextMenu.addElement(refreshMenu);
					refreshMenu.onAction = async function() { refreshBranch(this.branch); };

					var addFileMenu = new MenuItem("New file...");
					addFileMenu.branch = this;
					contextMenu.addElement(addFileMenu);
					addFileMenu.onAction = function() { addFileToBranch(this.branch); };
				};

				branch.closeAll();

				if (utils.isset($parent))
					$parent.select();
				else
					tree.deselectAll();
			}
			else
				addFileToTree(file);
		}
	};

	var updateTree = function()
	{
		tree.empty();
		loadBranch(filesList, null);
		tree.deselectAll();
		tree.closeAll();
	};

	var loadWorkspace = async function($path)
	{
		var output = await window.electronAPI.loadWorkspace($path);

		if (utils.isset(output))
		{
			path = output.path;
			filesList = output.files;
			updateTree();
		}
	};

	var addFileToTree = function($file)
	{
		var html = '<span class="label-block" >'
				+ $file.name
			+ '</span>';

		var leaf = new TreeLeaf(html);
		leaf.name = $file.name;
		leaf.path = $file.path;
		leaf.dirPath = $file.dirPath;
		leaf.mimeType = $file.mimeType;

		leaf.onClick = function($event)
		{
			Events.preventDefault($event);
			Events.stopPropagation($event);
		};

		leaf.onDblClick = function($event)
		{
			Events.preventDefault($event);
			Events.stopPropagation($event);

			var mimeType = this.mimeType;

			console.log("mimeType : " + mimeType);

			/*
			if (/^text\//.test(mimeType) || /^image\/svg\+xml/.test(mimeType) 
			|| /^application\/javascript/.test(mimeType) || /^application\/json/.test(mimeType) || /^application\/typescript/.test(mimeType)
			|| /^application\/xhtml\+xml/.test(mimeType)|| /^application\/xml/.test(mimeType))
			//*/
			{
				viewManager.openFile(this.path);
			}
		};

		leaf.onContextMenu = function($event) {};

		tree.addElement(leaf);

		return leaf;
	};

	this.addFile = function($file)
	{
		var branch = this.getBranchFromPath($file.dirPath);

		if (utils.isset(branch))
		{
			addFileToTree($file);
			$this.sortBranch(branch);
		}
	};

	this.sortBranch = function($branch)
	{
		if ($branch === tree || $branch.isOpen())
		{
			// Histoire d'avoir un joli petit tri alphabétique quand même
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	component.getById('change-workspace-button').onClick = async function()
	{
		var output = await window.electronAPI.changeWorkspace();

		if (utils.isset(output))
		{
			path = output.path;
			filesList = output.files;
			updateTree();
		}
	};

	refreshIcon.onClick = function() { loadWorkspace(path); };

	component.getById('bottomPanel').onContextMenu = function($event)
	{
		Events.preventDefault($event);
		var mousePosition = document.getElementById('main').mousePosition($event);
		var contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);

		var refreshMenu = new MenuItem("Refresh");
		contextMenu.addElement(refreshMenu);
		refreshMenu.onAction = async function() { loadWorkspace(path); };

		var addFileMenu = new MenuItem("New file...");
		addFileMenu.branch = this;
		contextMenu.addElement(addFileMenu);
		addFileMenu.onAction = function() { addFileToBranch(tree); };
	};

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getPath = function() { return path; };
	this.getTree = function() { return tree; };

	var getBranchFromPath = function($startBranch, $path)
	{
		var branch = null;

		var children = $startBranch.getElementsList();

		for (var i = 0; i < children.length; i++)
		{
			if (children[i].path === $path)
			{
				branch = children[i];
				i = children.length;
			}
			else if (!utils.isset(branch) && utils.isset(children[i].getElementsList))
				branch = getBranchFromPath(children[i], $path);
		}

		return branch;
	};

	this.getBranchFromPath = function($path)
	{
		var branch = null;

		branch = getBranchFromPath(tree, $path);

		if (utils.isset(branch))
			branch.select();
		else if ($path === path)
		{
			branch = tree;
			tree.deselectAll();
		}

		return branch;
	};
	
	// SET

	this.setPath = async function($path)
	{
		path = $path;
		loadWorkspace(path);
	};

	var $this = utils.extend(component, this);
	updateTree();
	return $this;
}
	
// A la fin du fichier Javascript, on signale au module de chargement que le fichier a fini de charger.
if (Loader !== undefined && Loader !== null)
	Loader.hasLoaded("workspacePanel");










