import cfg from './config/globalCfg';
import {app, dialog, ipcMain} from "electron";

const globalCfg = cfg();
const request = require("request");
const http = require('http');
const qs = require('querystring');
const fs = require("fs");
const path = require("path");
const yauzl = require('yauzl');
const os = require('os');
const pathUtils = require('./utils/pathUtils');

const neDb = require('nedb');
const Axios = require('axios');
const SDTime = require("silly-datetime");
const password = 'yyhvr';

const { aseEncode,aseDecode} = require('./utils/encryptUtils')

var syncIndex = 0;
var downIndex = 0;
var eventWindow;
// 实例化连接对象（不带参数默认为内存数据库）
const db = new neDb({
    filename: pathUtils.getDbPath('system.db'),
    autoload: true,
    inMemoryOnly: false,
    timestampData: false
});


// 实例化连接对象（不带参数默认为内存数据库）
function syncServerData(credential, callback) {
    createMustDir();
    // 生成加密后的mac地址
    if (!fs.existsSync(path.join(globalCfg.lib_path, 'uuid.properties'))) {
        fs.writeFileSync(path.join(globalCfg.lib_path, 'uuid.properties'), global.credential);
    }

    validateOnline().then(online => {
        if (online) {
            request(globalCfg.server_url + '/api/equipment/checkExist?credential=' + credential, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let result = JSON.parse(body);
                    if (!result.data || result.data == null) {
                        register(credential, function (result) {
                            //将配置文件写入本地
                            setLocalData(result, function () {
                                callback(result);
                            });
                        });
                    } else {
                        //将配置文件写入本地
                        setLocalData(result, function () {
                            syncEquipmentData(function () {
                                callback(result);
                            });
                        });
                    }
                } else {
                    //服务器问题，连接失败，返回本地数据
                    //网络问题，连接失败，返回本地数据
                    getLocalData(function (data) {
                        callback(data);
                    })
                }
            });
        } else {
            //网络问题，连接失败，返回本地数据
            getLocalData(function (data) {
                callback(data);
            })
        }
    });
    global.loginTime = SDTime.format(new Date(), "YYYY-MM-DD HH:mm");
    saveLoginTime();
}

// 实例化连接对象（不带参数默认为内存数据库）
async function validateOnline() {
    return new Promise((resolve, reject) => {
        request({
            url: 'http://cloud.yyhvr.cn:81/api/equipment/checkExist',
            timeout: 3000
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("================HHHHHHHHHHHHHHHHH");
                console.log(body);
                let result = JSON.parse(body);
                if (result && result.code == 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
}


function register(credential, callback) {
    // Build the post string from an object
    let post_data = qs.stringify({
        credential: credential
    });
    // An object of options to indicate where to post to
    let post_options = {
        host: globalCfg.server_ip,
        path: '/api/equipment/register',
        port: globalCfg.server_port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    // Set up the request
    let post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(JSON.parse(chunk));
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();
}

function syncEquipmentData(callback) {
    let ge = getEquipmentOperation();
    let gp = getProgramClick();
    Promise.all([ge, gp]).then((result) => {
        console.log(result);
        // Build the post string from an object
        let params = {
            credential: credential,
            operationRecord: result[0].length > 0 ? JSON.stringify(result[0]) : '',
            clickRecord: result[1].length > 0 ? JSON.stringify(result[1]) : ''
        };
        let post_data = qs.stringify(params);
        // An object of options to indicate where to post to
        let post_options = {
            host: globalCfg.server_ip,
            path: '/api/equipment/updateEquipmentOperation',
            port: globalCfg.server_port,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(post_data)
            }
        };
        // Set up the request
        let post_req = http.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                //同步成功后清除数据
                db.remove({
                    type: 'equipmentOperation',
                    loginTime: {
                        $ne: global.loginTime
                    }
                }, {multi: true}, function () {
                    db.remove({
                        type: 'programClick'
                    }, {multi: true}, function () {
                        callback();
                    });
                });
            });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
    }).catch((error) => {
        console.log(error)
    })
}


function createMustDir() {
    pathUtils.ensureDirSync(globalCfg.lib_path);
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.icons_path));
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.background_path));
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.programs_path));
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.gzip_path));
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.videos_path));
    pathUtils.ensureDirSync(path.join(globalCfg.lib_path, globalCfg.images_path));
}

