var weeks = ['Mo','Tu','We','Th','Fr','Sa','Su'];
Date.prototype.pattern=function(fmt) {
    var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours(), //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};
var dateUtil = {
  //获取当前日期和时间
  getCurrentDate: function(){
    return (new Date()).pattern("yyyyMMddhhmmss");
  },
  //获取天级别的时间戳
  getDayTime: function() {
  return parseInt((new Date().getTime()/(1000 * 60 * 60 * 24)), 10);
  },
  //获取秒级别的时间戳
  getSecondTime: function() {
  return parseInt(new Date().getTime()/1000, 10);
  },
  //获取分钟级别的时间戳
  getMinuteTime: function() {
  return parseInt(new Date().getTime()/ (1000 * 60), 10);
  },
  //获取与当天偏移day的星期数
  getWeek: function() {
   return weeks[new Date().getDay() - 1];
  },
  getDayBySecondTime: function() {

  },
  getDateString: function(date, pattern) {
    if (!pattern) {
      pattern = 'yyyy-MM-dd';
    }
    return date.pattern(pattern);
  },
};
exports.getDateUtil = function() {
  return dateUtil;
};
