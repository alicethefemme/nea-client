const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, data) => {
        console.log(`${channel}, ${data}`);
        ipcRenderer.invoke(channel, data);
    },
    send: (channel, data) => {
        const validChannels = ['close:settings'];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, callback) => {
        const validChannels = ['get:data'];

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, callback);
        }
    }
})

