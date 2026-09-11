const {ipcMain, dialog, Notification, BrowserWindow, Menu} = require('electron');
import cfg from '../config/globalCfg';

const globalCfg = cfg();
const {execFile, spawn, exec} = require('child_process');
const {ParsedPath} = require('path');
const os = require('os');
const nedb = require('nedb');
const fs = require('fs');
const path = require('path');
const pathUtils = require('../utils/pathUtils');
const db = new nedb({
    filename: pathUtils.getDbPath('program.db'),
    autoload: false,
    inMemoryOnly: false,
    timestampData: false
});

/**
 * 根据进程名称关闭程序
 * @param name
 * @param cb
 */
function viewProcessMessage(name, cb) {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        stdout.split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
            if (processName === name) {
                return cb(processMessage[1])
            }
        })
    })
}

/**
 * 打开应用程序
 */
global.isOpen = false;
ipcMain.on('exec', function (event, param) {
    // 获取执行程序的路径，
    if (!global.isOpen || true) {
        try {
            console.log(param.src)
            if (!fs.existsSync(param.src)) {
                global.isOpen = false;
                let notify = new Notification({
                    title: '温馨提示',
                    body: '您访问的VR应用失联了，先去体验其他VR应用吧！',
                    silent: true
                });
                notify.show();
                return;
            }
            // const ls = spawn(param.src);
            // 使用exec打开程序
            const ls = spawn(param.src, [], {
                cwd: path.dirname(param.src),
                detached: true,
                stdio: 'ignore',
                windowsHide: true
            });
            ls.on('error', error => {
                if (error) {
                    console.error(`spawn error: ${error}`);
                    return;
                }
            });
            ls.unref();
            // // 记录执行的程序
            // global.pid = ls.pid;
            // 使用exec打开程序
            global.pid = param.pid;

            // 发送提示消息
            // event.sender.send('wait-message',ls);
            // 使用exec打开程序
            event.sender.send('wait-message',param);

            // closeWin.webContents.openDevTools();
            Menu.setApplicationMenu(null);
            // 计算点击次数
            db.loadDatabase();

            db.findOne({_id: param._id}, function (err, doc) {
                // 获取点击次数
                console.log(doc);
                let count = doc.click ? doc.click : 0;
                if (!count) {
                    count = 1;
                } else {
                    count++;
                }
                db.update({_id: param._id}, {$set: {click: count}})
            });

        } catch (e) {
            let notify = new Notification({
                title: '温馨提示',
                body: '您访问的VR应用失联了，先去体验其他VR应用吧！',
                silent: true
            });
            notify.show();
        }

    }

})

function closeProcess(name) {
    const logFile = pathUtils.getLogFilePath('exec.log');
    pathUtils.ensureDirSync(path.dirname(logFile));
    fs.appendFileSync(logFile, "开始关闭程序");
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            fs.appendFileSync(logFile, err.toString() + "出错");
            return console.error(err)
        }
        stdout.split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/)
            let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
            fs.appendFileSync(logFile, "processName:" + processName + " name:" + name + " endwith:" + processName.endsWith(name));
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
                } else if (processMessage[1]) {
                    try {
                        process.kill(Number(processMessage[1]), 'SIGKILL');
                    } catch (e) {
                        console.log('关闭服务异常：' + e);
                    }
                }
            }
        })
    })
}









