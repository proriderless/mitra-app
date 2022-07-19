const nodeFs = require("fs");
const nodePath = require("path");
const electronDialog = require("electron").dialog;
const electronIpcMain = require("electron").ipcMain;
const { SubtitleParser } = require("matroska-subtitles");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

const ffmpegCodecStream = electronIpcMain.handle(
  "codec:transformVideo",
  (event, streamURL) => {
    const readStream = nodeFs.createReadStream(streamURL);
    const outputStreamFile = nodeFs.createWriteStream(
      "D:\\Downloads\\outputFile.mp4"
    );

    ffmpeg.setFfmpegPath(ffmpegPath);

    ffmpeg(readStream)
      .format("mp4")
      .videoCodec("libx264")
      .on("end", function () {
        console.log("file has been converted succesfully");
      })
      .on("error", function (err) {
        console.log("an error happened: " + err.message);
      })
      // save to stream
      .pipe(outputStreamFile, { end: true }); //end = true, close output stream after writing

    // outputStreamFile.on('data', (chunk) => {
    //     console.log(chunk)
    //     event.sender.send('getFileStreamResponse', chunk)
    //   }).on('end', () => {
    //     console.log("end stream")
    //     event.sender.send('getFileStreamResponse', false)
    //     s.close()
    //   });
  }
);

//PROMISIFY EVENT EMITTER: https://stackoverflow.com/questions/45967019/nodejs-7-eventemitter-await-async

function returnSubtitles(streamerURL) {
  return new Promise((resolve, reject) => {
    const parser = new SubtitleParser();
    var recordTrack = [];
    parser.on("subtitle", (subtitle, trackNumber) => {
      recordTrack.push("Track " + trackNumber + ":", subtitle);
    });
    parser.on("finish", function() {
      console.log("finsihed!");
        console.log(recordTrack);
        resolve(recordTrack);
    })
    nodeFs
      .createReadStream(streamerURL).pipe(parser)
  });
}

function returnTracks(streamerURL) {
  return new Promise((resolve, reject) => {
    const parser = new SubtitleParser();
    var recordTrack = [];
    parser.on("tracks", (subtitle, trackNumber) => {
      recordTrack.push("Track " + trackNumber + ":", subtitle);
    });
    parser.once('tracks', (tracks) => {
      recordTrack.push(tracks)
    })
    parser.on("finish", function() {
      console.log("finsihed!");
        console.log(recordTrack);
        resolve(recordTrack);
    })
    nodeFs
      .createReadStream(streamerURL).pipe(parser)
  });
}

const retrieveSubtitle = electronIpcMain.handle(
  "video:getSubtitles",
  async (event, streamerURL) => {
    const tracks = await returnTracks(streamerURL)
    const subtitles = await returnSubtitles(streamerURL)
    return JSON.stringify({
      tracks,
      subtitles
    })
  }
);


module.exports = { ffmpegCodecStream, retrieveSubtitle };
