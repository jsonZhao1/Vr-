const {ipcMain} = require('electron')
const {default: {RECORD}} = require('../../constant/channelConstants')
const {default: {RECORD_DB, TRAIN_DB}} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const dateUtils = require('../../utils/dateUtils')
const {formatSecond} = require('../../utils/dateUtils')
const {exportWord} = require('../../utils/wordUtils')
const Dbs = require('../../db/init')
import {app} from 'electron'
import path from 'path'
const pathUtils = require('../../utils/pathUtils')

const {error, success} = require('../../common/result')


/**

 /**
 * 新增考核记录
 **/
ipcMain.on(RECORD.ADD_RECORD, (event, status = {}) => {
    //增加推送状态 默认为1
    status.pushStatus = 1
    dbUtils.insertOne(RECORD_DB, status).then(res => {
        event.sender.send(RECORD.ADD_RECORD, res)
    })
})

/**
 * 删除考核记录
 **/
ipcMain.on(RECORD.DEL_RECORD, (event, status = {}) => {
    dbUtils.deleteByID(RECORD_DB, status).then(res => {
        event.sender.send(RECORD.DEL_RECORD, res)
    })
})

/**
 * 修改考核记录
 */
ipcMain.on(RECORD.UPDATE_RECORD, (event, status = {}) => {
    dbUtils.updateByID(RECORD_DB, status).then(res => {
        event.sender.send(RECORD.UPDATE_RECORD, res)
    })
})

/**
 * 查询考核记录
 */
ipcMain.on(RECORD.GET_RECORD, (event, status = {}) => {
    console.log('根据trainId获取结果', status)
    dbUtils.getByParam(RECORD_DB, status).then(res => {
        if (res) {
            res.time = dateUtils.formatSecond(res.time)
        }
        console.log('查询到培训结果')
        event.sender.send(RECORD.GET_RECORD, res)
    })
})


/**
 * 查询当前考核信息
 */
ipcMain.on(RECORD.GET_CURRENT_RECORD, (event, status = {}) => {
    dbUtils.getByParam(TRAIN_DB, {state: 2}).then(train => {
        if (!train) {
            event.sender.send(RECORD.GET_CURRENT_RECORD, error('没有培训中数据'))
        } else {
            dbUtils.getByParam(RECORD_DB, {trainId: train._id}).then(record => {
                let count = 0
                let seconds = (new Date().getTime() - new Date(train.startTime)) / 1000
                let time = formatSecond(seconds)
                if (record) {
                    count = record.projectList.length
                }
                let result = {count, time}
                event.sender.send(RECORD.GET_CURRENT_RECORD, success('请求成功', result))
            })
        }

    })
})

/**
 * 查询考核记录列表(不分页)
 **/
ipcMain.on(RECORD.LIST_RECORD, (event, status = {}) => {
    dbUtils.getList(RECORD_DB, status).then(res => {
        event.sender.send(RECORD.LIST_RECORD, res)
    })
})

/**
 * 查询考核记录列表(分页)
 **/
ipcMain.on(RECORD.LIST_PAGE_RECORD, (event, status = {}) => {
    console.log('考核信息查询', status)
    const {param, pageNum, pageSize} = status
    const skip = pageSize * (pageNum - 1)
    dbUtils.dealParam(param)
    console.log('查询条件', param)
    //|_id|uid|userName|birthday|idCardNo|averageScore|result|startTime|typeId|typeName|projectId|projectName|projectList
    const {startTime, endTime, typeId, projectId} = param
    // 培训结束
    param.state = 3
    if (startTime) {
        param.startTime = {
            $gte: startTime + ' 00:00:00'
        }
    }
    if (endTime) {
        param.endTime = {
            $lte: endTime + ' 23:59:59'
        }
    }
    if (typeId) {
        param['projectList.typeId'] = typeId
        delete param.typeId
    }
    if (projectId) {
        param['projectList.projectId'] = projectId
        delete param.projectId
    }
    console.log('查询条件', param)
    dbUtils.count(RECORD_DB, param).then(count => {
        // eslint-disable-next-line handle-callback-err
        Dbs.default[RECORD_DB].find(param).sort({createTime: -1}).skip(skip).limit(pageSize).exec((err, res) => {
            event.sender.send(RECORD.LIST_PAGE_RECORD, {total: count, data: res})
        })
    })
})

/**
 * 查询培训信息列表导出
 **/
ipcMain.on(RECORD.EXPORT_RECORD, (event, status = {}) => {
    let {param} = status
    dbUtils.dealParam(param)
    const {startTime, endTime, typeId, projectId} = param
    // 培训结束
    param.state = 3
    if (startTime) {
        param.startTime = {
            $gte: startTime + ' 00:00:00'
        }
    }
    if (endTime) {
        param.endTime = {
            $lte: endTime + ' 23:59:59'
        }
    }
    if (typeId) {
        param['projectList.typeId'] = typeId
        delete param.typeId
    }
    if (projectId) {
        param['projectList.projectId'] = projectId
        delete param.projectId
    }
    console.log('查询条件', param)
    dbUtils.count(RECORD_DB, param).then(count => {
        // eslint-disable-next-line handle-callback-err
        Dbs.default[RECORD_DB].find(param).sort({createTime: 1}).exec((err, res) => {
            const outputDir = path.join(pathUtils.getStorageRoot(), 'file')
            pathUtils.ensureDirSync(outputDir)
            const filename = path.resolve(outputDir, 'trainResult.docx')
            console.log(filename, 33333333333333333333)
            if (!res) {
                event.sender.send(RECORD.EXPORT_RECORD, error('导出成绩为空'))
            } else {
                console.log(res, 444444)
                exportWord(res, filename, err => {
                    if (err) {
                        console.log(err)
                        event.sender.send(RECORD.EXPORT_RECORD, error('导出失败'))
                    } else {
                        event.sender.send(RECORD.EXPORT_RECORD, success('导出成功', filename))
                    }
                })
            }
        })
    })
})


