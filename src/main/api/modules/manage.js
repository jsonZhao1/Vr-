const {ipcMain} = require('electron')
const {dialog} = require('electron')
const {default: {MANAGE}} = require('../../constant/channelConstants')
const {default: {MANAGE_DB}} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const fsUtils = require('../../utils/fsUtils')
const {aseEncode, aseDecode} = require('../../utils/encryptUtils')
const process = require('process');
const path = require('path');
const os = require('os')
const compressing = require('compressing')
const pathUtils = require('../../utils/pathUtils')

const {error, success} = require('../../common/result')

const desPwd = 'yyhvr888';


const fs = require("fs");
const yauzl = require('yauzl');

/**

 /**
 * 校验管理密码
 **/
ipcMain.on(MANAGE.VALIDATE_PASSWORD, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'pwd'}).then(res => {
        let password = '';
        if (res) {
            password = aseDecode(res['value'], desPwd);
        } else {
            password = '123456';
        }
        if (status.password != password) {
            event.sender.send(MANAGE.VALIDATE_PASSWORD, error('密码错误！'));
        } else {
            event.sender.send(MANAGE.VALIDATE_PASSWORD, success('密码正确！'));
        }
    })
})


/**
 * 更改管理密码
 **/
ipcMain.on(MANAGE.UPDATE_PASSWORD, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'pwd'}).then(res => {
        let password = '';
        if (res) {
            password = aseDecode(res['value'], desPwd);
            if (status.oldPassword != password) {
                event.sender.send(MANAGE.UPDATE_PASSWORD, error('原始密码错误，请检查！'));
            } else {
                dbUtils.updateByParam(MANAGE_DB, {config: 'pwd'}, {value: aseEncode(status.newPassword, desPwd)}).then(() => {
                    event.sender.send(MANAGE.UPDATE_PASSWORD, success('修改密码成功', {}))
                })
            }
        } else {
            password = '123456';
            if (status.oldPassword != password) {
                event.sender.send(MANAGE.UPDATE_PASSWORD, error('原始密码错误，请检查！'));
            } else {
                dbUtils.insertOne(MANAGE_DB, {config: 'pwd', value: aseEncode(status.newPassword, desPwd)}).then(() => {
                    event.sender.send(MANAGE.UPDATE_PASSWORD, success('修改密码成功', {}))
                })
            }
        }

    })
})

/**
 * 保存LOGO
 **/
ipcMain.on(MANAGE.SAVE_LOGO, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'logo'}).then(res => {
        if (res) {
            dbUtils.updateByParam(MANAGE_DB, {config: 'logo'}, status).then(() => {
                event.sender.send(MANAGE.SAVE_LOGO, success('保存LOGO成功！'))
            })
        } else {
            status.config = 'logo'
            dbUtils.insertOne(MANAGE_DB, status).then(() => {
                event.sender.send(MANAGE.SAVE_LOGO, success('保存LOGO成功!', {}))
            })
        }

    })
})


/**
 * 保存BANNER
 **/
ipcMain.on(MANAGE.SAVE_BANNER, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'banner'}).then(res => {
        if (status.location == '清除') {
            dbUtils.deleteByID(MANAGE_DB, {_id: res._id}).then(res => {
                event.sender.send(MANAGE.SAVE_BANNER, res)
            })
        } else {
            if (res) {
                dbUtils.updateByParam(MANAGE_DB, {config: 'banner'}, status).then(() => {
                    event.sender.send(MANAGE.SAVE_BANNER, success('保存成功！'))
                })
            } else {
                status.config = 'banner'
                dbUtils.insertOne(MANAGE_DB, status).then(() => {
                    event.sender.send(MANAGE.SAVE_BANNER, success('保存成功!', {}))
                })
            }

        }
    })
})

/**
 * 查询BANNER
 **/
ipcMain.on(MANAGE.READ_BANNER, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'banner'}).then(res => {
        event.sender.send(MANAGE.READ_BANNER, success('查询成功！', res))
    })
})

/**
 * 查询logo
 **/
