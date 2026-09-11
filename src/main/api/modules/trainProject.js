const { ipcMain } = require('electron')
const { default: { TRAIN_PROJECT }} = require('../../constant/channelConstants')
const { default: { TRAIN_PROJECT_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')
/**
 * 新增培训结果信息
**/
ipcMain.on(TRAIN_PROJECT.ADD_TRAIN_PROJECT,(event, status = {})=>{
  dbUtils.insertOne(TRAIN_PROJECT_DB,status).then(res=>{
    event.sender.send(TRAIN_PROJECT.ADD_TRAIN_PROJECT, res)
  })
})

/**
 * 删除培训结果信息
 **/
ipcMain.on(TRAIN_PROJECT.DEL_TRAIN_PROJECT,(event, status = {})=>{
  dbUtils.deleteByID(TRAIN_PROJECT_DB,status).then(res=>{
    event.sender.send(TRAIN_PROJECT.DEL_TRAIN_PROJECT, res)
  })
})

/**
 * 修改培训结果信息
 */
ipcMain.on(TRAIN_PROJECT.UPDATE_TRAIN_PROJECT,(event, status = {})=>{
  dbUtils.updateByID(TRAIN_PROJECT_DB,status).then(res=>{
    event.sender.send(TRAIN_PROJECT.UPDATE_TRAIN_PROJECT, res)
  })
})


/**
 * 查询培训结果信息
 */
ipcMain.on(TRAIN_PROJECT.GET_TRAIN_PROJECT,(event, status = {})=>{
  dbUtils.getByID(TRAIN_PROJECT_DB,status).then(res=>{
    event.sender.send(TRAIN_PROJECT.GET_TRAIN_PROJECT, res)
  })
})

/**
 * 查询培训结果信息列表(不分页)
 **/
ipcMain.on(TRAIN_PROJECT.LIST_TRAIN_PROJECT,(event, status = {})=>{
  dbUtils.getList(TRAIN_PROJECT_DB,status).then(res=>{
    event.sender.send(TRAIN_PROJECT.LIST_TRAIN_PROJECT, res)
  })
})

/**
 * 查询培训结果信息列表(分页)
 **/
ipcMain.on(TRAIN_PROJECT.LIST_PAGE_TRAIN_PROJECT,(event, status = {})=>{
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(TRAIN_PROJECT_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[TRAIN_PROJECT_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(TRAIN_PROJECT.LIST_PAGE_TRAIN_PROJECT, { total: count, data: res })
    })
  })
})



