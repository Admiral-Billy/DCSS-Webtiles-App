const {
  ElectronBlocker
} = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');
const utils = require("./utils");
const globals = require("./globals");

const getTabData = () => { return {
  label: 'Utilities',
  submenu: [{
    label: 'Wiki',
    click: () => {
      if (globals.wikiWindow) {
        if (globals.wikiWindow.isVisible()) {
          if (globals.closeUtilityWindows) {
            globals.wikiWindow.close();
            globals.wikiWindow = null;
          } else {
            globals.wikiWindow.hide();
          }
          globals.mainWindow.focus(); // Set focus to the main window
        } else {
          globals.wikiWindow.show();
          globals.wikiWindow.focus(); // Set focus to the wiki window
        }
      } else {
        createWikiWindow();
      }
    }
  }
  ]
}};

// Create the wiki window
async function createWikiWindow() {
  globals.wikiWindow = utils.createWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: 'icons/PR',
    webPreferences: {
      nodeIntegration: false
    }
  });

  // Initialize the ad blocker for the wiki window
  const wikiWindowBlocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  wikiWindowBlocker.enableBlockingInSession(globals.wikiWindow.webContents.session);

  globals.wikiWindow.loadURL('http://crawl.chaosforge.org/Crawl_Wiki');

  // Enable back and forward navigation
  globals.wikiWindow.webContents.on('did-finish-load', () => {
    globals.wikiWindow.focus(); // Set focus to the wiki window
    globals.wikiWindow.webContents.executeJavaScript(`
            const style = document.createElement('style');
            style.innerHTML = '\
                .navigation-buttons {\
                    position: fixed;\
                    top: 10px;\
                    left: 10px;\
                    z-index: 9999;\
                }\
                .navigation-button {\
                    background-color: #333;\
                    color: #fff;\
                    border: none;\
                    border-radius: 4px;\
                    padding: 6px 12px;\
                    margin-right: 5px;\
                    cursor: pointer;\
                }\
            ';
            document.head.appendChild(style);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'navigation-buttons';

            const backButton = document.createElement('button');
            backButton.className = 'navigation-button';
            backButton.innerText = 'Back';
            backButton.addEventListener('click', () => {
                window.history.back();
            });
            buttonsContainer.appendChild(backButton);

            const forwardButton = document.createElement('button');
            forwardButton.className = 'navigation-button';
            forwardButton.innerText = 'Forward';
            forwardButton.addEventListener('click', () => {
                window.history.forward();
            });
            buttonsContainer.appendChild(forwardButton);

            const homeButton = document.createElement('button');
            homeButton.className = 'navigation-button';
            homeButton.innerText = 'Home';
            homeButton.addEventListener('click', () => {
                window.location.href = 'http://crawl.chaosforge.org/Crawl_Wiki';
            });
            buttonsContainer.appendChild(homeButton);

            document.body.appendChild(buttonsContainer);
        `);
  });

  globals.wikiWindow.on('close', (event) => {
    if (globals.wikiWindow && !globals.closeUtilityWindows) {
      event.preventDefault();
      globals.wikiWindow.hide(); // Hide the window instead of closing it
    } else {
      globals.wikiWindow = null;
    }
    if (globals.mainWindow) {
      globals.mainWindow.focus();
    }
  });
}

module.exports.getTabData = getTabData;