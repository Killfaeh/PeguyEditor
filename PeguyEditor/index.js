
///////////////////////
// Appel des modules //
///////////////////////

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require("os");
const fs = require('fs');
//const { parse } = require("csv-parse");
const csv = require('csvtojson');
const mime = require('mime-types');

var mainWindow = null;

////////////////////////
// Options par défaut //
////////////////////////

const userHomeDir = os.homedir();

var isNotSavedFiles = false;
var recentFiles = { recentFiles: [] };
var lastSession = { workspacePath: '', openFiles: [] };
var codeLists = [];

///////////////
// Fonctions //
///////////////

//// Utilitaires ////

function updateRecentFiles($filePath)
{
	var index = recentFiles.recentFiles.indexOf($filePath);

	if (index >= 0)
		recentFiles.recentFiles.splice(index, 1);

	recentFiles.recentFiles.push($filePath);

	if (recentFiles.recentFiles.length > 15)
		recentFiles.recentFiles.shift();

	fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/recentFiles.json', JSON.stringify(recentFiles));

	mainWindow.webContents.executeJavaScript("viewManager.updateRecentFiles(" + JSON.stringify(recentFiles) + ");");
}

function addFileToSession($filePath)
{
	var index = lastSession.openFiles.indexOf($filePath);

	if (index < 0)
		lastSession.openFiles.push($filePath);

	fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', JSON.stringify(lastSession));
}

function removeFileFromSession($filePath)
{
	var index = lastSession.openFiles.indexOf($filePath);

	if (index >= 0)
		lastSession.openFiles.splice(index, 1);

	fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', JSON.stringify(lastSession));
}

async function loadCodeLists()
{
	var files = fs.readdirSync('CodeLists');

	for (var file of files)
	{
		if (/\.csv$/.test(file))
		{
			var filepath = path.join('CodeLists', file);
			var codeList = { name: file.replace(/\.csv$/, ''), list: [] };

			var jsonArray = await csv({ delimiter: ':', quote:'"' }).fromFile(filepath);

			for (var i = 0; i < jsonArray.length; i++)
				codeList.list.push({ label: jsonArray[i].label, keywords: jsonArray[i].keywords, code: jsonArray[i].code });

			codeLists.push(codeList);
		}
	}

	files = fs.readdirSync(userHomeDir + '/Documents/Peguy/CodeEditor/CodeLists');

	for (var file of files)
	{
		if (/\.csv$/.test(file))
		{
			var filepath = path.join(userHomeDir + '/Documents/Peguy/CodeEditor/CodeLists', file);
			var codeList = { name: file.replace(/\.csv$/, ''), list: [] };

			var jsonArray = await csv({ delimiter: ':', quote:'"' }).fromFile(filepath);

			for (var i = 0; i < jsonArray.length; i++)
				codeList.list.push(jsonArray[i]);

			codeLists.push(codeList);
		}
	}
}

var fileTypeIsOk = function($filePath)
{
	var isOK = false;

	const mimeType = mime.lookup($filePath);

	console.log(mimeType);

	if (/^text\//.test(mimeType) || /^image\/svg\+xml/.test(mimeType) 
				|| /^application\/javascript/.test(mimeType) || /^application\/json/.test(mimeType) || /^application\/typescript/.test(mimeType)
				|| /^application\/xhtml\+xml/.test(mimeType)|| /^application\/xml/.test(mimeType))
	{
		isOK = true;
	}

	return isOK;
};

//// Appelée par l'interface graphique ////

function handleSetNotSavedFiles($event, $isNotSavedFiles)
{
	isNotSavedFiles = $isNotSavedFiles;
}

async function handleLoadSettingsInGUI()
{
	console.log("Load settings");
	mainWindow.webContents.executeJavaScript("viewManager.updateRecentFiles(" + JSON.stringify(recentFiles) + ");");
	mainWindow.webContents.executeJavaScript("viewManager.updateCodeLists(" + JSON.stringify({ codeLists: codeLists }) + ");");
	mainWindow.webContents.executeJavaScript("viewManager.loadLastSession(" + JSON.stringify(lastSession) + ");");
}

