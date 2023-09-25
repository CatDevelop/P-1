const {app, BrowserWindow, ipcMain, shell,globalShortcut , dialog } = require('electron');
const path = require('path');
const fs = require("fs");
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');
const electronLocalshortcut = require('electron-localshortcut');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 779,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true
        },
    });
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setTitle("P-1")
    mainWindow.loadURL("http://localhost:3000/");

    mainWindow.webContents.on("will-navigate", function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    electronLocalshortcut.register(mainWindow, 'CommandOrControl+S', () => {
        mainWindow.webContents.send('shortcutS');
    })

    // globalShortcut.register('CommandOrControl+S', () => {
    //     mainWindow.webContents.send('shortcutS');
    // })

    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    createWindow()}
)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
});


