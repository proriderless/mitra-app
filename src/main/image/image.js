const nodeFs = require("fs");
const nodePath = require("path");
const electronDialog = require("electron").dialog;
const electronIpcMain = require("electron").ipcMain;

function checkIfFileContainsExtension(validExtension, str) {
  return validExtension.some((substring) => str.includes(substring));
}

const getDirectories = source =>
  nodeFs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

function absoluteImagePaths(parentPath) {
  var imageFiles = []
  nodeFs.readdirSync(parentPath).forEach(file => {
      let filterList = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
      if (checkIfFileContainsExtension(filterList, file) === true) {
        imageFiles.push("mitra:///" + parentPath + nodePath.sep + file);
      }
    
  });

  return imageFiles
}

//Open image, takes in a optional parameter called parentDirectory
const openImageDirectorySelect = electronIpcMain.handle(
  "dialog:openImageDirectorySelect",
  (event, parentDirectory) => {

    let options = {
      title: "Select Directory Containing Images",
      properties: ["openDirectory"],
    };

    if (parentDirectory === "") {
      return electronDialog
        .showOpenDialog(options)
        .then(async (result) => {
          // Bail early if user cancelled dialog
          if (result.canceled) {
            return;
          }

          var imagePaths =  absoluteImagePaths(result.filePaths[0]);
          var directories = getDirectories(result.filePaths[0]);

          var returnObject = JSON.stringify({
            directories: directories,
            paths: imagePaths,
            directory: result.filePaths[0],
          });

          return returnObject;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //TO DO: CONVERT ABSOLUTE IMAGE PATH TO NON_ASYNC
      var imagePaths = absoluteImagePaths(parentDirectory);
      var directories = getDirectories(parentDirectory);

      var returnObject = JSON.stringify({
        paths: imagePaths,
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

module.exports = { openImageDirectorySelect };
