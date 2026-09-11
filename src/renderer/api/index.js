const {ipcRenderer} = require("electron");


function GetData(post, url, data) {
    return new Promise(function (resolve, reject) {
        ipcRenderer.send(post, data);
        ipcRenderer.on(url, function (event, message) {
            // if(message){

            // }else{
            //   reject();
            // }
            resolve(message);
        });
    }).catch((e) => {
    })
}

export default GetData;
