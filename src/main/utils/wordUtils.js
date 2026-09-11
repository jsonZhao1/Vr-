const officegen = require('officegen')
const fs = require('fs')
const path = require('path')

 const headerArr1 = [{
        val: "姓名",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "性别",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "生日",
        opts: {
            cellColWidth: 50,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "身份证号",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "平均得分",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "考核结果",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    }]
const headerArr2 = [{
        val: "VR类别",
        opts: {
            cellColWidth: 84,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book",
        }
    },{
        val: "VR项目",
        opts: {
            cellColWidth: 42,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "失分题",
        opts: {
            cellColWidth: 84,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    },{
        val: "得分",
        opts: {
            cellColWidth: 84,
            b:true,
            sz: '20',
            shd: {
                fill: "7F7F7F",
                themeFill: "text1",
                "themeFillTint": "80"
            },
            fontFamily: "Avenir Book"
        }
    }
   ]
const tableStyle = {
    tableColWidth: 5000,
    tableSize: 20,
    tableColor: "ada",
    tableAlign: "left",
    tableFontFamily: "Comic Sans MS",
    borders: true, // default is false. if true, default border size is 4
    borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
}

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
export function exportWord(rercords,filepath,callback){
    try{
        let docx = officegen('docx')
        docx.on('finalize', function(written) {
          callback(null)
        })
        docx.on('error', function(err) {
          callback(err)
        })
        // 设置title
        docx.setDocTitle('培训成绩')
        // 写入标题
        let pObj = docx.createP({align:'center'})
        pObj.addText('实名制考核记录',{
            bold:true,
            font_size:30
        })
        const tableStyle = {
            tableColWidth: 5000,
            tableSize: 20,
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "Comic Sans MS",
            borders: true, // default is false. if true, default border size is 4
            borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
        }
       
        for(let record of rercords){
            let tableData = []
            // 获取数据
            let { userName,sex,birthday,idCardNo,averageScore,result,startTime }  = record
            tableData.push(headerArr1)
            tableData.push([userName,sex,birthday,idCardNo,averageScore,result])
            tableData.push(headerArr2)
            let {projectList} = record
            for(let project of projectList){
                let { typeName,projectName,errorNumbers,score } = project
                tableData.push([typeName,projectName,errorNumbers,score])
            }
            var data = [{
                    type: "table",
                    val: tableData,
                    opt: tableStyle
                }
            ]
            docx.createByJson(data)
            let pObj2 = docx.createP()
            pObj2.addText('时间:'+startTime,{
                bold:true,
                font_size:16
            })
            pObj2.addText('                                ')
            pObj2.addText('签名:',{
                bold:true,
                font_size:16
            })
            pObj2.addText('_______________',{
                bold:true,
                font_size:16
            })
            docx.createP()
            
        }
        if(!fs.existsSync(filepath)){
            mkdirsSync(path.dirname(filepath))
        }
        
        let out = fs.createWriteStream(filepath)
        docx.generate(out)
    }catch(err){
        callback(err)
    }
}
