const successCode = 200
const errorCode = 500
export function error(message='请求失败') {
    return {
        code:errorCode,
        message
    }
}

export function success(message='请求成功',data={}) {
    return {
        code:successCode,
        message,
        data
    }
}
