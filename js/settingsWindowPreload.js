const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
    send: (channel, data) => {
        const validChannels = ['close:settings'];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    store_data: (dataType, data) => {
        const validDataTypes = ['settings']
        if (validDataTypes.includes(dataType)) {
            return ipcRenderer.invoke('set:data', dataType, data);
        }
    }
})
