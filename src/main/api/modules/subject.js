const { ipcMain } = require('electron')
const { default: { SUBJECT }} = require('../../constant/channelConstants')
const { default: { SUBJECT_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')
/**
 * 新增题目信息
**/
ipcMain.on(SUBJECT.ADD_SUBJECT,(event, status = {})=>{
  dbUtils.insertOne(SUBJECT_DB,status).then(res=>{
    event.sender.send(SUBJECT.ADD_SUBJECT, res)
  })
})

/**
 * 删除题目信息
 **/
ipcMain.on(SUBJECT.DEL_SUBJECT,(event, status = {})=>{
  dbUtils.deleteByID(SUBJECT_DB,status).then(res=>{
    event.sender.send(SUBJECT.DEL_SUBJECT, res)
  })
})

/**
 * 修改题目信息
 */
ipcMain.on(SUBJECT.UPDATE_SUBJECT,(event, status = {})=>{
  dbUtils.updateByID(SUBJECT_DB,status).then(res=>{
    event.sender.send(SUBJECT.UPDATE_SUBJECT, res)
  })
})


/**
 * 查询题目信息
 */
ipcMain.on(SUBJECT.GET_SUBJECT,(event, status = {})=>{
  dbUtils.getByID(SUBJECT_DB,status).then(res=>{
    event.sender.send(SUBJECT.GET_SUBJECT, res)
  })
})

/**
 * 查询题目信息列表(不分页)
 **/
ipcMain.on(SUBJECT.LIST_SUBJECT,(event, status = {})=>{
  dbUtils.getList(SUBJECT_DB,status).then(res=>{
    event.sender.send(SUBJECT.LIST_SUBJECT, res)
  })
})

/**
 * 查询题目信息列表(分页)
 **/
ipcMain.on(SUBJECT.LIST_PAGE_SUBJECT,(event, status = {})=>{
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(SUBJECT_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[SUBJECT_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(SUBJECT.LIST_PAGE_SUBJECT, { total: count, data: res })
    })
  })
})



