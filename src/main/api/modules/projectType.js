const { ipcMain } = require('electron')
const { default: { PROJECT_TYPE }} = require('../../constant/channelConstants')
const { default: { PROJECT_TYPE_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')
const { error,success } = require('../../common/result')
/*
 * 新增培训信息
**/
ipcMain.on(PROJECT_TYPE.ADD_PROJECT_TYPE,(event, status = {})=>{
  dbUtils.insertOne(PROJECT_TYPE_DB,status).then(res=>{
    event.sender.send(PROJECT_TYPE.ADD_PROJECT_TYPE, res)
  })
})

/**
 * 删除培训信息
 **/
ipcMain.on(PROJECT_TYPE.DEL_PROJECT_TYPE,(event, status = {})=>{
  dbUtils.deleteByID(PROJECT_TYPE_DB,status).then(res=>{
    event.sender.send(PROJECT_TYPE.DEL_PROJECT_TYPE, res)
  })
})

/**
 * 修改培训信息
 */
ipcMain.on(PROJECT_TYPE.UPDATE_PROJECT_TYPE,(event, status = {})=>{
  dbUtils.updateByID(PROJECT_TYPE_DB,status).then(res=>{
    event.sender.send(PROJECT_TYPE.UPDATE_PROJECT_TYPE, res)
  })
})


/**
 * 查询培训信息
 */
ipcMain.on(PROJECT_TYPE.GET_PROJECT_TYPE,(event, status = {})=>{
  dbUtils.getByID(PROJECT_TYPE_DB,status).then(res=>{
    event.sender.send(PROJECT_TYPE.GET_PROJECT_TYPE, res)
  })
})

/**
 * 查询培训信息列表(不分页)
 **/
ipcMain.on(PROJECT_TYPE.LIST_PROJECT_TYPE,(event, status = {})=>{
  dbUtils.getList(PROJECT_TYPE_DB,status).then(res=>{
    event.sender.send(PROJECT_TYPE.LIST_PROJECT_TYPE, res)
  })
})

/**
 * VR类别VR项目下拉框
 **/
ipcMain.on(PROJECT_TYPE.LIST_TYPE_OPTIONS,(event, status = {})=>{
   let param = {
       parentId:'0'
   }
  dbUtils.getList(PROJECT_TYPE_DB,param).then(res=>{
    event.sender.send(PROJECT_TYPE.LIST_TYPE_OPTIONS, res)
  })
})

/**
 * VVR项下拉框
 **/
ipcMain.on(PROJECT_TYPE.LIST_PROJECT_OPTIONS,(event, status = {})=>{
   let param = {
       parentId: {
           $ne:'0'
       }
   }
  dbUtils.getList(PROJECT_TYPE_DB,param).then(res=>{
    event.sender.send(PROJECT_TYPE.LIST_PROJECT_OPTIONS, res)
  })
})

/**
 * 查询培训信息列表(分页)
 **/
ipcMain.on(PROJECT_TYPE.LIST_PAGE_PROJECT_TYPE,(event, status = {})=>{
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(PROJECT_TYPE_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[PROJECT_TYPE_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(PROJECT_TYPE.LIST_PAGE_PROJECT_TYPE, { total: count, data: res })
    })
  })
})





