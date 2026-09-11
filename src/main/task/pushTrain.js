const {default: {RECORD_DB}} = require('../constant/dbNameConstants')
const dbUtils = require('../utils/dbUtils')
const request = require('request')
const appID = "vrtrain";
const appKey = "f61521aee50acc47583aa3b03c1938bba30f7f4d";
const crypto = require('crypto');

function pushTrainTask() {
    setInterval(function () {
        dbUtils.getList(RECORD_DB, {pushStatus: 1, state: 3}).then(trainList => {

            if (trainList && trainList.length > 0) {
                console.log(trainList);
                let train = trainList[0];
                let param = JSON.stringify(train);
                let timestamp = Date.now();
                let sign = crypto.createHash('sha1').update(appID + timestamp + param + appKey).digest('hex');
                request({
                    headers: {
                        "content-type": "application/json",
                        "appID": appID,
                        "timestamp": timestamp,
                        "sign": sign
                    },
                    url: 'http://221.238.40.114:8055/api/sourcedata/worker/train/vr/trainList',
                    method: 'POST',
                    body: param
                }, function (error, response, data) {
                    if (!error && response.statusCode == 200) {
                        let result = JSON.parse(data);
                        if (result.errcode == 0 && result.errmsg == "success") {
                            dbUtils.updateByID(RECORD_DB, {_id: train._id, pushStatus: 2}).then(res => {
                                console.log("更新成功！" + res);
                            })
                        }
                    }
                });
            }

        });
    }, 60000, 'funky');

    console.log("==============>开始执行定时23333");
}

/*
let syncData = function () {
    console.log("==============>执行定时");
    dbUtils.getList(RECORD_DB, {pushStatus: 1}).then(trainList => {
        console.log("==============>培训集合..." + trainList);
        if (trainList && trainList.length > 0) {
            for (let train of trainList) {
                //推送
                request({
                    headers: {"Connection": "close"},
                    url: 'http://127.0.0.1:8080/api/equipment/testCheck',
                    method: 'POST',
                    json: true,
                    body: train
                }, function (error, response, data) {
                    if (!error && response.statusCode == 200) {
                        console.log('----info------', data);
                    }
                });
            }
        }
    })
}
*/

export default {
    run: pushTrainTask
}

