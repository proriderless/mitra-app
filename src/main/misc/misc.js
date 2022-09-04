const electronIpcMain = require("electron").ipcMain;
const nodeElectron = require("electron");

//Misc Function: Open link on external browser
const openExternalLink = electronIpcMain.handle(
    'misc:OpenExternalLink',
    (event, link) => {
        nodeElectron.shell.openExternal(link)
    }
)

module.exports = {openExternalLink}