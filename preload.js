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
        console.log(channel, data);
        if (Object.keys(validChannels).includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
    settingsUpdate: (callback) => {
        ipcRenderer.on('update:settings', (value) => {
            callback(value)
        })
    }
});
