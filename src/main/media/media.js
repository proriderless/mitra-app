const nodeFs = require("fs");
const nodePath = require("path");
const electronDialog = require("electron").dialog;
const electronIpcMain = require("electron").ipcMain;

const preloadIPCID = ['dialog:openMediaFile', 'dialog:openMediaDirectorySelect']

function checkIfFileContainsExtension(validExtension, str) {
  return validExtension.some((substring) => str.endsWith(substring));
}

const getDirectories = source =>
  nodeFs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

function absoluteImagePaths(parentPath) {
  var imageFiles = []
  nodeFs.readdirSync(parentPath).forEach(file => {
      console.log("///// FILE TEST ////")
      console.log(file)
      console.log("///// FILE TEST ////")
      let filterList = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".JPG", ".JPEG", ".PNG", ".GIF", ".BMP"];
      if (checkIfFileContainsExtension(filterList, file) === true) {
        imageFiles.push("mitra:///" + parentPath + nodePath.sep + file);
      }
    
  });

  return imageFiles
}

function absoluteVideoPaths(parentPath) {
  var videoFiles = []
  nodeFs.readdirSync(parentPath).forEach(file => {
      let filterList = [".3g2", ".3gp", ".mp4", ".mov", ".webm", ".mkv"];
      if (checkIfFileContainsExtension(filterList, file) === true) {
        videoFiles.push("mitra:///" + parentPath + nodePath.sep + file);
      }
    
  });

  return videoFiles
}

//Convert file to base 64
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

const openVideoSelect = electronIpcMain.handle(
  "dialog:openMediaFile",
  (event) => {
    let options ={
      title: "Select Media to play",
      properties: ['openFile', 'showHiddenFiles', 'dontAddToRecent'],
      filters: [".3g2", ".3gp", ".mp4", ".mov", ".webm", ".mkv"],
    }
    
    return electronDialog.showOpenDialog(options)
    .then(async (result) => {
      if (result.canceled) {
        return;
      }
      return result.filePaths[0]
    })
    .catch(error => {
      console.log(error)
    })
  }
)

//Open Video plus Image, takes in a optional parameter called parentDirectory
const openImageDirectorySelect = electronIpcMain.handle(
  "dialog:openMediaDirectorySelect",
  (event, parentDirectory) => {

    let options = {
      title: "Select Directory Containing Media",
      properties: ["openDirectory"],
    };

    console.log("ARE YOU CALLED?")

    if (parentDirectory === "") {
      return electronDialog
        .showOpenDialog(options)
        .then(async (result) => {
          // Bail early if user cancelled dialog
          if (result.canceled) {
            return;
          }

          console.log("CALL ME! TOP")
          let imagePaths = absoluteImagePaths(result.filePaths[0]);
          let videoPaths = absoluteVideoPaths(result.filePaths[0])
          console.log(imagePaths)
          let directories = getDirectories(result.filePaths[0]);

          let returnObject = JSON.stringify({
            directories: directories,
            imagePaths: imagePaths,
            videoPaths: videoPaths,
            directory: result.filePaths[0],
          });

          return returnObject;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("CALL ME! BOTTOM")
      let imagePaths = absoluteImagePaths(parentDirectory);
      let videoPaths = absoluteVideoPaths(parentDirectory);
      let directories = getDirectories(parentDirectory);

      let returnObject = JSON.stringify({
        imagePaths: imagePaths,
        videoPaths: videoPaths,
        directory: parentDirectory,
        directories: directories,
      });

      return returnObject
    }

    // return electronDialog.showOpenDialog(window, options)
    //     .then((result) => {
    //         // Bail early if user cancelled dialog
    //         if (result.canceled) { return }

    //         return absoluteImagePaths(result.filePaths[0]);
    //     })
  }
);

module.exports = { openImageDirectorySelect, openVideoSelect, preloadIPCID };
