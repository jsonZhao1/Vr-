const {ipcMain} = require('electron')
const {default: {CLASSIFY}} = require('../../constant/channelConstants')
const {default: {CLASSIFY_DB}} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const dateUtils = require('../../utils/dateUtils')
const Dbs = require('../../db/init')

const {error, success} = require('../../common/result')


/**

 /**
 * 新增分类记录
 **/
ipcMain.on(CLASSIFY.ADD_CLASSIFY, (event, status = {}) => {
    //增加推送状态 默认为1
    status.createTime = dateUtils.formatNowDate();
    Dbs.default[CLASSIFY_DB].find({}).sort({sort: -1}).limit(1).exec(function (err, docs) {
        if (!docs || docs.length == 0) {
            status.sort = 1;
        } else {
            status.sort = docs[0].sort + 1;
        }
        dbUtils.insertOne(CLASSIFY_DB, status).then(res => {
            event.sender.send(CLASSIFY.ADD_CLASSIFY, res)
        })
    });

})

/**
 * 删除分类记录
 **/
ipcMain.on(CLASSIFY.DEL_CLASSIFY, (event, status = {}) => {
    dbUtils.deleteByID(CLASSIFY_DB, status).then(res => {
        event.sender.send(CLASSIFY.DEL_CLASSIFY, res)
    })
})

/**
 * 修改分类记录
 */
ipcMain.on(CLASSIFY.UPDATE_CLASSIFY, (event, status = {}) => {
    dbUtils.updateByID(CLASSIFY_DB, status).then(res => {
        event.sender.send(CLASSIFY.UPDATE_CLASSIFY, res)
    })
})


/**
 * 查询分类列表
 **/
ipcMain.on(CLASSIFY.LIST_CLASSIFY, (event, status = {}) => {
    dbUtils.count(CLASSIFY_DB, status).then(count => {
        // eslint-disable-next-line handle-callback-err
        Dbs.default[CLASSIFY_DB].find(status).sort({sort: 1}).exec((err, res) => {
            event.sender.send(CLASSIFY.LIST_CLASSIFY, {total: count, data: res})
        })
    })
})
/**
 * 升降序软件
 */
ipcMain.on(CLASSIFY.UP_CLASSIFY, (event, status = {}) => {
    let classifySort = status.sort;
    //获取比自己排序小的软件
    Dbs.default[CLASSIFY_DB].find({
        "sort": {$lt: status.sort}
    }).sort({sort: -1}).limit(1).exec(function (err, docs) {
        if (!docs || docs.length == 0) {
            //已是最高排序，无法上升
            event.sender.send(CLASSIFY.UP_CLASSIFY, -1)
        } else {
            let classify = docs[0];
            status.sort = docs[0].sort;
            classify.sort = classifySort;
            dbUtils.updateByID(CLASSIFY_DB, classify).then(res => {
                dbUtils.updateByID(CLASSIFY_DB, status).then(res2 => {
                    event.sender.send(CLASSIFY.UP_CLASSIFY, res2)
                })
            })
        }
    });
})




