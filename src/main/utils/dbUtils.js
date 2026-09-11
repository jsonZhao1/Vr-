const Dbs = require('../db/init')
const { formatDate,formatDateStr,formatNowDate} = require('./dateUtils')
/**
 * 查询列表
 * @param dbName
 * @param param
 */
export function getList(dbName, param = {}) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].find(param, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 根据ID查询
 * @param dbName
 * @param param
 */
export function getByID(dbName, param = {}) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].findOne({
      _id: param._id
    }, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 根据条件查询
 * @param dbName
 * @param param
 */
export function getByParam(dbName, param = {}) {
    console.log('正在查询',dbName,param)
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].findOne(param, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      console.log('查询到结果',res)
      resolve(res)
    })
  })
}
/**
 * 根据条件查询
 * @param dbName
 * @param param
 */
export function getListByParam(dbName, param = {}) {
    console.log('正在查询',dbName,param)
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].find(param, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      console.log('查询到结果',res)
      resolve(res)
    })
  })
}

/**
 * 插入单条
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function insertOne(dbName, param) {
  param.createTime = formatNowDate()
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].insert(param, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 插入多条
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function insertList(dbName, param) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].insert(param, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 根据ID更新
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function updateByID(dbName, param) {
  param.updateTime = formatNowDate()
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].update({
      _id: param._id
    }, {
      $set: param
    }, {
      multi: false
    }, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 根据条件更新
 * @param dbName
 * @param param 查询条件
 * @param status 更新内容
 * @returns {Promise<unknown>}
 */
export function updateByParam(dbName, param,status) {
  console.log('根据条件更新',arguments)
  status.updateTime = formatNowDate()
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].update(param, {
      $set: status
    }, {
      multi: true
    }, (err, res) => {
      if (err) {
        console.log('根据条件更新出错')
        reject(err)
      }
      console.log('更新成功',res)
      resolve(res)
    })
  })
}

/**
 * 根据ID删除
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function deleteByID(dbName, param) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].remove({
      _id: param._id
    }, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 根据条件删除
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function deleteByParam(dbName, param) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].remove(param, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 计数
 * @param dbName
 * @param param
 * @returns {Promise<unknown>}
 */
export function count(dbName, param) {
  return new Promise((resolve, reject) => {
    Dbs.default[dbName].count(param, (err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}

/**
 * 处理查询参数
 * @param param
 */
export function dealParam(param){
  if(!param){
    param = {}
  }else {
    for(let fileName in param){
      if(!param[fileName]){
        delete param[fileName]
      }
    }
  }
}
