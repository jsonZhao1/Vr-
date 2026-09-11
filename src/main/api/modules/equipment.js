const { ipcMain } = require('electron')
const { default: { EQUIPMENT }} = require('../../constant/channelConstants')
const { default: { EQUIPMENT_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')

/**
 * 新增设备信息
**/
ipcMain.on(EQUIPMENT.ADD_EQUIPMENT,(event, status = {})=>{
  dbUtils.insertOne(EQUIPMENT_DB,status).then(res=>{
    event.sender.send(EQUIPMENT.ADD_EQUIPMENT, res)
  })
})

/**
 * 删除设备信息
 **/
ipcMain.on(EQUIPMENT.DEL_EQUIPMENT,(event, status = {})=>{
  dbUtils.deleteByID(EQUIPMENT_DB,status).then(res=>{
    event.sender.send(EQUIPMENT.DEL_EQUIPMENT, res)
  })
})

/**
 * 修改设备信息
 */
ipcMain.on(EQUIPMENT.UPDATE_EQUIPMENT,(event, status = {})=>{
  dbUtils.updateByID(EQUIPMENT_DB,status).then(res=>{
    event.sender.send(EQUIPMENT.UPDATE_EQUIPMENT, res)
  })
})


/**
 * 查询设备信息
 */
ipcMain.on(EQUIPMENT.GET_EQUIPMENT,(event, status = {})=>{
  dbUtils.getByID(EQUIPMENT_DB,status).then(res=>{
    event.sender.send(EQUIPMENT.GET_EQUIPMENT, res)
  })
})

/**
 * 查询设备信息列表(不分页)
 **/
ipcMain.on(EQUIPMENT.LIST_EQUIPMENT,(event, status = {})=>{
  dbUtils.getList(EQUIPMENT_DB,status).then(res=>{
    event.sender.send(EQUIPMENT.LIST_EQUIPMENT, res)
  })
})

/**
 * 查询设备信息列表(分页)
 **/
ipcMain.on(EQUIPMENT.LIST_PAGE_EQUIPMENT,(event, status = {})=>{
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(EQUIPMENT_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[EQUIPMENT_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(EQUIPMENT.LIST_PAGE_EQUIPMENT, { total: count, data: res })
    })
  })
})




