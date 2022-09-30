const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

const mediaPreloadIPCID = [
  "dialog:openMediaFile",
  "dialog:openMediaDirectorySelect",
];
const subtitlesPreloadIPCID = ["video:getSubtitles", "codec:transformVideo"];
const startupPreloadIPCID = ["folder:openStartupFolder"];
const schedulerLocalFilePreloadIPCID = [
  "update:scheduleFile",
  "retrieve:scheduleFile",
];
const miscPreloadIPCID = ["misc:OpenExternalLink"]

const fullSendReceiveIPCID = [
  mediaPreloadIPCID,
  subtitlesPreloadIPCID,
  startupPreloadIPCID,
  schedulerLocalFilePreloadIPCID,
  miscPreloadIPCID
].flat(1);

const ipc = {
  render: {
    // From render to main.
    send: [],
    // From main to render.
    receive: [],
    // From render to main and back again.
    sendReceive: fullSendReceiveIPCID,
  },
};

contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods.
  "ipcRenderer",
  {
    // From render to main.
    send: (channel, args) => {
      let validChannels = ipc.render.send;
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, args);
      }
    },
    // From main to render.
    receive: (channel, listener) => {
      let validChannels = ipc.render.receive;
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`.
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
      }
    },
    // From render to main and back again.
    invoke: (channel, args) => {
      let validChannels = ipc.render.sendReceive;
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
      }
    },
    sendSync: (channel, args) => {
      let validChannels = ipc.render.sendSync;
      if (validChannels.includes(channel)) {
        ipcRenderer.sendSync(channel, args);
      }
    },
  }
);

contextBridge.exposeInMainWorld('envVars', {
  SERVER_URL: process.env.SERVER_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  SERVER_URL_LOCAL: process.env.SERVER_URL_LOCAL,
});
