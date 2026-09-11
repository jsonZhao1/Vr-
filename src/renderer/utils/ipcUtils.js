import { ipcRenderer } from 'electron'

/**
 * 发送消息
 * @param channel
 * @param status
 */
export function sendData(channel, status) {
  ipcRenderer.send(channel, status)
}

/**
 *  接受数据
 * @param channel
 * @param status
 * @param callback
 */
export function getData(channel,status, callback) {
  ipcRenderer.once(channel, (event, data) => {
    callback(data)
  })
  ipcRenderer.send(channel, status)
}