function getLocalData(callback) {

    db.findOne({
        type: 'equipmentData'
    }, function (err, doc) {
        if (!doc) {
            callback({});
        } else {
            let data = {};
            try {
                data = JSON.parse(aseDecode(doc.data, password));
            } catch (e) {
                callback({});
            }
            callback(data);
        }
    });
}

function setLocalData(data, callback) {
    db.remove({
        type: 'equipmentData'
    }, {multi: true}, function (err, doc) {
        data = aseEncode(JSON.stringify(data), password);
        db.insert({type: 'equipmentData', datetime: global.loginTime, data: data}, function () {
            callback();
        })
    });
}

function checkUpdate(event, callback) {
    eventWindow = event;
    validateOnline().then(online => {
        if (online) {
            request(globalCfg.server_url + '/api/equipment/checkUpdate?credential=' + global.credential, function (error, response, body) {
                //开始更新
                if (!error && response.statusCode == 200) {
                    let result = JSON.parse(body);
                    result = result.data;

                    //开始更新
                    if (!result.classifyList || result.classifyList.length == 0) {
                        callback("not data");
                    } else {
                        saveServerData(result, function () {
                        });
                        callback(result);
                    }
                } else {
                    callback("error");
                }
            });

        } else {
            callback("error");
        }
    });
}

/**
 * 返回同步结果到服务器
 * @param taskId
 * @param callback
 */
function callbackServer(taskId, callback) {
    let post_data = qs.stringify({
        credential: credential,
        taskId: taskId
    });
    // An object of options to indicate where to post to
    let post_options = {
        host: globalCfg.server_ip,
        path: '/api/equipment/updateCallback',
        port: globalCfg.server_port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    // Set up the request
    let post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(JSON.parse(chunk));
        });
    });
    // post the data
    post_req.write(post_data);
    post_req.end();

}

function saveServerData(result, callback) {


    //获取树结构
    let classifyList = result.classifyList;
    //获取待同步的软件
    let executablePrograms = result.executablePrograms;
    //获取已同步的软件
    let originalPrograms = result.originalPrograms;

    //清除重复软件
    //deleteRepeatPrograms(originalPrograms);
    downloadClassifyFile(classifyList).then(function () {
            downIndex = 0;

            if (originalPrograms.length > 0) {

                saveOriginalProgramData(originalPrograms, function () {
                    if (executablePrograms.length == 0) {
                        callback({message: "无数据无需同步"});
                    } else {
                        syncIndex = 0;
                        saveExecutableProgramData(executablePrograms);
                    }
                });
            } else {
                if (executablePrograms.length == 0) {
                    callback({message: "无数据无需同步"});
                } else {
                    syncIndex = 0;
                    saveExecutableProgramData(executablePrograms);
                }
            }
            //替换分类数据
            db.remove({type: 'classifyList'}, {multi: true}, function (err, numRemoved) {
                db.insert({type: 'classifyList', classifyList: classifyList}, function (err, doc) {
                });
            })
        }
    )

}

function deleteRepeatPrograms(originalPrograms) {
    if (!originalPrograms || originalPrograms.length == 0) {
        originalPrograms = [];
    }
    db.find({
        type: 'program'
    }, function (err, programList) {
        if (programList && programList.length > 0) {
            for (let program of programList) {
                let flag = 1;
                for (let originalProgram of originalPrograms) {
                    if (originalProgram.program.id == program.id) {
                        flag = 2;
                        break;
                    }
                }
                if (flag == 1 && !program.source) {
                    console.log(program.id);
                    db.remove({
                        type: 'program',
                        id: program.id
                    }, {}, function (err, doc) {

                    });
                }
            }
        }
    });
}

