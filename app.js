#!/usr/bin/node
var lib = require('./lib');
config = lib.config;
logger = lib.getLogger('app');
// 退出函数
var onExit = function() {
  logger.info('系统主进程' + process.pid + ' 已终止');
  setImmediate(function() {
    process.exit(1);
  });
};
process.on('SIGTERM', onExit);
process.on('SIGINT', onExit);
// 错误函数
var onError = function(error) {
  logger.fatal(error);
  onExit();
};
process.on('uncaughtException', function(error) {
  onError(error);
});
var cluster = require('cluster'), daemonize = false;
cluster.setupMaster({
  exec : __dirname + '/worker.js',
});
do {
  var argv = process.argv, op = 'start';
  if (argv.length == 3) {
    op = argv[2];
  }
  if (op !== 'start' && op !== 'stop' && op !== 'restart') {
    console.log('无效的启动参数');
    break;
  }
  daemonize = config.daemonize || false;
  var pid = config.pid || __dirname + '/app.pid', removePid = false, fs = require('fs');
  if (op === 'stop' || op === 'restart') {
    if (!fs.existsSync(pid)) {
      console.log('找不到已启动的系统进程');
      break;
    } else {
      var processPid = parseInt(fs.readFileSync(pid, 'ascii'), 10);
      if (!isNaN(processPid)) {
        process.kill(processPid);
      }
    }
    if (op === 'stop') {
      break;
    } else {
      // 等待 pid 文件删除
      while (fs.existsSync(pid)) {}
    }
  }
  if (fs.existsSync(pid)) {
    console.log('系统进程已存在');
    break;
  }
  if (daemonize) {
    // 后台运行
    if (process.env.__daemonize === undefined) {
      process.env.__daemonize = true;
      var child = require('child_process').spawn(argv[1], [], {
        stdio: [0, 1, 2],
        cwd: process.cwd,
        env: process.env,
        detached: true
      });
      child.on('error', function(e) {
        logger.fatal(e);
      });
      child.unref();
      // 后台进程已启动，主进程关闭
      break;
    }
  }
  fs.writeFileSync(pid, process.pid, 'ascii');
  removePid = true;
  process.on('exit', function() {
    if (removePid && fs.existsSync(pid)) {
      fs.unlinkSync(pid);
    }
  });
  // 启动子进程
  if (config.workerProcesses !== undefined) {
    workerProcesses = parseInt(config.workerProcesses, 10);
  } else {
    workerProcesses = require('os').cpus().length;
  }
  workerProcesses = Math.max(Math.min(workerProcesses, 64), 1);
  for (var i = 0; i < workerProcesses; ++i) {
    cluster.fork();
  }
  logger.info('系统主进程' + process.pid + ' 已启动');
  logModel = lib.getModel('logs');
  //主进程负责清除或建logs表
  logModel.clearTable();
  //定时清除明天的表
  setInterval(function() {
    logModel.clearTable(1);
  }, 1000 * 60 * 60 * 5);
}while(0);
