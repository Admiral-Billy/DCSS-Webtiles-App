const globals = require("./globals");
const {
  app,
} = require('electron');
const path = require('path');
const fs = require('fs');
const utils = require("./utils");

const getTabData = () => { return {
  label: 'File',
  submenu: [{
    label: 'Toggle fullscreen',
    accelerator: 'F11',
    click: handleClick_ToggleFullscreen
  },
  {
    label: 'Toggle console',
    accelerator: 'F12',
    click: handleClick_ToggleConsole
  },
  {
    label: 'Reload',
    accelerator: 'CommandOrControl+R',
    click: handleClick_Reload
  },
  {
    label: 'Reload (invisible)',
    accelerator: 'F5',
    click: handleClick_Reload,
    visible: false,
    acceleratorWorksWhenHidden: true
  },
  {
    label: 'Reload + clear cache',
    accelerator: 'CommandOrControl+F5',
    click: handleClick_ReloadAndClear
  },
  { type: 'separator' },
  {
    label: 'Quit',
    click: handleClick_Quit
  }
  ]
}};

function handleClick_ToggleFullscreen() {
  globals.mainWindow.setFullScreen(!globals.mainWindow.isFullScreen());
}

function handleClick_ToggleConsole() {
  globals.mainWindow.webContents.toggleDevTools();
}

function handleClick_Reload() {
  utils.resetGame();
}

function handleClick_ReloadAndClear() {
  clearCache();
}

function handleClick_Quit() {
  globals.mainWindow.close();
}

// Implementations

function clearCache() {
  // Set a flag to indicate that the cache should be cleared on the next launch
  app.commandLine.appendSwitch('clear-cache');

  // Relaunch the app
  app.relaunch({
    args: process.argv.slice(1).concat(['--clear-cache'])
  });

  // Quit the current instance
  app.quit();
}

module.exports.getTabData = getTabData;