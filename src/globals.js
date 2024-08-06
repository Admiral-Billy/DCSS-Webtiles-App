let onStart = true;
let mainWindow;
let wikiWindow;
let closeUtilityWindows = false;
let darkMode = false;
let autoHideMenu = false;
let hideCursor = false;
let latestAppReleaseUrl = 'https://api.github.com/repos/Admiral-Billy/DCSS-Webtiles-App/releases/latest';
let $ = require('jquery');
let preferredServer;
let httpOptions = {
  headers: {
    'User-Agent': 'DCSS-Webtiles-App',
  }
};
let discordEnabled = true;

module.exports.onStart = onStart;
module.exports.mainWindow = mainWindow;
module.exports.wikiWindow = wikiWindow;
module.exports.closeUtilityWindows = closeUtilityWindows;
module.exports.darkMode = darkMode;
module.exports.autoHideMenu = autoHideMenu;
module.exports.hideCursor = hideCursor;
module.exports.latestAppReleaseUrl = latestAppReleaseUrl;
module.exports.httpOptions = httpOptions;