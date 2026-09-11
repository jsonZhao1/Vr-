export function formatDate(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

//创建时间格式化显示
export  function formatDateStr(value){
    var crtTime = new Date(value);
    return formatDate("yyyy-MM-dd hh:mm:ss",crtTime);//直接调用公共JS里面的时间类处理的办法     
}

// 获取当前时间
export  function formatNowDate(){
    return formatDate("yyyy-MM-dd hh:mm:ss",new Date());//直接调用公共JS里面的时间类处理的办法     
}

/**
 * 秒转换成点分显示
 */
export function formatSecond(seconds){
    let hour = parseInt(seconds/3600)+''
    
    let minute = parseInt(seconds%3600/60)+''
    
    let second = parseInt((seconds%3600%60))+''
    
    if(hour.length==1){
        hour = '0'+hour
    }
    if(minute.length==1){
        minute = '0'+minute
    }
    if(second.length==1){
        second = '0'+second
    }
   return hour+':'+minute+':'+second
}