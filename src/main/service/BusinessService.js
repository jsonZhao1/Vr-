const globalCfg = require('../config/globalCfg');
const excelService = require('./ExcelService');
const fs = require('fs');
const nedb = require('nedb');
const os = require('os');
const path = require('path');
const pathUtils = require('../utils/pathUtils');
// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
    filename: pathUtils.getDbPath('system.db'),
    autoload: true,
    inMemoryOnly:false,
    timestampData:false
});
// 设置唯一性约束
db.ensureIndex({ fieldName: 'id', unique: true, sparse: true }, function (err) {});
db.ensureIndex({ fieldName: 'idPath', unique: true, sparse: true }, function (err) {});

export default {
    /**
     * 将excel文件导入数据库
     */
    importExcel:function(callback){
        console.log(globalCfg.lib_path);
        let excelPath = path.join(globalCfg.lib_path,'./excel/model.xlsx');
        let model = globalCfg.model;
        console.log(model);
        //  查找文件
        if(!fs.existsSync(excelPath)){
            return console.log('file not found!');
        }
        // 读取文件信息
        excelService.readExcel(excelPath,model,false,function(result){
            console.log('excel数据入库开始---------------------->');
            let promise = new Promise(function (resolve, reject){
                let rows = new Array();
                for(let sheet of result){
                    for(let row of sheet){
                        rows.push(row);
                    }
                }
                console.log(rows);

                // 排序
                rows.sort(function(a,b){
                    if(a.id>b.id){
                        return 1;
                    }else if(a.id<b.id){
                        return -1;
                    }else{
                        return 0;
                    }
                })
                // 记录成功的次数
                var count = 0;
                for(let row of rows){
                    let parents = rows.filter(function(data){
                        if(data.id === row.parentId){
                            return data;
                        }else{
                            return null;
                        }
                    })
                    if(parents.length == 0){
                        row.idPath = 0+'-'+row.id;
                    }else{
                        row.idPath = parents[0].idPath+'-'+row.id;
                    }
                    console.log(row)
                    db.update({id:row.id},{$set:row},{},function(err,numReplaced){
                        if(numReplaced == 0){
                            db.insert(row,function(err,doc){
                                count++;
                                console.log(count)
                                if(count == rows.length){
                                    resolve();
                                }
                            })
                        }else{
                            count++;
                            console.log(count)
                            if(count == rows.length){
                                resolve();
                            }
                        }
                    });
                }
            })
            // 查询所有信息
            promise.then(function(){
                db.find({},function(err,doc){
                    event.sender.send('data-info',doc)
                });
            })
        });
    },
    /**
     * 查询树结果
     * @param callback
     */
    queryTree:function(id,callback){
        if(!id){
            id = 0;
        }
        let find = new Promise(function (resolve, reject) {
            db.find({},function(err,doc){
                if(err){
                    console.error(err);
                    return ;
                }
                resolve(doc);
            })
        });
        // 对结果进行封装
        find.then(function(rows){
            // 倒序排序
            rows.sort(function(a,b){
                if(a.id>b.id){
                    return -1;
                }else if(a.id < b.id){
                    return 1;
                }else{
                    return 0;
                }
            })

            for(let row of rows){
                // 查询下一级
                let childRows = rows.filter(function(data){
                    if(data.parentId == row.id){
                        return data;
                    }
                })
                console.log(childRows);
                row.childRows = childRows;
            }
            // 根据id查询树
            let trees;
            if(id != 0) {
                trees = rows.filter(function (data) {
                    if (data.id == id) {
                        return data;
                    }
                });
                callback(tree[0]);
            }else{
                trees = rows.filter(function (data) {
                    if (data.parentId == 0) {
                        return data;
                    }
                });
                callback(tree);
            }
        })
    }

};


