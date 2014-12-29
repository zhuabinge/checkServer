module.exports = function(lib) {
  mysql = lib.getMysql();
  return {
    //根据时间创建相应时间的日志表
    clearTable: function(offset) {
      if (!offset) {
        offset = 0;
      }
      var result = true , sql, tableIsExist = false;
      var table = 'logs_' + (new Date().getDay() + offset);
      tables = mysql.dbQuery('SHOW TABLES;');
      for (var i = tables.length - 1 ; i >= 0 ; i-- ) {
        for (var KEY in tables[i]) {
          if (tables[i][KEY] === table) {
            tableIsExist = true;
            break;
          }
        }
        if (tableIsExist === true) {
            break;
        }
      }

      if (tableIsExist) {
        if (offset !== 0) {
          sql = 'DELETE FROM `' + table + '`';
          result =  mysql.dbExecute(sql);
        }
        return result;
      }
      sql = [
        'CREATE TABLE `' + table + '` (',
        '`id` int(10) unsigned NOT NULL AUTO_INCREMENT,',
        '`eid` int(10) unsigned NOT NULL DEFAULT "0",',
        '`csid` int(10) unsigned NOT NULL DEFAULT "0",',
        '`loss` int(6) unsigned NOT NULL DEFAULT "0",',
        '`avg` decimal(10,2) NOT NULL DEFAULT "0.00",',
        '`max` int(6) unsigned NOT NULL DEFAULT "0",',
        '`min` int(6) unsigned NOT NULL DEFAULT "0",',
        '`time` int(11) unsigned NOT NULL DEFAULT "0",',
        '`create` int(11) unsigned NOT NULL DEFAULT "0",',
        '`msg` text NOT NULL,',
        'PRIMARY KEY (`id`)',
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      ].join('\n');
      return mysql.dbExecute(sql);
    },
    //插入一条日志
    insertLog: function(data) {
      time = parseInt(data.time, 10)  * 1000;
      var table = 'logs_' + new Date(time).getDay();
      var log = {
        eid: data.equipment.id,
        csid: data.cs.id,
        loss: data.loss,
        avg: data.avg,
        max: data.max,
        min: data.min,
        time: data.time,
        msg: data.msg,
        create: dateUtil.getSecondTime(),
      };
      var sql = mysql.sqlString.insert(table, log);
      var result =  mysql.dbExecute(sql);
      return result;
    },
    //dayString yyyyMMdd
    getLogs: function(ids, dayString) {
      var yyyy = dayString.substr(0, 4);
      var MM = parseInt(dayString.substr(4,2), 10) - 1;
      var dd = dayString.substr(6,2);
      var table = 'logs_' + new Date(yyyy, MM, dd).getDay();
      var sql = [
        'SELECT l.*, e.`ip`, cs.`name`',
        ' FROM `' + table + '` l, `equipments` e, `check_servers` cs WHERE ',
        'cs.`id` = l.`csid`',
        'AND e.`id` = l.`eid`',
        'AND l.`id` IN',
        '( ' + ids.join(', ') + ' )'
      ].join(' ');
      return mysql.dbQuery(sql);
    },
  };
};
