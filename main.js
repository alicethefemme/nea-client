// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')

function createStartupWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    // and load the startup.html of the app.
    mainWindow.loadFile('startup.html')

    // Load the main window.
    ipcMain.on('load-main', () => {
        // Change the size and unlock window.
        mainWindow.setMinimumSize(1280, 720);
        mainWindow.setSize(1280, 720);
        mainWindow.resizable = true;

        // Set the window to the new file.
        mainWindow.loadFile("index.html"); // Load the file into the main window which was defined.
    });

    ipcMain.on('load-settings', () => {
        let settingsWindow = new BrowserWindow({
            width: 800,
            height: 600,
            resizable: false,
            parent: mainWindow, // Sets this so the window knows what to open from.
            modal: false, // This makes the window a modal, so that you can't return to the parent without closing it first.
            show: false,
            frame: true
        });

        settingsWindow.loadFile('settings.html');

        settingsWindow.once('ready-to-show', () => {
            settingsWindow.show();

            settingsWindow.focus();

            settingsWindow.setAlwaysOnTop(true);

            mainWindow.setFocusable(false);
            mainWindow.setIgnoreMouseEvents(true);
        });

        settingsWindow.once('close', () => {
            mainWindow.setFocusable(true);
            mainWindow.setIgnoreMouseEvents(false);
        })
        //   TODO: Add a local datastore for settings.
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

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
