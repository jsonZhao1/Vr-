const {ipcMain} = require('electron')
const {default: {TRAIN, EQUIPMENT, USER_INFO, TRAIN_PROJECT, PROJECT_TYPE, SUBJECT, RECORD}} = require('../../constant/channelConstants')
const {default: {TRAIN_DB, EQUIPMENT_DB, USER_INFO_DB, TRAIN_PROJECT_DB, PROJECT_TYPE_DB, SUBJECT_DB, RECORD_DB}} = require('../../constant/dbNameConstants')
const dbUtils = require('../../utils/dbUtils')
const Dbs = require('../../db/init')
const {error, success} = require('../../common/result')


/**
 *
 * 创建培训项目
 */
export function createTrainPro(requestBody, callback) {
    try {
        if (!requestBody) {
            callback(error('参数为空'))
        } else {
            let {trainpro} = requestBody
            if (!trainpro) {
                callback(error('培训结果为空'))
            } else {
                let {name: topTypeName, project, id: firstId} = trainpro
                console.log('获取到培训信息' + JSON.stringify(trainpro))
                // 查询正在培训中的数据
                console.log('查询正在培训中的数据')
                new Promise(resolve0 => {
                    dbUtils.getByParam(TRAIN_DB, {state: 2}).then(train => {
                        if (!train) {
                            callback(error('没有培训中的数据'))
                        } else {
                            console.log('查询到培训中数据', train)
                            resolve0(train)
                        }
                    })
                }).then((train) => {
                    new Promise((resolve1) => {
                        // 一级类型
                        dbUtils.getByParam(PROJECT_TYPE_DB, {name: topTypeName}).then(res1 => {
                            if (!res1) {// 不存在
                                dbUtils.insertOne(PROJECT_TYPE_DB, {name: topTypeName, parentId: '0'}).then(res2 => {
                                    resolve1(res2._id)
                                })
                            } else {
                                resolve1(res1._id)
                            }
                        })
                    }).then(firstTypeId => {
                        let {name: secondTypeName, score, failDetail, subjects} = project
                        new Promise((resolve2) => {
                            // 二级类型
                            dbUtils.getByParam(PROJECT_TYPE_DB, {name: secondTypeName}).then(res3 => {
                                if (!res3) {// 不存在
                                    dbUtils.insertOne(PROJECT_TYPE_DB, {
                                        name: secondTypeName,
                                        parentId: firstTypeId
                                    }).then(res4 => {
                                        resolve2(res4._id)
                                    })
                                } else {
                                    resolve2(res3._id)
                                }
                            })
                        }).then(secondTypeId => {
                            // 插入题目
                            new Promise(resolve3 => {
                                let failDetailIdMap = {}
                                let promises = []
                                let number = 0
                                for (let subject of subjects) {
                                    number++
                                    let {id, name} = subject
                                    subject.number = number
                                    // 插入题目
                                    promises.push(new Promise(resolve => {
                                        // 查询类别名称
                                        let findTypeNamePromises = []
                                        findTypeNamePromises.push(new Promise(rs1 => {
                                            dbUtils.getByID(PROJECT_TYPE_DB, {_id: firstTypeId}).then(type => {
                                                rs1(type.name)
                                            })
                                        }))
                                        findTypeNamePromises.push(new Promise(rs2 => {
                                            dbUtils.getByID(PROJECT_TYPE_DB, {_id: secondTypeId}).then(project => {
                                                rs2(project.name)
                                            })
                                        }))

                                        Promise.all(findTypeNamePromises).then(arg => {
                                            let [typeName, projectName] = arg
                                            dbUtils.getByParam(SUBJECT_DB, {name}).then(res5 => {
                                                if (!res5) {// 不存在
                                                    dbUtils.insertOne(SUBJECT_DB, {
                                                        name,
                                                        projectId: secondTypeId,
                                                        typeId: firstTypeId,
                                                        typeName,
                                                        projectName,
                                                        number: subject.number
                                                    }).then(res6 => {
                                                        failDetailIdMap[id] = res6._id
                                                        resolve(arg)
                                                    })
                                                } else {
                                                    failDetailIdMap[id] = res5._id
                                                    resolve(arg)
                                                }
                                            })
                                        })
                                    }))
                                }
                                Promise.all(promises).then(arg => {
                                    console.log(failDetailIdMap, arg, 222222222222222)
                                    resolve3({failDetailIdMap, typeName: arg[0][0], projectName: arg[0][1]})
                                })
                                // resolve3(failDetailIdMap,secondTypeId)
                            }).then((arg) => {
                                let {failDetailIdMap, typeName, projectName} = arg
                                console.log('failDetailIdMap', failDetailIdMap, arg)
                                // 修改错误题号
                                if (firstId == -1) {
                                    score = -1
                                } else {
                                    let failArr = []
                                    let oldFailArr = failDetail.split(',')
                                    for (let field of oldFailArr) {
                                        failArr.push(failDetailIdMap[field])
                                    }
                                    project.failDetail = failArr.join(',')
                                }
                                //|_id|trainId|projectId|score|failedSubjectIds|
                                let failedSubjectIds = project.failDetail

                                // 插入成绩
                                const {_id: trainId, uid} = train

                                // 插入trainProject
                                new Promise(resolve4 => {
                                    dbUtils.insertOne(TRAIN_PROJECT_DB, {
                                        trainId,
                                        typeId: firstTypeId,
                                        projectId: secondTypeId,
                                        score,
                                        failedSubjectIds,
                                        typeName,
                                        projectName
                                    }).then(res7 => {
                                        resolve4(res7._id)
                                    })
                                }).then((trainProjectId) => {
                                    // 保存结果信息
                                    dbUtils.getByParam(RECORD_DB, {trainId}).then(record => {

                                        // 查询用户信息
                                        let findUserPromise = new Promise(resolve5 => {
                                            dbUtils.getByParam(USER_INFO_DB, {_id: uid}).then(user => {
                                                resolve5(user)
                                            })
                                        })
                                        // 查询trainProject
                                        let findTrainProjects = new Promise(resolve6 => {
                                            dbUtils.getListByParam(TRAIN_PROJECT_DB, {trainId}).then(trainProjects => {
                                                // 查看错题信息
                                                let errorPromises = []
                                                for (let trainProject of trainProjects) {
                                                    let errorArr = trainProject.failedSubjectIds.split(',')
                                                    errorPromises.push(new Promise(resolve7 => {
                                                        dbUtils.getListByParam(SUBJECT_DB, {_id: {$in: errorArr}}).then(errorList => {
                                                            trainProject.errorList = errorList
                                                            trainProject.errorNumbers = errorList.map(item => {
                                                                return item.number
                                                            }).join(',')
                                                            console.log(trainProject.errorNumbers, 3333333333333333333333333333333333333333333333333333333333)
                                                            resolve7()
                                                        })
                                                    }))
                                                }
                                                Promise.all(errorPromises).then(() => {
                                                    console.log('返回trainProjects')
                                                    // 插入信息
                                                    resolve6(trainProjects)
                                                })
                                            })
                                        })
                                        Promise.all([findUserPromise, findTrainProjects]).then((ff) => {
                                            // 拼装结果信息
                                            let [user, trainProjects] = ff
                                            //|_id|uid|userName|birthday|idCardNo|averageScore|result|startTime|typeId|typeName|projectId|projectName|projectList
                                            let newRecord = {
                                                trainId: trainId,
                                                state: train.state,
                                                uid: user._id,
                                                workType: user.workType,
                                                sex: user.sex,
                                                birthday: user.birthday,
                                                idCardNo: user.idCardNo,
                                                userName: user.name,
                                                validate: user.validate,
                                                startTime: train.startTime,
                                                typeId: firstTypeId,
                                                projectList: trainProjects
                                            }
                                            // 计算平均分
                                            let count = 0
                                            let sum = 0
                                            for (let trainProject of trainProjects) {
                                                let score = trainProject.score
                                                if (score == -1) {
                                                    continue
                                                }
                                                sum += score
                                                count++
                                            }
                                            if (count == 0) {
                                                newRecord.averageScore = -1
                                            } else {
                                                newRecord.averageScore = Math.floor(sum / count)
                                            }
                                            // 保存成绩
                                            console.log('保存成绩')
                                            dbUtils.deleteByParam(RECORD_DB, {trainId}).then(() => {
                                                let {averageScore} = newRecord
                                                if (averageScore == -1) {
                                                    newRecord.result = '体验完成'
                                                } else {
                                                    if (averageScore >= 60) {
                                                        newRecord.result = '通过'
                                                    } else {
                                                        newRecord.result = '不通过'
                                                    }
                                                }
                                                newRecord.pushStatus = 1
                                                dbUtils.insertOne(RECORD_DB, newRecord).then((res) => {
                                                    callback(res)
                                                })
                                            })

                                        })

                                    })
                                })

                            })
                        })

                    })
                })
            }
        }
    } catch (err) {
        callback(error('出错'))
    }
    // 1.创建类型


}
