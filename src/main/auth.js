const crypto = require('crypto');
const getmac = require('getmac');
const fs = require('fs');
const md5 =require('md5');
const process = require('process');
const path = require('path');
const pathUtils = require('./utils/pathUtils');
/**
 * AES加密的配置
 * 1.密钥
 * 2.偏移向量
 * 3.算法模式CBC
 * 4.补全值
 */
var AES_conf = {
    key: getSecretKey(), //密钥
    iv: '1012132405963708', //偏移向量
    padding: 'PKCS7Padding' //补全值
}

/**
 * 读取密钥key
 * 更具当前客户端的版本vid、平台platform获取对应的key
 */
function getSecretKey(){
    return "iujlkalnxlasdkaj";
}

/**
 * AES_128_CBC 加密
 * 128位
 * return base64
 */
function encryption(data) {
    let key = AES_conf.key;
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;

    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
}



/**
 * 解密
 * return utf8
 */
function decryption(data){

    let key = AES_conf.key;
    let iv = AES_conf.iv;
    // let padding = AES_conf.padding;

    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
}


function isAuth(callback){

    let secretKeyPath = pathUtils.resolveInstallFile('secretKey.properties');
    let uuidPath = pathUtils.getDbPath('uuid.txt');
    // 获取机器码
    let promise = new Promise((resolve, reject) => {

        getmac.getMac(function(err,mac){
            let uuid=md5(mac);
            global.uuid=uuid;
            resolve(uuid);
        })
    });
    promise.then(function(mymac){
        // 生成加密后的mac地址
        pathUtils.ensureDirSync(path.dirname(uuidPath));
        fs.writeFileSync(uuidPath, mymac)
        // 读取文件
        if(!fs.existsSync(secretKeyPath)){
            return callback({result:false,message:'没有授权！'});
        }else{
            // 读取文件信息
            let text = fs.readFileSync(secretKeyPath)
            let secret = text.toString()
            // 解码
            try {
                let code = decryption(secret);
                let data = code.split(';')
                let startDate = new Date(data[0]);
                let endDate = new Date(data[1]);
                let mac = data[2];
                if(mac!=md5('00000000')){// 不是体验版

                    if(mac != mymac){
                        console.log(3)
                        return callback({result:false,message:'没有授权！'});
                    }
                }
                // 检查是否过期
                if(!isValidate(startDate,endDate)){
                    return callback({result:false,message:'授权码已过期，请联系提供商获取！'});
                }
                // 是否注册的是本平台
                if(global.appId != appId){
                    return callback({result:false,message:'不是本平台！'});
                }
                return callback({result:true,message:'授权成功！'});
            }catch (e) { // 解码报错 返回false
                console.log(4)
                return callback({result:false,message:'没有授权！'});
            }
        }

    })
}
function isValidate(startDate,endDate){
    endDate.setDate(endDate.getDate() + 1);
    let now = new Date();
    if(now.getTime()>=startDate.getTime() && now.getTime()<=endDate.getTime()){
        return true;
    }else{
        return false;
    }
}

isAuth(function(result){
    console.log(result);
})

export  default {
    isAuth:isAuth

}
