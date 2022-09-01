//Scheduler management
const electronDialog = require("electron").dialog;
const electronIpcMain = require("electron").ipcMain;
const nodeElectron = require("electron");
const startupFunc = require("../startup/startup");
const nodeFs = require("fs");

const mainFilePath = nodeElectron.app.getAppPath("appData");
const settingDirectory = mainFilePath + "\\mitra\\settings";
const scheduleFile = settingDirectory + "\\schedule.json"

//Local File Side

function createFilesIfMissing() {
    try {
        if (!nodeFs.existsSync(settingDirectory)) {
            startupFunc.runAllStartupFile;
        }
    } catch (e) {
        return false
    }

}

const updateScheduleFile = electronIpcMain.handle(
  "update:scheduleFile",
  (event, schedulerJSON) => {
    if (createFilesIfMissing() === false){
        return false
    }

    try {
        nodeFs.writeFileSync(scheduleFile, schedulerJSON, {
            encoding: 'utf-8',
            flag: 'w'
        })
        return true
    } catch (e) {
        return false
    }

  }
);

const retrieveScheduleFile = electronIpcMain.handle(
    "retrieve:scheduleFile",
    (event) => {
        //Create file if it doesn't exist
        if (!nodeFs.existsSync(scheduleFile)){
            let initJson = {schedule: []}
            nodeFs.writeFileSync(scheduleFile, JSON.stringify(initJson))
        }

        //Retrieve the file
        try{
            const data = nodeFs.readFileSync(scheduleFile, 'utf-8')
            return data
        } catch (e) {
            return false
        }
    }
)

module.exports = {updateScheduleFile, retrieveScheduleFile}