var parseFilesList = function($folderPath)
{
	var filesList = [];
	var tmpList = [];

	var files = fs.readdirSync($folderPath);

	for (var file of files)
	{
		if (file !== '.DS_Store')
		{
			var filePath = path.join($folderPath, file);
			const mimeType = mime.lookup(filePath);

			if (fs.statSync(filePath).isDirectory())
			{
				//var subFiles = parseFilesList(filePath);
				//var subFiles = [];
				var subFiles = fs.readdirSync(filePath);
				var row = { isDirectory: true, name: file, path: filePath, dirPath: $folderPath, nbChildren: subFiles.length, children: [] };
				filesList.push(row);
			}
			else
			{
				var row = { isDirectory: false, name: file, path: filePath, dirPath: $folderPath, mimeType: mimeType };
				tmpList.push(row);
			}
		}
	}

	for (var i = 0; i < tmpList.length; i++)
		filesList.push(tmpList[i]);

	return filesList;
};

async function handleChangeWorkspace()
{
	var output = { path: '', files: [] };

	var dir = await dialog.showOpenDialog({ properties: ["openDirectory"] });
	
	console.log(dir);

	if (!dir.canceled)
	{
		var dirPath = dir.filePaths[0];
		output = { path: dirPath, files: parseFilesList(dirPath) };
		lastSession.workspacePath = dirPath;
		fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', JSON.stringify(lastSession));
	}
	else
		output = null;

	return output;
}

async function handleLoadWorkspace($event, $filePath)
{
	var output = { path: '', files: [] };

	//console.log("Open workspace : " + $filePath);

	if (fs.existsSync($filePath))
	{
		output = { path: $filePath, files: parseFilesList($filePath) };
		lastSession.workspacePath = $filePath;
		fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', JSON.stringify(lastSession));
	}
	else
		output = null;

	//console.log(output);

	return output;
}

async function handleLoadSubWorkspace($event, $filePath)
{
	var output = { path: '', files: [] };

	//console.log("Open workspace : " + $filePath);

	if (fs.existsSync($filePath))
		output = { path: $filePath, files: parseFilesList($filePath) };
	else
		output = null;

	//console.log(output);

	return output;
}

async function handleOpenFile()
{
	var output = [];

	const { canceled, filePaths } = await dialog.showOpenDialog();
	
	if (!canceled)
	{
		for (var i = 0; i < filePaths.length; i++)
		{
			var filePath = filePaths[i];

			//if (fileTypeIsOk(filePath))
			{
				if (fs.existsSync(filePath))
				{
					const mimeType = mime.lookup(filePath);
					var tmp = filePath.split('/');
					var fileName = tmp[tmp.length-1];
					var fileContent = fs.readFileSync(filePath, "utf8");
					output.push({ name: fileName, path: filePath, dirPath: filePath.replace(fileName, '').replace(/\/$/, ''), mimeType: mimeType, content: fileContent});
					addFileToSession(filePath);
					updateRecentFiles(filePath);
				}
			}
		}
	}

	return output;
}

async function handleOpenRecentFile($event, $filePath)
{
	var output = null;

	if (fs.existsSync($filePath))
	{
		const mimeType = mime.lookup($filePath);
		var tmp = $filePath.split('/');
		var fileName = tmp[tmp.length-1];
		var fileContent = fs.readFileSync($filePath, "utf8");
		output = { name: fileName, path: $filePath, dirPath: $filePath.replace(fileName, '').replace(/\/$/, ''), mimeType: mimeType, content: fileContent};
		addFileToSession($filePath);
		updateRecentFiles($filePath);
	}
	else
		removeFileFromSession($filePath);

	return output;
}

