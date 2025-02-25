// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, safeStorage} = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const {Settings} = require('./js/classes/settings')
const {Accounts, Account} = require('./js/classes/account')

// Define windows here so we can use them between functions.
let mainWindow;
let settingsWindow = null;

/**
 * Checks if the settings file has all the right headers.
 * @param settingData {Object} The JSON parsed contents of the file.
 * @returns {boolean} The validity of this content
 */
function checkSettingsHeadersForValid(settingData) {
    let settingsInfo = ['reloadTime', 'customLogPath']

    for (let header of settingsInfo) {
        if (!Object.keys(settingData).includes(header)) {
            return false;
        }
    }

    return true;
}

/**
 * Check an individual account for validity.
 * @param accountData {Object} The parsed JSON data with account.
 * @returns {boolean} The result of if the account is valid or not.
 */
function checkAccountForValid(accountData) {
    for(let header of Object.keys(accountData)) {
        if(!['name', 'ipAddr', 'username', 'password'].includes(header)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks the account data for all the right headers.
 * @param accountData {Object} The parsed JSON data from the file.
 * @returns {boolean} The result of if the file is valid or not.
 */
function checkAccountsForValid(accountData) {
    for(let account of accountData) {
        if(!checkAccountForValid(account)) {
            return false;
        }
    }

    return true;
}


/**
 * Gets the setting file from the user folder and reads the contents.
 * @returns {Object} The JSON array.
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

/**
 * Get the accounts from the local datastore.
 * @returns {Accounts} The Account object containing all the accounts.
 */
function getAccounts() {
    const appData = app.getPath('userData');
    const accountFile = path.join(appData, 'accounts.json');

    let fileData;

    if(fs.existsSync(accountFile)) {
        fileData = fs.readFileSync(accountFile, {encoding: 'utf8'});
        if(!checkAccountsForValid(JSON.parse(fileData))) {
            console.log('Account file invalid. Checking for valid accounts');

            // Check for valid accounts
            let validAccounts = [];
            for(let account of JSON.parse(fileData)) {
                if(checkAccountForValid(account)) {
                    validAccounts.concat(new Account(account['name'], account['ipAddr'], account['username'], account['password']));
                }
            }
            let accounts = new Accounts(validAccounts);

            dialog.showErrorBox('Account file invalid', 'The account file is invalid!' +
                `The following accounts are valid: ${accounts.getAccountNames()}. The app will proceed to load these into a new file.` );

            fs.writeFileSync(accountFile, JSON.stringify(accounts.accounts, null, 4), {encoding: 'utf8'});
            return accounts
        } else {
            console.log('Account file is valid. Creating account options.');

            // Create the account object.
            return new Accounts(JSON.parse(fileData));
        }
    } else {
        console.log('Account file nonexistent. Creating file.');

        let accounts = new Accounts([]);

        fs.writeFileSync(accountFile, JSON.stringify(accounts.accounts, null, 4), {encoding: 'utf8'});
        return accounts;
    }
}

/**
 * Adds a new account to the account file.
 * @param account {Account} the account you want to add to the file.
 */
function addAccount(account) {
    const appData = app.getPath('userData');
    const accountFile = path.join(appData, 'accounts.json');

    let accounts = getAccounts();
    accounts.addAccount(account);

    console.log(JSON.stringify(accounts));

    fs.writeFileSync(accountFile, JSON.stringify(accounts.accounts, null, 4), {encoding: 'utf8'});
}

/**
 * Deletes the account provided to the server.
 * @param accountToDelete {Account} The account name to delete from the accounts.
 */
function delAccount(accountToDelete) {
    let accounts = getAccounts();

    const deletedAccounts = new Accounts(accounts.accounts.filter((account) => {
        return account.name !== accountToDelete;
    }));

    const appData = app.getPath('userData');
    const accountFile = path.join(appData, 'accounts.json');

    fs.writeFileSync(accountFile, JSON.stringify(deletedAccounts.accounts, null, 4), {encoding: 'utf8'});
}

/**
 * Sets the setting file to the provided object.
 * @param settings The settings object that is provided.
 */
function setSettings(settings) {
    const appData = app.getPath('userData');
    const settingFile = path.join(appData, 'settings.json');

    fs.writeFileSync(settingFile, JSON.stringify(settings.getValues(), null, 4), {encoding: 'utf8'});
}

function createStartupWindow() {
    mainWindow = new BrowserWindow({
        width: 800, height: 600, resizable: false, webPreferences: {
            preload: path.join(__dirname, 'preload.js'), contextIsolation: true
        }
    })

    mainWindow.loadFile('./pages/startup.html')

    // Remove any references to the window provided that it is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
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

    settingsWindow.loadFile('./pages/settings.html');

    // settingsWindow.webContents.openDevTools();

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
 * FUNCTIONS FOR IPC MAIN
 */

// Load calls
ipcMain.on('load:main', () => {
    mainWindow.setMinimumSize(1280, 720);
    mainWindow.setSize(1280, 720);
    mainWindow.resizable = true;

    mainWindow.loadFile("./pages/index.html");
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

// Data calls
ipcMain.handle('get:data', (event, dataType) => {
    switch (dataType) {
        case 'settings': {
            return new Settings().fillFromJson(getSettings())
        } case 'accounts': {
            return getAccounts()
        }
    }
});

ipcMain.handle('set:data', (event, dataType, data) => {
    switch (dataType) {
        case 'account': {
            let account = new Account(data.name, data.ipAddr, data.username, data.password);
            addAccount(account);
            return null;
        }
        case 'settings': {
            setSettings(new Settings(data));
            return null;
        }
        case 'delaccount': {
            delAccount(data);
            return;
        }
    }
});

ipcMain.handle('protect:password', (event, data) => {
    if(process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text') {
        console.error('The system is not secure enough to run protective measures for user data. Closing application.');
        process.exit(1);
    }

    return safeStorage.encryptString(data);
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
