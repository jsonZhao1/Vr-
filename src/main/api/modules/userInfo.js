const { ipcMain } = require('electron')
const { default: { USER_INFO }} = require('../../constant/channelConstants')
const { default: { USER_INFO_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')
const { error,success } = require('../../common/result')
/**
 * 新增人员信息
**/
ipcMain.on(USER_INFO.ADD_USER_INFO,(event, status = {})=>{
     // 根据身份证号查询
    dbUtils.getByParam(USER_INFO_DB,{idCardNo:status.idCardNo}).then(user=>{
        if(user){
            if(status.update){
                status._id = user._id
                delete status.update
                dbUtils.updateByID(USER_INFO_DB,status).then(res=>{
                    dbUtils.getByID(USER_INFO_DB,status).then(user=>{
                         event.sender.send(USER_INFO.ADD_USER_INFO, success('人员信息更新成功',user))
                    })
                })
            }else {
                 event.sender.send(USER_INFO.ADD_USER_INFO, error('该人员已存在'))
            }
        }else {
            dbUtils.insertOne(USER_INFO_DB,status).then(res=>{
              event.sender.send(USER_INFO.ADD_USER_INFO, success('请求成功',res))
            })
        }
        
    })
  
})

/**
 * 删除人员信息
 **/
ipcMain.on(USER_INFO.DEL_USER_INFO,(event, status = {})=>{
  dbUtils.deleteByID(USER_INFO_DB,status).then(res=>{
    event.sender.send(USER_INFO.DEL_USER_INFO, res)
  })
})

/**
 * 修改人员信息
 */
ipcMain.on(USER_INFO.UPDATE_USER_INFO,(event, status = {})=>{
  dbUtils.updateByID(USER_INFO_DB,status).then(res=>{
    event.sender.send(USER_INFO.UPDATE_USER_INFO, res)
  })
})


/**
 * 查询人员信息
 */
ipcMain.on(USER_INFO.GET_USER_INFO,(event, status = {})=>{
  dbUtils.getByID(USER_INFO_DB,status).then(res=>{
    event.sender.send(USER_INFO.GET_USER_INFO, res)
  })
})

/**
 * 查询人员信息列表(不分页)
 **/
ipcMain.on(USER_INFO.LIST_USER_INFO,(event, status = {})=>{
  dbUtils.getList(USER_INFO_DB,status).then(res=>{
    event.sender.send(USER_INFO.LIST_USER_INFO, res)
  })
})

/**
 * 查询人员信息列表(分页)
 **/
ipcMain.on(USER_INFO.LIST_PAGE_USER_INFO,(event, status = {})=>{
  console.log(status, 44444444444444444)
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(USER_INFO_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[USER_INFO_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(USER_INFO.LIST_PAGE_USER_INFO, { total: count, data: res })
    })
  })
})



