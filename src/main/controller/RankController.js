const {ipcMain} = require('electron');
const globalCfg = require('../config/globalCfg');
const excelService = require('../service/ExcelService');
const fs = require('fs');
const os = require('os');
const nedb = require('nedb');
const pathUtils = require('../utils/pathUtils');
// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: pathUtils.getDbPath('program.db'),
    autoload: false,
    inMemoryOnly: false,
    timestampData: false
});

/**
 * 查看排行榜
 */
ipcMain.on('click-rank', function (event, msg) {
    db.loadDatabase();
    db.find({
        click: {
            $exists: true
        }
    }).sort({click: -1}).exec(function (err, doc) { // 1 升序，2,降序
        if (err) {
            console.log(err);
        }
        event.sender.send('rank-info', doc);
    });

})
