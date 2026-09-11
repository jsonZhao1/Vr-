/**
 * http接口
 */
const { createTrainPro } = require('./operate.js')
const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const { app:electronApp } =  require('electron')
const path =  require('path')
const pathUtils = require('../../utils/pathUtils')
let filename = path.resolve(pathUtils.getStorageRoot(), 'file', 'trainResult.docx')

//模板引擎
app.set("view engine","ejs");
//bodyParser API
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//设置跨域访问
app.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By",' 3.2.1');
   res.header("Content-Type", "application/json;charset=utf-8");
   next();
});

var questions=[
{
    data:213,
    num:444,
    age:12
},
{
    data:456,
    num:678,
    age:13
}];

//写个接口123
app.post('/rest/vr/operate/createTrainPro',function(req,res){
    res.status(200),
    createTrainPro(req.body,result=>{
        res.json(result)
    })
    
});
app.post('/download',(req,res) => {
    res.set({
        "Content-Type":"application/octet-stream",//告诉浏览器这是一个二进制文件
        "Content-Disposition":"attachment; filename=TrainResult.docx"//告诉浏览器这是一个需要下载的文件
    });
    console.log(filename, '文件路径')
    fs.createReadStream(filename).pipe(res);
});
var server = app.listen(8005, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})
