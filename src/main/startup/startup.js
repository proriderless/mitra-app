//This mainly focuses on startup procedures
const nodeFs = require("fs");
const nodePath = require("path");
const nodeElectron = require("electron")
const electronIpcMain = require("electron").ipcMain;

//Untouched
const mainFilePath = nodeElectron.app.getAppPath('appData')
const settingDirectory = mainFilePath + "\\mitra\\settings"

//IPC handle
const preloadIPCID = ['folder:openStartupFolder']

//Get the software main folder
function createSettingsFolder() {

    if (!nodeFs.existsSync(settingDirectory)){
        nodeFs.mkdirSync(settingDirectory, {recursive: true})
    }

}

function createJsonSettingsFile() {

    if (!nodeFs.existsSync(settingDirectory)){
        console.log("folder not found")
        return false
    }

    const settingsFile = settingDirectory + "/settings.json"

    if (!nodeFs.existsSync(settingsFile)){
        let initJson = {settings: {}}
        nodeFs.writeFileSync(settingsFile, JSON.stringify(initJson));
    }
    
}

function createScheduleFile() {
    if (!nodeFs.existsSync(settingDirectory)){
        console.log('folder not found')
        return false
    }

    const scheduleFile = settingDirectory + "/schedule.json"
    
    if (!nodeFs.existsSync(scheduleFile)){
        let initJson = {schedule: []}
        nodeFs.writeFileSync(scheduleFile, JSON.stringify(initJson))
    }
}

function createRecurringScheduleFile() {
    if (!nodeFs.existsSync(settingDirectory)){
        console.log('folder not found')
        return false
    }

    const recurringScheduleFile = settingDirectory + "/schedule_rec.json"

    if (!nodeFs.existsSync(recurringScheduleFile)){
        let initJson = {rec_schedule: []}
        nodeFs.writeFileSync(recurringScheduleFile, JSON.stringify(initJson))
    }
}

function runAllStartupFile() {
    createSettingsFolder()
    createJsonSettingsFile()
    createScheduleFile()
    createRecurringScheduleFile()
}

const openStartupFolder = electronIpcMain.handle(
    "folder:openStartupFolder",
    (event) => {

        nodeElectron.shell.openPath(settingDirectory)
      
    })

module.exports = { runAllStartupFile, openStartupFolder, preloadIPCID };

