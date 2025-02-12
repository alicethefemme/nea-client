// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const Settings = require('./js/classes/settings.js')

/**
 * Checks if the settings file has all the right headers.
 * @param settingData Array The JSON parsed contents of the file.
 * @returns {boolean} The validity of this content
 */
function checkValiditySettings(settingData) {
  if(settingData){

  }

  return false;
}


function getSettings() {
  const appData = app.getPath('userData');

  const settingFile = path.join(appData, 'settings.json');
  let settings = new Settings();

  fs.readFile(settingFile, 'utf-8', (err, data) => {
    if(err) {
      fs.writeFile(settingFile, JSON.stringify(settings.getValues()), (err) => {
        console.error(err);
      });
      console.log('Generated default values for file which does not exist.')
    }
    const fileData = JSON.parse(data);

    if(!checkValiditySettings(fileData)) {
      fs.writeFile(settingFile, JSON.stringify(settings.getValues()), (err) => {
        console.error(err);
      });
      console.log('Generated default values for file which doesn\'t have correct or valid values');
    }

    console.log('Finished settings!')
  })

}

function createStartupWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  mainWindow.loadFile('startup.html')

  // Load the main application window
  ipcMain.on('load-main', () => {
    mainWindow.setMinimumSize(1280, 720);
    mainWindow.setSize(1280, 720);
    mainWindow.resizable = true;

    mainWindow.loadFile("index.html");
  });

  ipcMain.on('load-settings', () => {
    let settingsWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 800,
      height: 600,
      resizable: false
    });

    settingsWindow.loadFile('settings.html');
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

ipcMain.handle('get-data', (dataType) => {
  switch (dataType) {
    case 'settings': getSettings()
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createStartupWindow()

  getSettings()

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
