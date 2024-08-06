const fs = require('fs');
const https = require('https');
const path = require('path');
const {
  app,
  Menu,
} = require('electron');
const globals = require("./globals");
const { BrowserWindow, dialog } = require('electron');

const { getTabData: getAboutTabData } = require("./about_tab");
const { getTabData: getSettingsTabData} = require("./settings_tab");
const { getTabData: getUtilitiesTabData} = require("./utilities_tab");
const { getTabData: getEditTabData} = require("./edit_tab");
const { getTabData: getFileTabData } = require("./file_tab");

function createWindow(opts) {
  const { BrowserWindow } = require('electron');
  opts = opts ?? {};
  const defaultOpts = {
    icon: 'icons/PR',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  };
  opts = {...defaultOpts, ...opts};
  const win = new BrowserWindow(opts);
  if(opts.enableDeveloperConsole === true)
    win.webContents.toggleDevTools();
  return win;
}

function createPopup(opts, content) {
  opts = opts ?? {};
  const window = createWindow({
    width: 300,
    height: 150,
    autoHideMenuBar: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    parent: globals.mainWindow,
    modal: true,
    alwaysOnTop: true,
    ...opts
  });
  if(content)
    window.loadURL(`data:text/html,${encodeURIComponent(content)}`);
  return window;
}

function openPreferredServerDialog() {
  const preferredServer = globals.preferredServer || '';
  let inputWindow = new BrowserWindow({
    width: 400,
    height: 200,
    parent: globals.mainWindow,
    modal: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  const inputDialogPath = path.join(__dirname, '../input-dialog.html');

  inputWindow.loadURL(`file://${inputDialogPath}?preferredServer=${encodeURIComponent(preferredServer)}`);
  inputWindow.on('closed', () => {
    inputWindow = null;
  });

  inputWindow.setMenuBarVisibility(false);
}

function fetchCurrentAppVersionInfo() {
  return new Promise((resolve, _reject) => {
    resolve(app.getVersion())
  });
}

function fetchLatestAppVersionInfo(opts) {
  opts = opts ?? {};
  const options = {
    headers: {
      'User-Agent': 'DCSS-Webtiles-App',
    },
    ...opts
  }
  return new Promise((resolve, reject) => {
    https.get(globals.latestAppReleaseUrl, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          resolve(JSON.parse(data))
        }
        catch (error) {
          console.error('Error parsing release data:', error);
          reject(new Error('Failed to parse the release data.'));
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching latest release:', error);
      reject(error);
    });
  });
}

function saveSettings() {
  const userDataPath = app.getPath('userData');
  const settingsFilePath = path.join(userDataPath, 'settings.json');

  const settings = {
    closeUtilityWindows: globals.closeUtilityWindows,
    darkMode: globals.darkMode,
    windowSize: globals.mainWindow.getSize(),
    isFullScreen: globals.mainWindow.isFullScreen(),
    isMaximized: globals.mainWindow.isMaximized(),
    autoHideMenu: globals.autoHideMenu,
	preferredServer: globals.preferredServer
  };

  fs.writeFileSync(settingsFilePath, JSON.stringify(settings));
}

function loadSettings() {
  const userDataPath = app.getPath('userData');
  const settingsFilePath = path.join(userDataPath, 'settings.json');

  let useDefault = false;

  if (fs.existsSync(settingsFilePath)) {
    try {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf-8');
      const settings = JSON.parse(settingsData);
      globals.closeUtilityWindows = settings.closeUtilityWindows;
      globals.darkMode = settings.darkMode;
      globals.autoHideMenu = settings.autoHideMenu;
	  globals.preferredServer = settings.preferredServer || '';

      // Set the window size, fullscreen state, and maximized state
      if (globals.onStart) {
        if (settings.windowSize) {
          globals.mainWindow.setSize(settings.windowSize[0], settings.windowSize[1]);
        }
        globals.mainWindow.center();
        if (settings.isFullScreen) {
          globals.mainWindow.setFullScreen(true);
        } else if (settings.isMaximized) {
          globals.mainWindow.maximize();
        }
      }
	
      // Apply the auto-hide menu setting
      globals.mainWindow.setAutoHideMenuBar(globals.autoHideMenu);
      globals.mainWindow.setMenuBarVisibility(!globals.autoHideMenu);
    } catch (error) {
      console.log(`Error ${error}: Can't open settings file.`);
      useDefault = true;
    }
  }
  else {
    useDefault = true;
  }
	
  if (useDefault) {
    globals.closeUtilityWindows = false;
    globals.darkMode = false;
    globals.autoHideMenu = false;

    // Apply the auto-hide menu setting
    globals.mainWindow.setAutoHideMenuBar(globals.autoHideMenu);
    globals.mainWindow.setMenuBarVisibility(!globals.autoHideMenu);
  }
}

function resetGame() {
  if (globals.preferredServer !== "")
  {
	  globals.mainWindow.loadURL(globals.preferredServer);
  }
  else
  {
	  globals.mainWindow.loadURL('https://crawl.develz.org/play.htm');
  }
  globals.mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      loadSettings();
      updateMenu();
    }, 100);
  });
}

function updateMenu() {
  const tabs = [
    getFileTabData(),
    getSettingsTabData(),
    getUtilitiesTabData(),
    getEditTabData(),
    getAboutTabData()
  ];
  const menu = Menu.buildFromTemplate(tabs);
  Menu.setApplicationMenu(menu);
}

module.exports.createWindow = createWindow; 
module.exports.createPopup = createPopup; 
module.exports.fetchCurrentAppVersionInfo = fetchCurrentAppVersionInfo;
module.exports.fetchLatestAppVersionInfo = fetchLatestAppVersionInfo;
module.exports.saveSettings = saveSettings;
module.exports.loadSettings = loadSettings;
module.exports.resetGame = resetGame;
module.exports.updateMenu = updateMenu;
module.exports.openPreferredServerDialog = openPreferredServerDialog;