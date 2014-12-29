var checkServers = [];
module.exports = function(l) {
  mysql = l.getMysql();
  dateUtil = l.getDateUtil();
  return {
    //根据cs的名字获取cs， 获取成功则更新cs到达的时间
    getCheckServer: function(cs) {
      var checkServer = checkServers[cs];
      //如果checkServer 已经加载到内存并且状态为开启，则返回如果checkServer
      if (checkServer &&  checkServer['static'] == 1) {
        checkServers[cs]['arrive_time']  = dateUtil.getSecondTime();
        return checkServer;
      }
      //重新获取checkServer
      var sql = mysql.sqlString.format('SELECT * FROM `check_servers` WHERE `name` = ? AND `static` = 1',[cs]);
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        checkServers[cs] = checkServer = result[0];
        checkServers[cs]['arrive_time']  = dateUtil.getSecondTime();
        return checkServer;
      } else {
        return false;
      }
    },
    //将内存里面的cs更新到数据库中
    resetCheckServer: function() {
      //更新数据到数据库
      var key;
      for (key in checkServers) {
        checkServer = checkServers[key];
        if (checkServer['static'] === 0) { continue ;}
        var sql = mysql.sqlString.format('UPDATE `check_servers` SET `arrive_time` = ?  WHERE `id` = ?',[checkServer['arrive_time'], checkServer['id']]);
        checkServer['static'] = 0 ;
        mysql.dbExecute(sql);
      }
    },
  };
};