function saveOriginalProgramData(originalPrograms, callback) {

    eventWindow.sender.send('down-state', {
        size: originalPrograms.length,
        syncIndex: downIndex
    });

    if (originalPrograms.length == downIndex) {
        callback();
    } else {
        let originalProgram = originalPrograms[downIndex];
        //用于标记数据类型
        originalProgram.program.type = 'program';
        originalProgram.program.useType = aseEncode(originalProgram.useType + "", password);
        originalProgram.program.useCount = aseEncode(originalProgram.useCount + "", password);
        originalProgram.program.useTime = originalProgram.useTime;
        //先删后增
        db.findOne({
            type: 'program',
            id: originalProgram.program.id,
        }, function (err, doc) {
            if (!doc) {
                downloadProgramFile(originalProgram.program).then(function () {
                    db.insert(originalProgram.program, function (err, doc) {
                        downIndex++;
                        saveOriginalProgramData(originalPrograms, callback);
                    });
                });
            } else {
                downloadProgramFile(originalProgram.program).then(function () {
                    downIndex++;
                    saveOriginalProgramData(originalPrograms, callback);
                });
            }
        });

    }
}


function saveExecutableProgramData(executablePrograms) {
    eventWindow.sender.send('sync-state', {
        size: executablePrograms.length,
        syncIndex: syncIndex
    });

    if (executablePrograms.length == syncIndex) {
        return false;
    }
    let executableProgram = executablePrograms[syncIndex];

    if (executableProgram.type == 1) {
        //用于标记数据类型
        let ep = executableProgram.equipmentProgram;
        ep.program.type = 'program';
        ep.program.useCount = aseEncode(ep.useCount + "", password);
        ep.program.useType = aseEncode(ep.useType + "", password);
        ep.program.useTime = ep.useTime;
        if (ep.syncType == 1) {
            //先删后增
            downloadProgramFile(ep.program).then(function () {
                db.remove({
                    type: 'program',
                    id: ep.program.id
                }, {}, function (err, doc) {
                    db.insert(ep.program, function (err, doc) {
                        callbackServer(executableProgram.id, function () {
                            //回调服务器，保存结果
                            //然后开始下一条
                            syncIndex++;
                            saveExecutableProgramData(executablePrograms);
                        });
                    });
                });
            });

        } else if (ep.syncType == 2) {
            //更新数据
            downloadProgramFile(ep.program).then(function () {
                db.findOne({
                    type: 'program',
                    id: ep.program.id
                }, function (err, doc) {
                    if (doc) {
                        db.update({
                            type: 'program',
                            id: ep.program.id
                        }, {$set: ep.program}, function (err, doc) {
                            callbackServer(executableProgram.id, function () {
                                //回调服务器，保存结果
                                //然后开始下一条
                                syncIndex++;
                                saveExecutableProgramData(executablePrograms);
                            });
                        });
                    } else {
                        db.insert(ep.program, function (err, doc) {
                            callbackServer(executableProgram.id, function () {
                                //回调服务器，保存结果
                                //然后开始下一条
                                syncIndex++;
                                saveExecutableProgramData(executablePrograms);
                            });
                        });
                    }
                });
            });
        } else if (ep.syncType == 3) {
            //
            db.remove({
                type: 'program',
                id: ep.program.id
            }, {}, function (err, doc) {

                callbackServer(executableProgram.id, function () {
                    //回调服务器，保存结果
                    //然后开始下一条
                    syncIndex++;
                    saveExecutableProgramData(executablePrograms);
                });
            });
        } else {
            //更新数据
            downloadProgramFile(ep.program).then(function () {
                db.update({
                    type: 'program',
                    id: ep.program.id
                }, {$set: ep.program}, function (err, doc) {
                    callbackServer(executableProgram.id, function () {
                        //回调服务器，保存结果
                        //然后开始下一条
                        syncIndex++;
                        saveExecutableProgramData(executablePrograms);
                    });
                });
            });
        }
    } else {
        //todo 用于删除数据
        db.remove({
            type: 'program'
        }, {multi: true}, function (err, doc) {
            db.remove({
                type: 'classifyList'
            }, {multi: true}, function (err, doc) {
                deleteAll(globalCfg.lib_path);
                callbackServer(executableProgram.id, function () {
                    syncIndex = executablePrograms.length;
                    saveExecutableProgramData(executablePrograms);
                });
            });
        });

    }
}


