const utils = require("./utils");
const globals = require("./globals");

const getTabData = () => { return {
  label: 'Settings',
  submenu: [{
        label: 'Choose preferred server...',
        click: () => {
          // Open dialog to input preferred server
          utils.openPreferredServerDialog();
        },
      },
  {
    label: 'Auto-hide this menu (Alt to open again)',
    type: 'checkbox',
    checked: globals.autoHideMenu,
    click: () => {
      globals.autoHideMenu = !globals.autoHideMenu;
      globals.mainWindow.setAutoHideMenuBar(globals.autoHideMenu);
      globals.mainWindow.setMenuBarVisibility(!globals.autoHideMenu);
      utils.saveSettings();
    },
  },
  {
    label: 'Close utility windows instead of hiding', // When enabled, utility windows are completely closed rather than being hidden if they are toggled or exited. This can help save memory, but resets their position every toggle and might result in slower toggles.
    type: 'checkbox',
    checked: globals.closeUtilityWindows,
    click: () => {
      globals.closeUtilityWindows = !globals.closeUtilityWindows;
      utils.saveSettings();
    },
  }
  ]
}};

module.exports.getTabData = getTabData;