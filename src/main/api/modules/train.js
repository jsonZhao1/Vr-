const { ipcMain } = require('electron')
const { default: { TRAIN }} = require('../../constant/channelConstants')
const { default: { TRAIN_DB,RECORD_DB,USER_INFO_DB }} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const dateUtils = require('../../utils/dateUtils')
const Dbs = require('../../db/init')
const { error,success } = require('../../common/result')

/**
 * 开始培训
 * 查询培训表带培训的记录，将状态转成培训中
 */
ipcMain.on(TRAIN.START_TRAIN,(event, status = {})=>{
    console.log('开始培222训')

    // 1.查询培训表带培训的记录
    dbUtils.getByParam(TRAIN_DB,{state:1}).then(train=>{
        if(!train){
            event.sender.send(TRAIN.START_TRAIN, error('没有待培训的的数据'))
        }else {
          console.log('修改培训状态')
            // 修改状态为培训中
          train.state = 2
          train.startTime = dateUtils.formatNowDate()
          dbUtils.updateByID(TRAIN_DB,train).then(res=>{
              event.sender.send(TRAIN.START_TRAIN, success())
          })
        }
    })
})

/**
 * 结束培训
 * 查询培训表带培训的记录，将培训中转成培训完成
 */
ipcMain.on(TRAIN.END_TRAIN,(event, status = {})=>{
    // 1.查询培训表带培训的记录
    dbUtils.getByParam(TRAIN_DB,{state:2}).then(train=>{
        if(!train){
            event.sender.send(TRAIN.END_TRAIN, error('没有培训中的的数据'))
        }else {
            // 修改状态为培训结束
          train.state = 3
          train.endTime = dateUtils.formatNowDate()
          train.time = (new Date(train.endTime).getTime()-new Date(train.startTime).getTime())/1000
          dbUtils.updateByID(TRAIN_DB,train).then(res=>{
              // 更新记录表
              dbUtils.updateByParam(RECORD_DB,{trainId:train._id},{endTime:train.endTime,time:train.time,state:train.state}).then(()=>{
                  event.sender.send(TRAIN.END_TRAIN, success('请求成功',train))
              })
          })
        }
    })
})


/**
 * 进入培训信息
**/
ipcMain.on(TRAIN.ADD_TRAIN,(event, status = {})=>{
  let { idCardNo } = status
  console.log('进入培训',status)
  if(!idCardNo){
      event.sender.send(TRAIN.ADD_TRAIN, error('人员身份证不能为空'))
  }else {
      // 查询人员信息
      dbUtils.getByParam(USER_INFO_DB,{idCardNo}).then(u=>{
          if(!u){
              // 第一次录入
              event.sender.send(TRAIN.ADD_TRAIN, error('该人员不存在！'))
          }else {
              let uid = u._id
              // 经培训表中的数据更新为已结束
              console.log('将所有培训数据状态设置为培训结束')
              dbUtils.updateByParam(TRAIN_DB,{},{state:3}).then(res=>{
                  console.log(res)
                  // 插入一条带培训记录
                  status.state = 1
                  dbUtils.insertOne(TRAIN_DB,status).then(res=>{
                      dbUtils.getByID(USER_INFO_DB,{_id:uid}).then(user=>{
                          event.sender.send(TRAIN.ADD_TRAIN, success('请求成功',user))
                      })

                  })
              })
          }
      })

  }

})

/**
 * 删除培训信息
 **/
ipcMain.on(TRAIN.DEL_TRAIN,(event, status = {})=>{
  dbUtils.deleteByID(TRAIN_DB,status).then(res=>{
    event.sender.send(TRAIN.DEL_TRAIN, res)
  })
})

/**
 * 修改培训信息
 */
ipcMain.on(TRAIN.UPDATE_TRAIN,(event, status = {})=>{
  dbUtils.updateByID(TRAIN_DB,status).then(res=>{
    event.sender.send(TRAIN.UPDATE_TRAIN, res)
  })
})


/**
 * 查询培训信息
 */
ipcMain.on(TRAIN.GET_TRAIN,(event, status = {})=>{
  dbUtils.getByID(TRAIN_DB,status).then(res=>{
    event.sender.send(TRAIN.GET_TRAIN, res)
  })
})

/**
 * 查询培训信息列表(不分页)
 **/
ipcMain.on(TRAIN.LIST_TRAIN,(event, status = {})=>{
  console.log(1111111111111111)
  dbUtils.getList(TRAIN_DB,status).then(res=>{
    event.sender.send(TRAIN.LIST_TRAIN, res)
  })
})

/**
 * 查询培训信息列表(分页)
 **/
ipcMain.on(TRAIN.LIST_PAGE_TRAIN,(event, status = {})=>{
  const { param, pageNum, pageSize } = status
  const skip = pageSize * (pageNum - 1)
  dbUtils.dealParam(param)
  dbUtils.count(TRAIN_DB, param).then(count => {
    // eslint-disable-next-line handle-callback-err
    Dbs.default[TRAIN_DB].find(param).sort({ createTime: 1 }).skip(skip).limit(pageSize).exec((err, res) => {
      event.sender.send(TRAIN.LIST_PAGE_TRAIN, { total: count, data: res })
    })
  })
})