async function handleCloseFile($event, $filePath)
{
	var output = { success: true };
	removeFileFromSession($filePath);
	return output;
}

async function handleSaveFileAs($event, $content)
{
	var output = null;

	const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow);

	if (!canceled && filePath)
	{
		var tmp = filePath.split('/');
		var fileName = tmp[tmp.length-1];
		fs.writeFileSync(filePath, $content);
		const mimeType = mime.lookup(filePath);
		output = { name: fileName, path: filePath, dirPath: filePath.replace(fileName, '').replace(/\/$/, ''), mimeType: mimeType, content: $content};
		addFileToSession(filePath);
		updateRecentFiles(filePath);
	}

	return output;
}

async function handleSaveFile($event, $filePath, $content)
{
	var output = null;

	var tmp = $filePath.split('/');
	var fileName = tmp[tmp.length-1];
	fs.writeFileSync($filePath, $content);
	const mimeType = mime.lookup($filePath);
	output = { name: fileName, path: $filePath, dirPath: $filePath.replace(fileName, '').replace(/\/$/, ''), mimeType: mimeType, content: $content};
	addFileToSession($filePath);
	updateRecentFiles($filePath);

	return output;
}

function handleQuit()
{
	app.quit();
};

////////////////////////////////
// Démarrage de l'application //
////////////////////////////////

// Initialisation des options par défaut

if (!fs.existsSync(userHomeDir + '/Documents/Peguy'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/CodeEditor'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy/CodeEditor');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/CodeEditor/CodeLists'))
	fs.mkdirSync(userHomeDir + '/Documents/Peguy/CodeEditor/CodeLists');

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/CodeEditor/recentFiles.json'))
	fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/recentFiles.json', JSON.stringify(recentFiles));
else
{
	var fileContent = fs.readFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/recentFiles.json', "utf8");
	recentFiles = JSON.parse(fileContent);
}

if (!fs.existsSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json'))
	fs.writeFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', JSON.stringify(lastSession));
else
{
	var fileContent = fs.readFileSync(userHomeDir + '/Documents/Peguy/CodeEditor/lastSession.json', "utf8");
	lastSession = JSON.parse(fileContent);
}

loadCodeLists();

// Fonction de création d'une fenêtre
function createWindow ()
{
	// Création et paramétrage d'une fenêtre
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1200,
		webPreferences:
		{
			preload: path.join(__dirname, 'preload.js'),
			//contextIsolation: false,
            nodeIntegration: true
		}
	});

	mainWindow.on('close', ($e) => {
		if (isNotSavedFiles === true)
		{
			$e.preventDefault();
			mainWindow.webContents.executeJavaScript("viewManager.confirmCloseApp();");
		}
	});

	// Charger une page HTML dans la fenêtre
	mainWindow.loadFile('index.html');

	//mainWindow.webContents.openDevTools() // Affiche automatiquement la console de débugage
}

// Déclencher l'ouverture de la fenêtre uniquement lorsqu'électron a fini de se charger.
app.whenReady().then(() =>
{
	ipcMain.on('setNotSavedFiles', handleSetNotSavedFiles);
	ipcMain.handle('loadSettingsInGUI', handleLoadSettingsInGUI);
	ipcMain.handle('changeWorkspace', handleChangeWorkspace);
	ipcMain.handle('loadWorkspace', handleLoadWorkspace);
	ipcMain.handle('loadSubWorkspace', handleLoadSubWorkspace);
	ipcMain.handle('openFile', handleOpenFile);
	ipcMain.handle('openRecentFile', handleOpenRecentFile);
	ipcMain.handle('closeFile', handleCloseFile);
	ipcMain.handle('saveFileAs', handleSaveFileAs);
	ipcMain.handle('saveFile', handleSaveFile);
	ipcMain.on('quit', handleQuit);

	createWindow();
	
	app.on('activate', function ()
	{
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow();
	});
});

app.on('window-all-closed', function () { app.quit(); });