ipcMain.on(MANAGE.READ_LOGO, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'logo'}).then(res => {
        event.sender.send(MANAGE.READ_LOGO, success('查询成功！', res))
    })
})

/**
 * 查询logo
 **/
ipcMain.on(MANAGE.HELP_CONFIG, (event, status = {}) => {
    event.sender.send(MANAGE.HELP_CONFIG, success('查询成功！', {
        videoPath: pathUtils.resolveInstallFile('help', 'help.mp4'),
        documentPath: pathUtils.resolveInstallFile('help', 'document.html')
    }))
})

/**
 * 查询实名制配置
 **/
ipcMain.on(MANAGE.RNS_CONFIG, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'rns'}).then(res => {
        if (!res) {
            event.sender.send(MANAGE.RNS_CONFIG, success('查询成功！', false))
        } else {
            event.sender.send(MANAGE.RNS_CONFIG, success('查询成功！', res.value))
        }

    })
})

/**
 * 查询实名制配置
 **/
ipcMain.on(MANAGE.SAVE_RNS, (event, status = {}) => {
    dbUtils.getByParam(MANAGE_DB, {config: 'rns'}).then(res => {
        if (res) {
            dbUtils.updateByParam(MANAGE_DB, {config: 'rns'}, status).then(() => {
                event.sender.send(MANAGE.SAVE_RNS, success('保存成功！'))
            })
        } else {
            status.config = 'rns'
            dbUtils.insertOne(MANAGE_DB, status).then(() => {
                event.sender.send(MANAGE.SAVE_RNS, success('保存成功!', {}))
            })
        }
    })
})


/**
 * 导出系统配置
 **/
ipcMain.on(MANAGE.EXPORT_CONFIG, (event, status = {}) => {
    let dirPath = dialog.showOpenDialog({properties: ['openDirectory']});
    if (!dirPath) {
        event.sender.send(MANAGE.EXPORT_CONFIG, error('导出失败,请选择导出文件夹！'))
    } else {
        const exportFile = path.join(dirPath[0], '云艺化VR内容系统配置文件.zip');
        compressing.zip
            .compressDir(pathUtils.getStorageRoot(), exportFile)
            .then(() => {
                event.sender.send(MANAGE.EXPORT_CONFIG, success('导出成功！', exportFile))
            })
            .catch(err => {
                console.error(err);
                event.sender.send(MANAGE.EXPORT_CONFIG, error('导出失败！'))
            });
    }

})

/**
 * 重置系统配置
 **/
ipcMain.on(MANAGE.RESET_CONFIG, (event, status = {}) => {
    fsUtils.delDir(pathUtils.getStorageRoot());
    event.sender.send(MANAGE.RESET_CONFIG, success('重置成功！', ''))
})

/**
 * 导入系统配置
 **/
ipcMain.on(MANAGE.IMPORT_CONFIG, (event, status = {}) => {
    let dirPaths = dialog.showOpenDialog({properties: ['openFile']});
    if (!dirPaths) {
        event.sender.send(MANAGE.IMPORT_CONFIG, error('导入失败,请选择导入文件！'))
    } else {
        let dirPath = dirPaths[0];
        let ext = dirPath.substr(dirPath.lastIndexOf(".") + 1);
        if (ext != 'zip') {
            event.sender.send(MANAGE.IMPORT_CONFIG, error('导入失败,请选择导入zip文件！'))
        } else {
            yauzl.open(dirPath, {lazyEntries: true}, function (err, zipfile) {
                if (err) throw err;
                zipfile.readEntry();
                zipfile.on("entry", function (entry) {
                    let filePath = pathUtils.resolveInside(pathUtils.getStorageRoot(), entry.fileName);
                    if (/\/$/.test(entry.fileName)) {
                        pathUtils.ensureDirSync(filePath);
                        zipfile.readEntry();
                        return;
                    }
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function () {
                            zipfile.readEntry();
                        });
                        pathUtils.ensureDirSync(path.dirname(filePath));
                        readStream.pipe(fs.createWriteStream(filePath));
                    });
                }).on("close", function () {
                    event.sender.send(MANAGE.IMPORT_CONFIG, success('导入成功！'))
                });
            });
        }
    }
})



