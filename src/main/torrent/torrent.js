const WebTorrent = require("webtorrent");
const worker = require("./worker");
const electronIpcMain = require("electron").ipcMain;
const antimony = require("anitomyscript");
const nodeElectron = require("electron");
const fs = require("fs");
const path = require("path");

//Create a webtorrent global instance
const client = new WebTorrent();
var server;

//Initialize all the eventListner
const openTorrentServer = electronIpcMain.handle(
  "torrent:openTorrentServer",
   (event, magnetURI) => {

    const torrentFiles = client.add(magnetURI, function (torrent) {
      // create HTTP server for this torrent
      server = torrent.createServer();
      server.listen(1500); // start the server listening to a port

      // visit http://localhost:<port>/ to see a list of files

      // access individual files at http://localhost:<port>/<index> where index is the index
      // in the torrent.files array

      client.on("error", function () {
        server.close();
      });

      //Can close the server as we have the files!
      client.on("done", function () {
        server.close();
      });
    });
  }
);

const handleReturnParsedScript = electronIpcMain.handle(
  "torrent:returnParsedTitles",
  async (event, titles) => {
    let resultingArray = [];

    //Allow us to identify the index
    let starting_i = 0;

    for (let title of titles) {
      let convertedRes = await antimony(title);
      convertedRes["item_index"] = starting_i;
      resultingArray.push(convertedRes);
      starting_i += 1;
    }

    return resultingArray;
  }
);

const destroyTorrentServer = electronIpcMain.handle(
  "torrent:destroyTorrentClient",
  (event) => {
    cleanupServer();
  }
);

function cleanupServer() {
  if (server != null) {
    console.log("close!!");
    server.close();
  }
}

function cleanupFiles() {
  //This function cleans up all the temp files stored inside!
  let tempFilePath = nodeElectron.app.getPath("temp") + "\\webtorrent";

  fs.readdir(tempFilePath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(tempFilePath, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = {
  openTorrentServer,
  destroyTorrentServer,
  handleReturnParsedScript,
  cleanupFiles,
};
