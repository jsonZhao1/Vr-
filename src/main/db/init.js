// 数据库初始化
// 加载模块
const Nedb = require('nedb')
const os = require('os')
import {app} from 'electron'
import path from 'path'
const pathUtils = require('../utils/pathUtils')

const db_dir = path.join(pathUtils.getStorageRoot(), 'train')
pathUtils.ensureDirSync(db_dir)
pathUtils.ensureDirSync(pathUtils.getStorageRoot())
// 实例化连接对象（不带参数默认为内存数据库）
/**
 * 用户信息表
 * 字段信息:
 * |_id|name|nation|sex|birthday|address|idCardNo|issuingAuthority|termValidity|idCardHeadPath|phoneNumber|facePhotosPath|type|workType|state|
 * |主键|姓名|名族|性别|出生日期|地址|身份证号|签发机构|有效期|身份证头像路径|电话号码|面部头像地址|工种|用户状态：1-正常 2-禁用
 *
 * */
const UserInfoDB = new Nedb({
    filename: path.resolve(db_dir, 'userInfo.db'),
    autoload: true
})

/**
 * 设备信息表
 * |_id|name|credential|introduce|createTime|lastTime|type
 *|主键|名称|凭证|简介|创建时间|最后活动时间|类型: 1-行走平台 2-VR一体机|
 */
const EquipmentDB = new Nedb({
    filename: path.resolve(db_dir, 'equipmentDB.db'),
    autoload: true
})

/**
 * 培训信息表
 * 字段信息：
 * |_id|uid|equipmentId|startTime|endTime|remark|createTime|state|
 * |主键|培训人ID|设备ID|开始时间|结束时间|备注|创建时间|状态：1-未开始培训 2-培训中 3-培训结束|
 */

const TrainDB = new Nedb({
    filename: path.resolve(db_dir, 'trainDB.db'),
    autoload: true
})

/**
 * 培训项目关联
 *|_id|trainId|projectId|score|failedSubjectIds|
 *|主键|培训Id|项目Id|得分|错误题号|
 */

const TrainProjectDB = new Nedb({
    filename: path.resolve(db_dir, 'trainProject.db'),
    autoload: true
})

/**
 * 科目类别
 *|_id|name|parentId|appointId|createTime|
 *|主键|名称|父Id|业务主键|创建时间|
 */

const ProjectTypeDB = new Nedb({
    filename: path.resolve(db_dir, 'projectType.db'),
    autoload: true
})

/**
 * 题目表
 *|_id|number|title|appointId|createTime|typeId
 *|主键|题号|标题|业务主键|创建时间|类目Id|
 */

const SubjectDB = new Nedb({
    filename: path.resolve(db_dir, 'subject.db'),
    autoload: true
})

/**
 * 培训档案
 * |_id|uid|userName|birthday|idCardNo|averageScore|result|startTime|typeId|typeName|projectId|projectName|projectList
 * |主键|用户id|用户名称|生日|身份证号|平均分|考核结果|时间|类别Id|类别名称|项目Id|项目名称|项目明细列表
 *
 * 项目明细列表
 * |typeId|typeName|projectId|projectName|errorCount|score|errorList|
 * |类型Id|类型名称|项目Id|项目名称|错误题数|得分|错题信息
 *
 * 错题列表
 * |subjectId|number|title|
 * |题目Id|题号|题目内容|
 */
const RecordDB = new Nedb({
    filename: path.resolve(db_dir, 'recordDB.db'),
    autoload: true
})


const ProgramDB = new Nedb({
    filename: pathUtils.getDbPath('program.db'),
    autoload: true,
    inMemoryOnly: false,
    timestampData: false
})

const ClassifyDB = new Nedb({
    filename: pathUtils.getDbPath('classify.db'),
    autoload: true,
    inMemoryOnly: false,
    timestampData: false
})

const ManageDB = new Nedb({
    filename: pathUtils.getDbPath('manage.db'),
    autoload: true,
    inMemoryOnly: false,
    timestampData: false
})



const dataBase = {
    UserInfoDB, EquipmentDB, TrainDB, TrainProjectDB, ProjectTypeDB, SubjectDB, RecordDB, ProgramDB, ClassifyDB,ManageDB
}

export default dataBase
