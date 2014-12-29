module.exports = function(lib) {
  mysql = lib.getMysql();
  logsModel = lib.getModel('logs');
  return {
    getPingErrorEvents: function() {
      sql = 'SELECT * FROM `events`  WHERE `level` > 0 AND `type` = 1';
      return mysql.dbQuery(sql);
    },
    getPingCloseEvents: function() {
      sql = 'SELECT * FROM `events`  WHERE `level` = 0 AND `type` = 1 ORDER BY `end_time` DESC LIMIT 20';
      return mysql.dbQuery(sql);
    },
    getPingEvent: function(id) {
      var sql = [
        'SELECT ev.*, eq.`ip` ,cs.`name`',
        'FROM `events` ev, `equipments`  eq , `check_servers` cs',
        'WHERE ev.`id` = ? ',
        'AND ev.`type` = 1',
        'AND ev.`eid` = eq.`id`',
        'AND cs.`id` = ev.`csid`',
      ].join(' ');
      sql = mysql.sqlString.format(sql,[id]);
      var result = mysql.dbQuery(sql);
      even = result[0];
      if (!even) {
        return false;
      }
      logs = logsModel.getLogs(JSON.parse(even.logs), even.day);
      return {
        'event': even,
        'logs': logs,
      };
    },
    saveEven: function (even) {
      var sql = [];
      if (even.id) {
        var id = even.id;
        //even存在更新even
        delete even.id;
        sql.push(
          'UPDATE `events` SET',
           mysql.sqlString.objectToValues(even),
          'WHERE `id` = ' + id
        );
        mysql.dbExecute(sql.join(' '));
      } else {
        //插入even
        even.start_time = dateUtil.getSecondTime();
        sql = mysql.sqlString.insert('events', even);
        mysql.dbExecute(sql);
      }
    },
    getErrorEven: function (eid, csid) {
      var sql = 'SELECT * FROM `events` WHERE `eid` = ? AND `csid` = ?  AND `level` > 0';
      sql = mysql.sqlString.format(sql, [eid, csid]);
      evens = mysql.dbQuery(sql);
      return evens[0];
    },
  };
};
