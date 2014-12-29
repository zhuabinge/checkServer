module.exports = function(lib) {
  loger = lib.getLogger('api');
  mysql = lib.getMysql();
  dateUtil = lib.getDateUtil();
  LEVEL = lib.LEVEL;
  eventsModel = lib.getModel('events');
  logsModel = lib.getModel('logs');
  return {
    check: function (data) {
      //获取当天该设备当天错误事件
      var day = dateUtil.getDateString(new Date()), save = true;
      even = eventsModel.getErrorEven(data.equipment['id'], data.cs['id']);
      if (!even) {
        even = {
          eid: data.equipment['id'],
          csid: data.cs['id'],
          logs: '[]',
          type: 1,
          day: day,
          level: 0,
          counter: 0,
        };
      }
      if (data.loss < 2) {
        even.end_time = dateUtil.getSecondTime();
        even.level = LEVEL.OK;
        if (!even.id) {
          save = false;
        }
        data.msg = data.equipment.ip + ' ok';
      } else if (data.loss < 4 && data.avg < 50) {
        even.end_time = dateUtil.getSecondTime();
        even.level = LEVEL.OK;
        if (!even.id) {
          save = false;
        }
        data.msg = data.equipment.ip + ' ok';
      } else if (data.loss < 4 && data.avg < 100) {
        if (even.level < LEVEL.WARN) {
          even.level = LEVEL.WARN;
        }
        data.msg = data.equipment.ip + ' WARN';
      } else if (data.loss < 4 && data.avg < 200) {
        if (even.level < LEVEL.MAJOR) {
          even.level = LEVEL.MAJOR;
        }
        even.counter++;
        data.msg = data.equipment.ip + ' MAJOR';
      } else if (data.loss < 4 && data.avg >= 200) {
        if (even.level < LEVEL.CRITICAL) {
          even.level = LEVEL.CRITICAL;
        }
        even.counter++;
        data.msg = data.equipment.ip + ' CRITICAL';
      } else if (data.loss < 6 && data.avg < 50) {
        if (even.level < LEVEL.WARN) {
          even.level = LEVEL.WARN;
        }
        data.msg = data.equipment.ip + ' WARN';
      } else if (data.loss < 6 && data.avg < 150) {
        if (even.level < LEVEL.MAJOR) {
          even.level = LEVEL.MAJOR;
        }
        even.counter++;
        data.msg = data.equipment.ip + ' MAJOR';
      } else if (data.loss < 6 && data.avg >= 150) {
        if (even.level < LEVEL.CRITICAL) {
          even.counter++;
          even.level = LEVEL.CRITICAL;
        }
        data.msg = data.equipment.ip + ' CRITICAL';
      } else {
        if (even.level < LEVEL.UNKNOWN) {
          even.level = LEVEL.UNKNOWN;
        }
        even.counter++;
        data.msg = data.equipment.ip + ' UNKNOWN';
      }
      //保存日志
      var logResult = logsModel.insertLog(data);
      even.logs = JSON.parse(even.logs);
      if (logResult) {
        even.logs.push(logResult.insertId);
      } else {
        loger.error('[ping insert error] msg ==> ' + mysql.sqlString.objectToValues(data));
      }
      if (save) {
        even.logs = JSON.stringify(even.logs);
        eventsModel.saveEven(even);
      }
    },
  };
};

