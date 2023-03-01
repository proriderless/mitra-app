const WebTorrent = require("webtorrent")
const worker = require("./worker")
const electronIpcMain = require("electron").ipcMain;

//Create a webtorrent global instance
const client = new WebTorrent();
var server

//Initialize all the eventListner
//worker

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
      client.on("done", function(){
        server.close();
      })
    });
    
  }
);

const destroyTorrentServer = electronIpcMain.handle(
    "torrent:destroyTorrentClient",
    (event) => {
        cleanupServer
    }
)

function cleanupServer() {
    if (server != null){
        console.log("close!!")
        server.close()
    }
}

module.exports = { openTorrentServer, destroyTorrentServer };
