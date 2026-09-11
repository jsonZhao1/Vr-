import {success} from "../../common/result";

const {ipcMain} = require('electron')
const {default: {PROGRAM}} = require('../../constant/channelConstants')
const {default: {PROGRAM_DB}} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const dateUtils = require('../../utils/dateUtils')
const Dbs = require('../../db/init')


/**

 /**
 * 新增软件记录
 **/
ipcMain.on(PROGRAM.ADD_PROGRAM, (event, status = {}) => {
    status.createTime = dateUtils.formatNowDate();
    status.isHidden = 1;
    Dbs.default[PROGRAM_DB].find({classifyId: status.classifyId}).sort({sort: -1}).limit(1).exec(function (err, docs) {
        console.log(docs);
        if (!docs || docs.length == 0) {
            status.sort = 1;
        } else {
            status.sort = docs[0].sort + 1;
        }
        dbUtils.insertOne(PROGRAM_DB, status).then(res => {
            event.sender.send(PROGRAM.ADD_PROGRAM, res)
        })
    });
})

/**
 * 删除软件记录
 **/
ipcMain.on(PROGRAM.DEL_PROGRAM, (event, status = {}) => {
    dbUtils.deleteByID(PROGRAM_DB, status).then(res => {
        event.sender.send(PROGRAM.DEL_PROGRAM, res)
    })
})

/**
 * 修改软件记录
 */
ipcMain.on(PROGRAM.UPDATE_PROGRAM, (event, status = {}) => {
    dbUtils.updateByID(PROGRAM_DB, status).then(res => {
        event.sender.send(PROGRAM.UPDATE_PROGRAM, res)
    })
})

/**
 * 升降序软件
 */
ipcMain.on(PROGRAM.UP_PROGRAM, (event, status = {}) => {
    let programSort = status.sort;
    //获取比自己排序小的软件
    Dbs.default[PROGRAM_DB].find({
        classifyId: status.classifyId,
        "sort": {$lt: status.sort}
    }).sort({sort: -1}).limit(1).exec(function (err, docs) {
        console.log(docs);
        if (!docs || docs.length == 0) {
            //已是最高排序，无法上升
            event.sender.send(PROGRAM.UP_PROGRAM, -1)
        } else {
            let program = docs[0];
            status.sort = docs[0].sort;
            program.sort = programSort;
            dbUtils.updateByID(PROGRAM_DB, program).then(res => {
                dbUtils.updateByID(PROGRAM_DB, status).then(res2 => {
                    event.sender.send(PROGRAM.UP_PROGRAM, res2)
                })
            })
        }
    });
})
/**
 * 升降序软件
 */
ipcMain.on(PROGRAM.DOWN_PROGRAM, (event, status = {}) => {
    let programSort = status.sort;
    //获取比自己排序小的软件
    Dbs.default[PROGRAM_DB].find({
        classifyId: status.classifyId,
        "sort": {$gt: status.sort}
    }).sort({sort: 1}).limit(1).exec(function (err, docs) {
        console.log(docs);
        if (!docs || docs.length == 0) {
            //已是最高排序，无法上升
            event.sender.send(PROGRAM.DOWN_PROGRAM, -1)
        } else {
            let program = docs[0];
            status.sort = docs[0].sort;
            program.sort = programSort;
            dbUtils.updateByID(PROGRAM_DB, program).then(res => {
                dbUtils.updateByID(PROGRAM_DB, status).then(res2 => {
                    event.sender.send(PROGRAM.DOWN_PROGRAM, res2)
                })
            })
        }
    });
})
/**
 * 置顶软件
 */
ipcMain.on(PROGRAM.TOP_PROGRAM, (event, status = {}) => {
    Dbs.default[PROGRAM_DB].find({
        classifyId: status.classifyId
    }, function (err, docs) {
        if (!docs || docs.length == 0) {
            //已是最高排序，无法上升
            event.sender.send(PROGRAM.DOWN_PROGRAM, -1)
        } else {

            for (let i = 0; i < docs.length; i++) {
                if (docs[i]['_id'] == status['_id']) {
                    docs[i]['sort'] = 1;
                } else {
                    docs[i]['sort'] = docs[i]['sort'] + 1;
                }
                dbUtils.updateByID(PROGRAM_DB, docs[i]).then(res => {

                })
            }
            event.sender.send(PROGRAM.TOP_PROGRAM, success())
        }
    });
})

/**
 * 查询软件列表(分页)
 **/
ipcMain.on(PROGRAM.LIST_PAGE_PROGRAM, (event, status = {}) => {
    const {param, pageNum, pageSize} = status
    const skip = pageSize * (pageNum - 1)
    dbUtils.dealParam(param)
    dbUtils.count(PROGRAM_DB, param).then(count => {
        // eslint-disable-next-line handle-callback-err
        console.log(count);
        Dbs.default[PROGRAM_DB].find(param).sort({ sort: 1}).skip(skip).limit(pageSize).exec((err, res) => {
            event.sender.send(PROGRAM.LIST_PAGE_PROGRAM, {total: count, data: res})
        })
    })
})



