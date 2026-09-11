import {app, BrowserWindow, dialog, ipcMain} from 'electron'

const {exec} = require('child_process');
const getMac = require('getmac');
const http = require('http');
const os = require('os');
const md5 = require('md5');
import cfg from './config/globalCfg';

import auth from './auth'

const globalCfg = cfg();
import pushTrain from './task/pushTrain';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    dialog.showMessageBox({
        title: '启动软件异常..！',
        message: 'Caught exception: ' + err
    });
    app.quit();
});

function createWindow() {
    console.log('开始创建窗口...');
    global.equipment = {showTrain: 1};
    global.appId = 6;

    let promise = new Promise((resolve, reject) => {
        console.log('开始授权检查...');
        auth.isAuth(function (data) {
            console.log('授权检查结果:', data);
            if (!data.result) {
                dialog.showMessageBox({
                    title: '提示信息！',
                    message: data.message
                });
                app.quit();
            } else {
                resolve();
            }
        });
    });
    promise.then(function () {
        console.log('授权检查通过，开始创建窗口...');
        mainWindow = new BrowserWindow({
            height: 1080,
            useContentSize: true,
            width: 1920,
            minWidth: 1920,
            minHeight: 1080,
            frame: false,
            center: true,
            resizable: false,
            movable: false,
            maximizable: false,
            fullscreen: true,
            webPreferences: {
                webSecurity: false,
                devTools: process.env.NODE_ENV === 'development'
            }
        })

        let webContents = mainWindow.webContents;
        // webContents.openDevTools(); // 打开开发者工具以便调试
        webContents.on('did-finish-load', () => {
            console.log('页面加载完成...');
            webContents.setZoomFactor(1);
            webContents.setVisualZoomLevelLimits(1, 1);
            webContents.setLayoutZoomLevelLimits(0, 0);
        });

        mainWindow.on('closed', () => {
            console.log('窗口被关闭...');
            mainWindow = null
        })

        mainWindow.on('ready-to-show', () => {
            console.log('窗口准备显示...');
        });

        mainWindow.on('show', () => {
            console.log('窗口显示...');
        });

        mainWindow.loadURL(winURL);
    }).catch(function(error) {
        console.error('创建窗口过程中发生错误:', error);
    });
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
})
if (shouldQuit) {
    app.quit()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.on('close', e => {
    console.log("close.............................");
    closeProcess(globalCfg.closeApp);
    //sync.saveQuitTime();
    if (process.platform === 'win32') {
        let taskkill_command = 'taskkill /F /IM ' + globalCfg.closeApp;
        console.log('关闭服务...' + taskkill_command);
        exec(taskkill_command, {maxBuffer: 5000 * 1024}, function (err, stdout, stderr) {
        });
    }
    if (process.env.NODE_ENV === 'development') {
        app.quit()
    } else {
        // exec('shutdown -s -t 0');
        app.quit()
    }
});

/*
ipcMain.on('check-update-data', function (event, msg) {
    sync.checkUpdate(event, function (result) {
        event.sender.send('check-update-data', result);
    });
});
*/

/*ipcMain.on('check-equipment-data', function (event, msg) {
    sync.checkEquipment(event, function (result) {
        event.sender.send('check-equipment-data', result);
    });
});*/

ipcMain.on('openDialog', (event, param) => {
    console.info('trigger openDialog')
    // dialog.showOpenDialog({properties: ['openFile']},function(filePaths ){
    //     if (filePaths&&filePaths.length > 0) {
    //         param.filePath = filePaths[0];
    //         event.sender.send("openDialog", param);
    //     }
    // })
});

ipcMain.on('closeApp', e => {
    app.quit()
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
function closeProcess(name) {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        stdout.split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
            let pid = processMessage[1];
            if (processName.endsWith(name)) {
                if (process.platform === 'win32') {
                    let taskkill_command = 'taskkill /F /IM ' + processName;
                    console.log('关闭服务...' + taskkill_command);
                    exec(taskkill_command, {maxBuffer: 5000 * 1024}, function (err, stdout, stderr) {
                        if (err) {
                            console.log('关闭服务异常：' + err);
                            return false;
                        }
                        console.log('服务关闭成功');
                        return true;
                    });
                } else if (pid) {
                    try {
                        process.kill(Number(pid), 'SIGKILL');
                    } catch (e) {
                        console.log('关闭服务异常：' + e);
                    }
                }
            }
        })
    })
}


// 数据库初始化
require('./db/init')
// 引入api
require('./api/index')
///////////////////////////////引入controller//////////////////////////////////////////////
require('./controller');


