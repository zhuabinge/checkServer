var lib = require('./lib');
config = lib.config;
workerLogger = lib.getLogger('worker');
var onExit = function() {
  lib.getLogger('worker').info('子进程' + process.pid + ' 已终止');
  setImmediate(function() {
    process.exit(1);
  });
};
process.on('SIGTERM', onExit);
process.on('SIGINT', onExit);
// 错误函数
var onError = function(error) {
  workerLogger.fatal(error);
  onExit();
};
process.on('uncaughtException', function(error) {
  onError(error);
});
workerLogger.info('子进程' + process.pid + ' 已启动');
var fs = require('fs');
var app = require('express')();
var bodyParser = require('body-parser');
app.set("view engine","ejs");
app.set('views', config.viewPath || __dirname + '/sys/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.router);
app.use(function(req, res, next) {
  if ((result = req._parsedUrl.pathname.match(/\.(js|css|mp3|png)$/))) {
    filePath = config.staticPath + req._parsedUrl.pathname;
    var context = fs.readFileSync(filePath);
    if (result[1] === 'mp3') {
      res.setHeader('Accept-Ranges', 'bytes');
    } else if (result[1] === 'css') {
      res.setHeader('Content-Type', 'text/css');
    } else if (result[1] === 'js') {
      res.setHeader('Content-Type', 'text/html;charset=UTF-8');
    } else if (result[1] === 'png') {
      res.setHeader('Content-Type', 'image/png');
    }
    res.setHeader('Content-Length', context.length);
    res.end(context);
  }
  next();
});
//定义ejs扩展方法
app.use(function(req, res, next){
  res.locals.util = lib.getEjsUtil(req.headers.host);
  next();
});
app.use(function(req, res, next) {
  var _router = req._parsedUrl.pathname.split('/');
  query = req.query;
  body = 'controller不存在';
  _controller = _router[1] === '' ? 'index' : _router[1];
  _action = !_router[2] || _router[2] === '' ? 'index' : _router[2];
  controller = lib.getController(_controller);
  if (controller) {
    if (typeof controller[_action] === 'function') {
      controller.query = query;
      view = lib.getView();
      view.assign('GET', query);
      view.assign('action', _action);
      view.assign('controller', _controller);
      controller.view = view;
      controller[_action](req, res);
      return;
    }
    body = 'actioin不存在';
  }
  res.end(body);
});
app.use(function(err, req, res, next){
  workerLogger.error(err.stack);
  res.send(500, err.stack);
});
app.listen(9999);
