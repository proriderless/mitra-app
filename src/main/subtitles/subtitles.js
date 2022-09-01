const nodeFs = require("fs");
const nodeZeroFill = require("zero-fill");
const nodePath = require("path");
const electronDialog = require("electron").dialog;
const electronIpcMain = require("electron").ipcMain;
const { SubtitleParser } = require("matroska-subtitles");
const ffmpeg = require("fluent-ffmpeg");
const { captureRejections } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

const preloadIPCID = ['video:getSubtitles', 'codec:transformVideo']

function isNullOrUndefinedOrEmptyString(s) {
  return !!s === false;
}

function msToTime(s, format = "vtt") {
  let milidelimit = ".";

  if (format === "srt") {
    milidelimit = ",";
  }

  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  return (
    nodeZeroFill(2, hrs) +
    ":" +
    nodeZeroFill(2, mins) +
    ":" +
    nodeZeroFill(2, secs) +
    milidelimit +
    nodeZeroFill(3, ms)
  );
}

//PROMISIFY EVENT EMITTER: https://stackoverflow.com/questions/45967019/nodejs-7-eventemitter-await-async

function createAssFormat(trackInfoHeader, trackInfoSubtitles) {
  //Add in the header information, before we move onto the subtitles
  let outputText = trackInfoHeader;

  //Subtitle processing
  for (subtitleText of trackInfoSubtitles) {
    let subtitleString = "";

    if (isNullOrUndefinedOrEmptyString(subtitleText.format)) {
      subtitleString += "Comment: ";
    } else {
      subtitleString += subtitleText.format + ": ";
    }

    subtitleString += subtitleText.layer + ",";
    subtitleString += msToTime(Number(subtitleText.time)) + ",";
    subtitleString +=
      msToTime(Number(subtitleText.time) + Number(subtitleText.duration)) + ",";
    subtitleString += subtitleText.style + ",";
    subtitleString += subtitleText.name + ",";
    subtitleString += subtitleText.marginL + ",";
    subtitleString += subtitleText.marginR + ",";
    subtitleString += subtitleText.marginV + ",";
    subtitleString += subtitleText.effect + ",";
    subtitleString += subtitleText.text + "\n";
    outputText += subtitleString;
  }

  return outputText;
}

function createVttFormat(trackInfoSubtitles) {
  let outputText = "WEBVTT\n\n";

  for (subtitleText of trackInfoSubtitles) {
    let subtitleString = "";
    subtitleString +=
      msToTime(Number(subtitleText.time)) +
      " --> " +
      msToTime(Number(subtitleText.time) + Number(subtitleText.duration)) +
      " align:middle\n";

    let cleanedSubtitleText = subtitleText.text;
    cleanedSubtitleText = subtitleText.text
      .replace("\\N", "\n")
      .replace(/{.+?}/g, "");
    subtitleString += cleanedSubtitleText + "\n\n";
    outputText += subtitleString;
  }

  return outputText;
}

function createSubtitleFile(trackInfo) {
  //For now, we pick the first item in the map
  const [trackSubtitleInfo] = trackInfo.values();
  let outputSubtitle = "";
  let fileType = "vtt"; //by right is let fileType = trackSubtitleInfo.type

  switch (fileType) {
    case "ass":
      outputSubtitle = createAssFormat(
        trackSubtitleInfo.header,
        trackSubtitleInfo.subtitles
      );
      break;
    case "vtt":
      outputSubtitle = createVttFormat(trackSubtitleInfo.subtitles);
      break;
    default:
      return false;
  }

  nodeFs.writeFileSync("testSubtitle.vtt", outputSubtitle);
  // nodeFs.writeFileSync(
  //   "testSubtitle." + trackSubtitleInfo.type,
  //   outputSubtitle
  // );
  return outputSubtitle;
}

function returnSubtitleTracks(streamerURL) {
  return new Promise((resolve, reject) => {
    const parser = new SubtitleParser();
    let tracks = new Map();

    //Declare the track head
    parser.once("tracks", (subtitleTracks) => {
      subtitleTracks.forEach((track) => {
        tracks.set(track.number, {
          type: track.type,
          language: track.language,
          language_name: track.name,
          header: track.header,
          subtitles: [],
        });
      });

      //If there are no subtitles, return false
      if (tracks.size === 0) {
        resolve(false);
      }
    });

    //Error
    parser.on("error", function (err) {
      reject(err);
    });

    parser.on("subtitle", (subtitle, trackNumber) =>
      tracks.get(trackNumber).subtitles.push(subtitle)
    );

    parser.on("finish", function () {
      resolve(tracks);
    });

    nodeFs.createReadStream(streamerURL).pipe(parser);
  });
}

//Where all the electron stuff happens

const retrieveSubtitle = electronIpcMain.handle(
  "video:getSubtitles",
  async (event, streamerURL) => {
    const tracks = await returnSubtitleTracks(streamerURL);
    let subtitleFile = ''

    if (tracks !== false){
      subtitleFile = createSubtitleFile(tracks);
    }

    return subtitleFile;
  }
);

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
  }
);

module.exports = { ffmpegCodecStream, retrieveSubtitle, preloadIPCID };
