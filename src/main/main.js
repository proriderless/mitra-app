// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  protocol,
  Notification,
} = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const dotenv = require("dotenv").config();
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

//Custom process to run
const startupProcess = require("./startup/startup");
const torrent = require("./torrent/torrent");

//https://mmazzarolo.com/blog/2021-08-12-building-an-electron-application-using-create-react-app/

// webPreferences: {
//   preload: path.join(__dirname, preload.js),
//   nodeIntegration: true
// }

setupTitlebar();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "show",
    webPreferences: {
      nodeIntegrationInWorker: true,
      // preload: path.join(__dirname, "preload.js"),
      preload: `${__dirname}/preload.js`,
      webSecurity: false,
    },
  });

  console.log("TESTINGV222");
  console.log(`${__dirname}/preload.js`);

  // and load the index.html of the app.
  // mainWindow.loadURL(
  //   isDev
  //     ? "http://localhost:3000"
  //     : `file://${path.join(__dirname, "../build/index.html")}`
  // );

  mainWindow.loadURL(
    isDev ? "http://localhost:3000" : `file://${__dirname}/../../build/index.html`
  );

  // // mainWindow.loadURL(
  // //   `file://${path.join(__dirname, "../../build/index.html")}`
  // // );

  // mainWindow.loadURL(
  //   `file://${__dirname}/../../build/index.html`
  // );

  // const appURL = app.isPackaged
  //   ? url.format({
  //       pathname: path.join(__dirname, "index.html"),
  //       protocol: "file:",
  //       slashes: true,
  //     })
  //   : "http://localhost:3000";

  //mainWindow.loadURL(appURL);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  attachTitlebarToWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.removeAllListeners("ready");
  createWindow();

  //Run all the startup procedure
  startupProcess.runAllStartupFile();
  //Set up ENV variable on MAIN side
  dotenv;

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const protocolName = "mitra";

  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}:///`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  torrent.cleanupFiles();
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Startup Folder
startupProcess.openStartupFolder;

//For Getting images and directories!
const image = require("./media/media");
image.openImageDirectorySelect;
image.absoluteImagePaths;
image.openVideoSelect;

const subtitles = require("./subtitles/subtitles");
subtitles.ffmpegCodecStream;
subtitles.retrieveSubtitle;

//Local schedule file retrieval
const scheduler = require("./scheduler/scheduler");
scheduler.updateScheduleFile;
scheduler.retrieveScheduleFile;

const misc = require("./misc/misc");
misc.openExternalLink;

//The torrent require is on top because there is a on-close function it needs to run
torrent.openTorrentServer;
torrent.destroyTorrentServer;
torrent.handleReturnParsedScript;
