var config = require('../etc/config'), logger, sys, mysql, dateUtil;
exports.config = config;
exports.LEVEL = {
  CLOSE: -1,
  OK: 0,
  WARN: 1,
  MAJOR: 2,
  CRITICAL: 3,
  UNKNOWN: 5,
};
exports.getEjsUtil = function(host) {
  return require('./ejsUtil').getEjsUtil(host);
};
exports.getDateUtil = function() {
  return require('./time').getDateUtil();
};
exports.getMysql = function() {
  return require('./mysql').getMysql();
};
exports.getLogger = function(log) {
  return require('./logger').getLogger(log);
};
exports.getModel = function(model) {
  return require('./sys').getModel(model);
};
exports.getView = function() {
  return require('./sys').getView();
};
exports.getController = function(controller) {
  return require('./sys').getController(controller);
};
