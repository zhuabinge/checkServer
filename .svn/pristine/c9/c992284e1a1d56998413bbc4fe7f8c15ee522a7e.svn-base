var lib = require('../lib');
var config = lib.config;
var mysql = lib.getMysql();
var events = mysql.dbQuery('SELECT * FROM `events` WHERE `counter` > 0 AND `level` > 0');
//获取有问题的事件
events.forEach(function (e) {
  //发送邮件
  mailOptions = {};
  if (config.mail.name !== undefined) {
    mailOptions.from = config.mail.name + '<' + config.mail.email + '>';
  } else {
    mailOptions.from = config.mail.email;
  }
  to = util.getManagers(e.level, e.counter);
  if (to[0]) {
    //构建邮件内容
    mailOptions.to = to.join(', ');
    if (e.level === util.LEVEL.WARN) {
      mailOptions.subject = '[警告 ！！]';
    } else if (e.level === util.LEVEL.MAJOR) {
      mailOptions.subject = '[严重等级1 ！！]';
    } else if (e.level === util.LEVEL.CRITICAL) {
      mailOptions.subject = '[严重等级2 ！！]';
    } else if (e.level === util.LEVEL.ERROR_3) {
      mailOptions.subject = '[严重等级3 ！！]';
    } else {
      mailOptions.subject = '[严重等级4 未知等级 ！！]';
    }
    mailOptions.text = [];
    var table = 'logs_' + (new Date(e.day *(1000 * 60 * 60 * 24)).getDay());
    var logs = util.dbQuery([
      'SELECT * FROM `' + table + '` l, `equipments` e, `check_servers` cs WHERE ',
      'cs.`id` = l.`csid`',
      'AND e.`id` = l.`eid`',
      'AND l.`id` IN',
      e.logs.replace('[', '(').replace(']', ')'),
    ].join(' '));
    mailOptions.subject = mailOptions.subject + ' ' +logs[0].ip +' 服务器异常，请尽快处理';
    mailOptions.text.push('cs\tloss\tavg\tmax\tmin\ttime\tmsg');
    logs.forEach(function(log) {
      mailOptions.text.push([
        log.name,
        log.loss,
        log.avg,
        log.max,
        log.min,
        log.time,
        log.msg,
      ].join('\t'));
    });
    mailOptions.text = mailOptions.text.join('\n');
    console.log(mailOptions);
    // util.sendEmail(mailOptions);
  }
});
