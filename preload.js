/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const {contextBridge, ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
});

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        const validChannels = ['load:main', 'load:settings'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    invoke: (channel, data) => {
        const validChannels = {'get:data': ['settings', 'accounts']};
        if (Object.keys(validChannels).includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
    protect: (channel, data) => {
        const validChannels = ['password']
        if(validChannels.includes(channel)) {
            return ipcRenderer.invoke('protect:password', data);
        }
    },
    store_data: (dataType, data) => {
        const validDatatypes = ['account', 'delaccount']
        if(validDatatypes.includes(dataType)) {
            return ipcRenderer.invoke('set:data', dataType, data);
        }
    },
    settingsUpdate: (callback) => {
        ipcRenderer.on('update:settings', (value) => {
            callback(value)
        })
    }
});
