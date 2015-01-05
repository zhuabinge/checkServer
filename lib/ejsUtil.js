var EjsUtil = function (host) {
  this.host = host;
};
EjsUtil.prototype.url = function (url) {
  return 'http://' + this.host + '/'+ url;
};
EjsUtil.prototype.date = function(time) {
	return time.substr(0, 4) + "-" + time.substr(4, 2)  + "-" + time.substr(6, 2)  + " " + time.substr(8, 2)  + ":" + time.substr(10, 2)  + ":" + time.substr(12, 2) ;
};
module.exports.getEjsUtil = function(host) {
   return new EjsUtil(host);
};