async function downloadProgramFile(program) {
    let dp = downloadFile(program.resourcesPath,
        path.join(globalCfg.lib_path, globalCfg.gzip_path));
    let di = downloadFile(program.iconPath,
        path.join(globalCfg.lib_path, globalCfg.icons_path));
    let dv = downloadFile(program.videoPath,
        path.join(globalCfg.lib_path, globalCfg.videos_path));
    let dImg = downloadFile(program.imgPath,
        path.join(globalCfg.lib_path, globalCfg.images_path));
    return new Promise((resolve, reject) => {
        Promise.all([dp, di, dv, dImg]).then((result) => {
            program.iconLocalPath = result[1];
            program.videoLocalPath = result[2];
            program.imgLocalPath = result[3];
            if (result[0]) {
                let excutePath = path.join(globalCfg.lib_path, globalCfg.programs_path, program.onlyId + '');
                if (result[0] == 'exist') {
                    program.resourcesLocalPath = path.join(excutePath, globalCfg.exec_file_name);
                    resolve();
                } else {
                    zip(result[0], excutePath).then(function () {
                        program.resourcesLocalPath = path.join(excutePath, globalCfg.exec_file_name);
                        resolve();
                    });
                }
            } else {
                resolve();
            }
        }).catch((error) => {
            console.log(error)
        })
    })
}

async function downloadClassifyFile(classifyList) {

    let ps = [];
    for (let i = 0; i < classifyList.length; i++) {
        if (classifyList[i].parentId == 0) {
            let p = downloadFile(classifyList[i].backgroundImgUrl,
                path.join(globalCfg.lib_path, globalCfg.background_path));
            ps.push(p);
        }
    }
    return new Promise((resolve, reject) => {
        Promise.all(ps).then((result) => {
            let j = 0;
            for (let i = 0; i < classifyList.length; i++) {
                if (classifyList[i].parentId == 0) {
                    classifyList[i].backgroundLocalPath = result[j];
                    j++;
                }
            }
            resolve();
        }).catch((error) => {
            console.log(error)
        })

    })
}


