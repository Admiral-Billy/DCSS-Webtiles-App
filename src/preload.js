const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendPreferredServer: (serverLink) => ipcRenderer.send('preferred-server', serverLink)
});