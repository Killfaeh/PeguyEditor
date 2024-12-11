const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',
{
	setNotSavedFiles: ($isNotSavedFiles) => ipcRenderer.send('setNotSavedFiles', $isNotSavedFiles), 
	loadSettingsInGUI: () => ipcRenderer.invoke('loadSettingsInGUI'),
	changeWorkspace: () => ipcRenderer.invoke('changeWorkspace'),
	loadWorkspace: ($filePath) => ipcRenderer.invoke('loadWorkspace', $filePath),
	loadSubWorkspace: ($filePath) => ipcRenderer.invoke('loadSubWorkspace', $filePath),
	openFile: () => ipcRenderer.invoke('openFile'),
	openRecentFile: ($filePath) => ipcRenderer.invoke('openRecentFile', $filePath),
	closeFile: ($filePath) => ipcRenderer.invoke('closeFile', $filePath),
	saveFileAs: ($content) => ipcRenderer.invoke('saveFileAs', $content),
	saveFile: ($filePath, $content) => ipcRenderer.invoke('saveFile', $filePath, $content),
	quit: () => ipcRenderer.send('quit'), 
})