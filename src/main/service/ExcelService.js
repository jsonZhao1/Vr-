/**
 * excel处理模块
 */
var ExcelService = require('exceljs');
var fs = require('fs');
var path = require('path');

var service = {
    /**
     * excel写入操作
     * @param path 文件路径
     * @param columns 列的定义
     * @param data 数据（数组）
     */
    // writeExcel:function(filepath,columns,data){
    //     //1.根据path生成excel文件的路径
    //     var filepath = globalCfg.file_path+filepath;
    //     console.log('写入文件路径：',filepath);
    //     // 2.判断该文件是否存在，不存在则生成该文件
    //     var isExist = fs.existsSync(filepath);
    //     if(isExist){// 生成文件
    //         fs.writeFileSync(filepath);
    //     }
    //     // 记录开始时间
    //     var start_time = new Date();
    //     var workbook = new ExcelService.stream.xlsx.WorkbookWriter({
    //         filename: filepath
    //     });
    //     var worksheet = workbook.addWorksheet('Sheet');
    //
    //     worksheet.columns = columns;
    //     var length = data.length;
    //
    //     // 当前进度
    //     var current_num = 0;
    //     var time_monit = 400;
    //     var temp_time = Date.now();
    //
    //     console.log('开始添加数据');
    //     // 开始添加数据
    //     for(let i in data) {
    //         worksheet.addRow(data[i]).commit();
    //         current_num = i;
    //         if(Date.now() - temp_time > time_monit) {
    //             temp_time = Date.now();
    //             console.log((current_num / length * 100).toFixed(2) + '%');
    //         }
    //     }
    //     console.log('添加数据完毕：', (Date.now() - start_time));
    //     workbook.commit();
    //
    //     var end_time = new Date();
    //     var duration = end_time - start_time;
    //
    //     console.log('用时：' + duration);
    //     console.log("程序执行完毕");
    // },

    /**
     * 读取excel文件，并转换成实体列表
     * @param excelfile
     * @param model 模型
     * @param readHead 是否读取第一行
     * @param callback
     */
    readExcel:function(excelfile,model,readHead,globalCfg,callback){
        var workbook = new ExcelService.Workbook();
        workbook.xlsx.readFile(excelfile).then(function() {
            var result = new Array();
            var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
            for(let i = 2;worksheet;i++){
                // 清空数组
                var modelList = new Array();
                worksheet.eachRow(function(row, rowNumber) {
                    if(!readHead && rowNumber==1){
                        return;
                    }
                    var rowSize = row.cellCount;
                    var numValues = row.actualCellCount;
                    //console.log("单元格数量/实际数量:"+rowSize+"/"+numValues);
                    // cell.type单元格类型：6-公式 ;2-数值；3-字符串
                    var newModel = new Object();
                    // 设置默认值
                    newModel.visible = 1;
                    row.eachCell(function(cell, colNumber) {
                        if(cell.type==6){
                            var value=cell.result;
                        }else{
                            var value=cell.value;
                        }
                        var field = model[colNumber-1];
                        if(field['type'] == 'path'){
                            value = path.join(globalCfg.lib_path,value);
                        }
                        // 添加点击次数
                        if(field['key'] == 'type'){
                            newModel.click = 0;
                        }
                        newModel[field['key']] = value;
                        console.log('Cell ' + colNumber + ' = ' +cell.type +" " +value);
                        console.log(globalCfg)
                    });
                    modelList.push(newModel);
                });
                result.push(modelList);
                worksheet = workbook.getWorksheet(i);
            }
            console.log(result);
            callback(result);
        });
    }
}

module.exports = service;
