var EjsUtil = function (host) {
  this.host = host;
};
EjsUtil.prototype.url = function (url) {
  return 'http://' + this.host + '/'+ url;
};
module.exports.getEjsUtil = function(host) {
   return new EjsUtil(host);
};
