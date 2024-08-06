let onStart = true;
let mainWindow;
let wikiWindow;
let closeUtilityWindows = false;
let autoHideMenu = false;
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
module.exports.autoHideMenu = autoHideMenu;
module.exports.latestAppReleaseUrl = latestAppReleaseUrl;
module.exports.httpOptions = httpOptions;