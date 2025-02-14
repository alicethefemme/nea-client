// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const {Settings} = require('./js/classes/settings')

// Define windows here so we can use them between functions.
let mainWindow;
let settingsWindow = null;

/**
 * Checks if the settings file has all the right headers.
 * @param settingData Array The JSON parsed contents of the file.
 * @returns {boolean} The validity of this content
 */
function checkSettingsHeadersForValid(settingData) {
    let settingsInfo = {
        'reloadTime': Number, 'customLogPath': String
    }

    for (let header of Object.keys(settingsInfo)) {
        if (!Object.keys(settingData).includes(header)) {
            return false;
        }
        if (settingData[header].type === settingsInfo[header]) {
            return false;
        }
    }

    return true;
}


/**
 * Gets the setting file from the user folder and reads the contents.
 * @returns Array The JSON array.
 */
function getSettings()  {
    const appData = app.getPath('userData');
    const settingFile = path.join(appData, 'settings.json');

    let settings = new Settings();
    let fileData;

    if(fs.existsSync(settingFile)) {
        fileData = fs.readFileSync(settingFile, {encoding: 'utf8'});
        if(!checkSettingsHeadersForValid(JSON.parse(fileData))) {
            console.log('Setting file not valid. Replacing file.');
            fs.writeFileSync(settingFile, JSON.stringify(settings.getValues(), null, 4), {encoding: 'utf8'});
            return JSON.parse(JSON.stringify(settings.getValues()));
        } else {
            console.log('Setting file is valid. Returning settings.')
            return JSON.parse(fileData);
        }
    } else {
        console.log('Setting file nonexistent. Creating file.');
        fs.writeFileSync(settingFile, JSON.stringify(settings.getValues(), null, 4), {encoding: 'utf8'});
        return JSON.parse(JSON.stringify(settings.getValues()));
    }
}

function createStartupWindow() {
    mainWindow = new BrowserWindow({
        width: 800, height: 600, resizable: false, webPreferences: {
            preload: path.join(__dirname, 'preload.js'), contextIsolation: true
        }
    })

    mainWindow.loadFile('startup.html')

    // Remove any references to the window provided that it is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

function createSettingsWindow() {
    // Check that there is not an existing window first.
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        return;
    }

    settingsWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 800,
        height: 600,
        show: false,
        resizable: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, './js/settingsWindowPreload.js'), contextIsolation: true
        }
    });

    settingsWindow.loadFile('settings.html');

    settingsWindow.webContents.openDevTools();

    // To avoid white flickering, show the window only when HTML has been loaded.
    settingsWindow.on('ready-to-show', () => {
        settingsWindow.show();
    })

    // Close the window if instances do exist, else nothing happens.
    settingsWindow.on('closed', () => {
        if (settingsWindow && !settingsWindow.isDestroyed()) {
            settingsWindow = null;
        }
    });
}


/**
 * FUNCTIONS FOR IPCMAIN
 */

// Load calls
ipcMain.on('load:main', () => {
    mainWindow.setMinimumSize(1280, 720);
    mainWindow.setSize(1280, 720);
    mainWindow.resizable = true;

    mainWindow.loadFile("index.html");
});

ipcMain.on('load:settings', () => {
    createSettingsWindow();
});

// Close calls
ipcMain.on('close:settings', () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.close();
    }
})

ipcMain.handle('get:data', (event, dataType) => {
    switch (dataType) {
        case 'settings': {
            let returnVal = getSettings();
            console.log(`${returnVal} at HANDLE`);
            return returnVal
        }
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createStartupWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createStartupWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') app.quit()
    app.quit() // Overridden convention for development purposes.
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
