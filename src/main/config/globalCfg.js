const path = require('path');
const fs = require('fs');
const nedb = require('nedb');
const {app} = require('electron');
const pathUtils = require('../utils/pathUtils');
// 默认配置


// module.exports = cfg
function cfg() {
    let config = {
        id: 1,
        closeApp: 'Win64-Shipping.exe',
        lib_path: pathUtils.getLibraryRoot(),
        server_url: 'http://cloud.yyhvr.cn:81',
        server_ip: '116.62.225.179',
        server_port: '81',
        icons_path: '/icons/',
        programs_path: '/programs/',
        gzip_path: '/gzip/',
        videos_path: '/videos/',
        images_path: '/images/',
        background_path: '/background/',
        exec_file_name: 'VR.exe',
        token: '',
        model: [
            {key: 'id', type: 'int'},
            {key: 'parentId', type: 'int'},
            {key: 'name', type: 'string'},
            {key: 'type', type: 'string'},
            {key: 'icon', type: 'path'},
            {key: 'src', type: 'path'},
            {key: 'videoPath', type: 'path'},
            {key: 'imgPath', type: 'path'},
            {key: 'bg', type: 'path'},
            {key: 'visible', type: 'int'},
            {key: 'authStartTime', type: 'string'},
            {key: 'authStartTime', type: 'string'},
            {key: 'downloadCount', type: 'int'}
        ],
        triggerModel: 0, // 0 :鼠标模式 1:悬停触发模式 2:二者都可以
        second: 5000,// 悬停时间
        version: '1.0.0'
    }
    const cfgPath = pathUtils.getConfigFilePath('app.json');
    pathUtils.ensureDirSync(path.dirname(cfgPath));
    if (fs.existsSync(cfgPath)) {
        let json = fs.readFileSync(cfgPath, {encoding: 'utf-8'}).toString();
        try {
            // 用户自定义
            config = JSON.parse(json);
            config.lib_path = pathUtils.normalizeLibraryRoot(config.lib_path);
        } catch (e) {

        }
    } else {
        // 将默认配置写入安装路径
        fs.writeFileSync(cfgPath, JSON.stringify(config));
    }
    config.lib_path = pathUtils.normalizeLibraryRoot(config.lib_path);
    fs.writeFileSync(cfgPath, JSON.stringify(config));
    // 共享数据
    global.sharedObject = {
        cfg: config
    };
    return config;
}

export default cfg;

