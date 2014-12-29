rootPath = require('path').dirname(__dirname);
module.exports = {
  version: '1.0.0',
//  daemonize: true,
  port: 9999,
  log4js: 'etc/log4js.json',
  mysql: {
    host : '127.0.0.1',
    port : '3306',
    user : 'root',
    password :'',
    name : 'checkServer',
  },
  mail: {
    host: '63.223.120.128',
    port: 10086,
    // secure: true,
    user: 'post',
    password: '@fork-dgl_2015.bunBunmyxhhz*',
    email: 'post-10000@mailbox.youmaiba.com',
    name: '服务器监控程序'
  },
  rootPath: rootPath,
  libPath: rootPath + '/lib',
  etcPath: rootPath + '/etc',
  modelPath: rootPath + '/sys/models',
  controllerPath: rootPath + '/sys/controllers',
  // viewPath: rootPath + '/sys/views',
  staticPath: rootPath + '/statics',
};
