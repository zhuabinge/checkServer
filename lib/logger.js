var lib = require('./index');
var config = lib.config;
var log4js = require('log4js');
configure = config.etcPath;
log4js.configure(configure + '/' + 'log4js.json', {
  cwd: __dirname
});
loggers = [];
exports.getLogger = function (l) {
  if (!loggers[l]) {
    loggers[l] = log4js.getLogger(l);
  }
  return loggers[l];
};