async function downloadFile(url, dirPath) {
    if (url) {
        let fileName = url.substr(url.lastIndexOf('/') + 1, url.length);
        let filePath = path.join(dirPath, fileName);
        pathUtils.ensureDirSync(dirPath);
        if (fs.existsSync(filePath)) {
            //文件已存在直接返回
            return new Promise((resolve, reject) => {
                if (filePath.indexOf('gzip') > -1) {
                    resolve("exist");
                } else {
                    resolve(filePath);
                }
            })
        } else {
            let writer = fs.createWriteStream(filePath);
            let {data, headers} = await Axios({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            let totalLength = parseInt(headers['content-length'], 10);
            let receivedBytes = 0;
            let lastTime = new Date();
            let progress = 0;
            let speed = 0;
            data.pipe(writer);
            data.on('data', function (chunk) {
                receivedBytes += chunk.length;
                speed += chunk.length;
                let now = new Date();
                progress = receivedBytes / totalLength * 100;
                if ((now.getTime() - lastTime.getTime()) / 1000 >= 1) {
                    eventWindow.sender.send('speed-state', {
                        speed: speed,
                        progress: progress,
                        type: 1
                    });
                    speed = 0;
                    lastTime = now;
                }
                if (progress == 100) {
                    eventWindow.sender.send('speed-state', {
                        progress: 100,
                        type: 1
                    });
                }

            });
            return new Promise((resolve, reject) => {
                writer.on('finish', function () {
                    writer.close();
                    resolve(filePath);
                })
                writer.on('error', reject)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }

}


async function zip(filePath, zipPath) {
    eventWindow.sender.send('speed-state', {
        progress: 100,
        type: 2
    });
    return new Promise((resolve, reject) => {
        pathUtils.ensureDirSync(zipPath);
        yauzl.open(filePath, {lazyEntries: true}, function (err, zipfile) {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function (entry) {
                let filePath = pathUtils.resolveInside(zipPath, entry.fileName);
                if (/\/$/.test(entry.fileName)) {
                    pathUtils.ensureDirSync(filePath);
                    zipfile.readEntry();
                } else {
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function () {
                            zipfile.readEntry();
                        });
                        pathUtils.ensureDirSync(path.dirname(filePath));
                        readStream.pipe(fs.createWriteStream(filePath));
                    });
                }
            }).on("close", function () {
                resolve();
            });
        });
    });

    /*let zip = new StreamZip({
        file: filePath,
        storeEntries: true
    });

    return new Promise((resolve, reject) => {
        zip.on('ready', () => {
            pathUtils.ensureDirSync(zipPath);
            zip.extract(null, zipPath, err => {
                zip.close();
                resolve();
            });
        });
    });*/
}


function deleteAll(targetPath) {
    let files = [];
    if (fs.existsSync(targetPath)) {
        files = fs.readdirSync(targetPath);
        files.forEach(function (file, index) {
            let curPath = path.join(targetPath, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteAll(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(targetPath);
    }
}


ipcMain.on('new-tree-info', (e) => {
    let tree = [];

    db.findOne({type: 'classifyList'}, function (err, classifyList) {
        if (!classifyList) {
            e.sender.send('new-tree-info', tree);
        } else {
            db.find({type: 'program'}, function (err, programList) {
                let hasProgram = new Array(100, 100, 100, 100);
                tree = buildTree(classifyList.classifyList, programList, 0, 0, hasProgram);
                e.sender.send('new-tree-info', tree);
            });
        }

    })
});

ipcMain.on('new-text-tree-info', (e) => {
    let tree = [];

    db.findOne({type: 'classifyList'}, function (err, classifyList) {
        if (!classifyList) {
            e.sender.send('new-text-tree-info', tree);
        } else {
            db.find({type: 'program'}, function (err, programList) {
                let hasProgram = new Array(100, 100, 100, 100);
                tree = buildTextTree(classifyList.classifyList, programList, 0, 0, hasProgram);
                e.sender.send('new-text-tree-info', tree);
            });
        }

    })
});


function buildTree(classifyList, programList, id, flag, hasProgram) {
    let childList = [];
    for (let i = 0; i < classifyList.length; i++) {
        if (flag == 0) {
            hasProgram[0] = 100;
            hasProgram[1] = 100;
            hasProgram[2] = 100;
            hasProgram[3] = 100;
        } else {
            hasProgram[Number(flag)] = 100;
        }
        if (classifyList[i].parentId == id) {
            let childs = buildTree(classifyList, programList, classifyList[i].id, flag + 1, hasProgram);
            if (childs.length > 0) {
                if (flag = 1 && classifyList[i].parentId > 0) {
                    classifyList[i].childrenList = getPages(childs);
                } else {
                    classifyList[i].childrenList = childs;
                }

            } else {
                let programs = buildProgramTree(programList, classifyList[i].id);
                if (programs && programs.length > 0) {
                    hasProgram[0] = 101;
                    hasProgram[1] = 101;
                    hasProgram[2] = 101;
                    hasProgram[3] = 101;
                }
                classifyList[i].childrenList = programs;
            }
            if (hasProgram[Number(flag)] == 101) {
                childList.push(classifyList[i]);
            }
        }
    }
    return childList;
}


function buildTextTree(classifyList, programList, id, flag, hasProgram) {
    let childList = [];
    for (let i = 0; i < classifyList.length; i++) {
        if (flag == 0) {
            hasProgram[0] = 100;
            hasProgram[1] = 100;
            hasProgram[2] = 100;
            hasProgram[3] = 100;
        } else {
            hasProgram[Number(flag)] = 100;
        }
        if (classifyList[i].parentId == id) {
            let childs = buildTextTree(classifyList, programList, classifyList[i].id, flag + 1, hasProgram);
            if (childs.length > 0) {
                if (flag = 1 && classifyList[i].parentId > 0) {
                    classifyList[i].childrenList = getPages2(childs);
                } else {
                    classifyList[i].childrenList = childs;
                }

            } else {
                let programs = buildProgramTree(programList, classifyList[i].id);
                if (programs && programs.length > 0) {
                    hasProgram[0] = 101;
                    hasProgram[1] = 101;
                    hasProgram[2] = 101;
                    hasProgram[3] = 101;
                }
                classifyList[i].childrenList = programs;
            }
            if (hasProgram[Number(flag)] == 101) {
                childList.push(classifyList[i]);
            }
        }
    }
    return childList;
}

function buildProgramTree(programList, id) {
    let childList = [];
    for (let i = 0; i < programList.length; i++) {
        if (programList[i].classifyId == id) {
            childList.push(programList[i]);
        }
    }
    return childList;
}

/**
 * 分页处理
 * @param children
 * @returns {any[]}
 */
function getPages(children) {
    // 倒序排列
    // 1.创建pages数组
    let pages = new Array();
    let page = new Array();
    let size = 0;// 用于记录page长度
    while (children.length > 0) {
        // 2.获取第一个元素
        let child = children.pop();
        // 获取grandChildren
        let grandChildren = child.childrenList;
        // 3.将grandChildren 填入page
        let length = grandChildren.length;
        // 当前可用pageSize
        if (size == 10) {
            // 将page放入pages
            pages.push(page);
            // 重新开辟一页
            page = new Array();
            size = 0;
        }
        let useableSize = 10 - size;
        if (length > useableSize) {
            let newGrandChildren = new Array();
            while (useableSize > 0) {
                newGrandChildren.push(grandChildren.pop());
                useableSize--;
                size++;
            }
            if (size % 2 != 0) {
                size++;
            }
            // 克隆对象
            let newChild = {}
            for (let field in child) {
                newChild[field] = child[field];
            }
            newChild['childrenList'] = newGrandChildren;
            // 将能放的放入page
            page.push(newChild);
            children.push(child);
        } else {
            if (length % 2 == 0) {
                // 当前page数目
                size = size + length;
            } else {
                size = size + length + 1;
            }
            child.childrenList.reverse();
            //直接将child放入page
            page.push(child);
        }

    }
    // 最后一页
    if (page.length > 0) {
        pages.push(page);
    }
    return pages;

}

/**
 * 分页处理
 * @param children
 * @returns {any[]}
 */
function getPages2(children) {
    // 倒序排列
    // 1.创建pages数组
    let pages = new Array();
    let page = new Array();
    let size = 0;// 用于记录page长度
    while (children.length > 0) {
        // 2.获取第一个元素
        let child = children.pop();
        // 获取grandChildren
        let grandChildren = child.childrenList;
        // 3.将grandChildren 填入page
        let length = grandChildren.length;
        // 当前可用pageSize
        if (size == 60) {
            // 将page放入pages
            pages.push(page);
            // 重新开辟一页
            page = new Array();
            size = 0;
        }
        let useableSize = 60 - size;
        if (length > 10) {
            let newGrandChildren = new Array();
            let comlumSize = 10;
            while (comlumSize > 0) {
                newGrandChildren.push(grandChildren.pop());
                comlumSize--;
                size++;
                useableSize--;
            }
            // if(size%10 != 0){
            //     size= Math.ceil(size/10)*10;
            // }
            // 克隆对象
            let newChild = {}
            for (let field in child) {
                newChild[field] = child[field];
            }
            newChild['childrenList'] = newGrandChildren;
            // 将能放的放入page
            page.push(newChild);
            children.push(child);
        } else {
            // 当前page数目
            size = size + 10;
            child.childrenList.reverse();
            //直接将child放入page
            page.push(child);
        }

    }
    // 最后一页
    if (page.length > 0) {
        pages.push(page);
    }
    return pages;

}

function checkCanUse(programId, credential, callback) {
    db.findOne({
        type: 'program',
        onlyId: programId,
    }, function (err, doc) {
        // 获取点击次数
        let result = {code: 0, message: '校验成功'};
        if (!doc) {
            result = {code: 500, message: '软件不存在！'};
            callback(result);
        } else {
            if (doc.source && doc.source == 'local') {
                //此判断为软件是本地添加 跳过所有验证
                result.useCount = 1000;
                callback(result);
            } else {
                let useCount = 0;
                let useType = 1;
                let useTime;
                let hits = doc.hits;
                try {
                    useCount = Number(aseDecode(doc.useCount, password));
                    useTime = doc.useTime;
                    useType = Number(aseDecode(doc.useType, password));
                } catch (e) {
                    result = {code: 500, message: '软件授权异常！'};
                    callback(result);
                }
                if (doc.credential && doc.credential != credential) {
                    result = {code: 500, message: '软件凭据不一致！'};
                    callback(result);
                } else {

                    if (useType == 2) {
                        useCount = 1001;
                        recordProgram(programId, hits, useCount, credential);
                        result.useCount = useCount;
                        callback(result);
                    } else {
                        //useCount为-1说明为空，只需判断到期时间

                        if (useCount < 0 && useTime) {
                            request(globalCfg.server_url + '/api/equipment/checkProgramUseTime?credential=' + global.credential + '&programId=' + programId, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    let res = JSON.parse(body);
                                    if (res.code == 500) {
                                        result = {code: 500, message: '软件使用已到期！'};
                                    } else {
                                        recordProgram(programId, hits, useCount, credential);
                                        result.useCount = 1000;
                                    }
                                } else {
                                    result = {code: 500, message: '软件使用必须联网！'};
                                }
                                callback(result);
                            });
                        } else if (useCount >= 0 && useTime) {
                            console.log(globalCfg.server_url + '/api/equipment/checkProgramUseTime?credential=' + global.credential + '&programId=' + programId)
                            request(globalCfg.server_url + '/api/equipment/checkProgramUseTime?credential=' + global.credential + '&programId=' + programId, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    let res = JSON.parse(body);
                                    if (res.code == 500) {
                                        if (useCount <= 0) {
                                            result = {code: 500, message: '软件使用次数已用尽且使用已到期！'};
                                        } else {
                                            recordProgram(programId, hits, useCount, credential);
                                            result.useCount = useCount;
                                        }
                                    } else {
                                        recordProgram(programId, hits, useCount, credential);
                                        result.useCount = 1001;
                                    }
                                } else {
                                    result = {code: 500, message: '软件使用必须联网！'};
                                }
                                console.log(result);
                                callback(result);
                            });
                        } else if (useCount >= 0 && !useTime) {
                            if (useCount <= 0) {
                                result = {code: 500, message: '软件使用次数已用尽！'};
                            } else {
                                recordProgram(programId, hits, useCount, credential);
                                result.useCount = useCount;
                            }
                            callback(result);
                        } else {
                            result = {code: 500, message: '软件验证异常！'};
                            callback(result);
                        }

                    }

                }

            }
        }
    });
}

function recordProgram(programId, hits, useCount, credential) {
    if (!hits) {
        hits = 1;
    } else {
        hits = hits + 1;
    }
    useCount = useCount - 1;
    db.update({
        type: 'program', onlyId: programId,
    }, {$set: {useCount: aseEncode(useCount + "", password), hits: hits}}, {});
    db.update({
        type: 'program', onlyId: programId, credential: {
            $exists: false
        }
    }, {$set: {credential: credential}}, {});
    db.insert({
        type: 'programClick',
        programId: programId,
        clickTime: SDTime.format(new Date(), 'YYYY-MM-DD HH:mm')
    });
}

async function getEquipmentOperation() {
    return new Promise((resolve, reject) => {
        db.find({
            type: 'equipmentOperation',
            loginTime: {
                $ne: global.loginTime
            }
        }, function (err, docs) {
            resolve(docs);
        });
    });

}

async function getProgramClick() {
    return new Promise((resolve, reject) => {
        db.find({
            type: 'programClick'
        }, function (err, docs) {
            resolve(docs);
        });
    });
}

function saveLoginTime() {
    db.insert({
        type: 'equipmentOperation',
        loginTime: global.loginTime
    });
}


function saveQuitTime() {
    db.update({
        type: 'equipmentOperation',
        loginTime: global.loginTime
    }, {$set: {quitTime: SDTime.format(new Date(), 'YYYY-MM-DD HH:mm')}});
}

function checkEquipment(event, callback) {
    getLocalData(function (data) {
        callback(data);
    });
}



export default {
    syncServerData: syncServerData,
    checkUpdate: checkUpdate,
    checkCanUse: checkCanUse,
    saveQuitTime: saveQuitTime,
    checkEquipment: checkEquipment
}


