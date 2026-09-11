const {ipcMain} = require('electron');
const globalCfg = require('../config/globalCfg');
const excelService = require('../service/ExcelService');
const fs = require('fs');
const os = require('os');
const pathUtils = require('../utils/pathUtils');

const nedb = require('nedb');
// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: pathUtils.getDbPath('system.db'),
    autoload: false,
    inMemoryOnly: false,
    timestampData: false
});

/**
 * 计算点击次数
 */
ipcMain.on('click-count', function (event, id) {


})
