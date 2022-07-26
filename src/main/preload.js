const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

const ipc = {
    'render': {
        // From render to main.
        'send': [],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': [
            'dialog:openMediaDirectorySelect', // Channel name
            'codec:transformVideo',
            'video:getSubtitles'
        ]
    }
};

contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'ipcRenderer', {
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
