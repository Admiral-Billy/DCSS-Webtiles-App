// Importing required modules
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const fs = require('fs');

const globals = require("./globals");
const utils = require("./utils");

utils.updateMenu();

// Create the main application window
async function createWindow() {
  globals.mainWindow = new BrowserWindow({
    width: 1280,
    height: 750,
    autoHideMenuBar: true,
    menuBarVisible: false,
    icon: 'icons/PR',
    show: false,
    webPreferences: {
	  preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: false,
      enableRemoteModule: true,
      persistSessionStorage: true,
      persistUserDataDirName: 'WebtilesApp'
    }
  });

  utils.loadSettings();
  utils.applyCursorHide();

  utils.updateMenu();

  globals.mainWindow.on('close', () => {
    utils.saveSettings();
  });

  globals.mainWindow.on('closed', async () => {
    globals.mainWindow = null;

    // Close the wiki window if it's open
    if (globals.wikiWindow) {
      globals.wikiWindow.close();
      globals.wikiWindow = null;
    }

    app.quit();
  });
  
  if (globals.preferredServer !== "")
  {
	  globals.mainWindow.loadURL(globals.preferredServer);
  }
  else
  {
	  globals.mainWindow.loadURL('https://crawl.develz.org/play.htm');
  }
  globals.mainWindow.show();

  globals.mainWindow.webContents.on('did-finish-load', () => {
    if (globals.onStart) {
      setTimeout(() => {
        // Load the settings after the game has finished loading
        utils.loadSettings();
        globals.mainWindow.center();
        globals.onStart = false;
      }, 100);
    }
  });

}

// Handle app events
app.whenReady().then(() => {
  // Check if the --clear-cache flag is present
  if (process.argv.includes('--clear-cache')) {
    const userDataPath = app.getPath('userData');
    const settingsFilePath = path.join(userDataPath, 'settings.json');
    const localStorageDirPath = path.join(userDataPath, 'Local Storage');

    // Get all files and directories in the user data path
    const files = fs.readdirSync(userDataPath);

    // Delete all files and directories except for settings.json and Local Storage folder
    files.forEach(file => {
      const filePath = path.join(userDataPath, file);
      if (filePath !== settingsFilePath && filePath !== localStorageDirPath) {
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmdirSync(filePath, {
            recursive: true
          });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Remove the --clear-cache flag from the command line arguments
    app.commandLine.removeSwitch('clear-cache');
  }
	
  createWindow();
});

// Handle preferred server input
ipcMain.on('preferred-server', (event, serverLink) => {
  globals.preferredServer = serverLink;
  utils.saveSettings();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});