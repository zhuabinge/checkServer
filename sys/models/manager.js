var lib = require("../../lib");
var equipments = [];
setInterval(function () {
  equipments = [];
}, 1000 * 10);
module.exports = function(l) {
  var mysql = l.getMysql();
  var sqlString = mysql.sqlString;
  var model =  {
    getManager: function(condition, currentpage, size) {
      if (!condition) {
        condition = {};
      }
      var offset = (currentpage - 1) * size;
      var sql = [
        'SELECT * FROM `manager` WHERE 1=1',
        sqlString.objectToValues(condition),
        ' order by `role` DESC',
        'LIMIT ?, ?'
      ].join(' ');
      sql = sqlString.format(sql, [offset, size]);
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        return result;
      } else {
        return [];
      }
    },
    getManagerCount: function(condition) {
      if (!condition) {
        condition = {};
      }
      var sql = [
        'SELECT COUNT(*) AS `count` FROM `manager` WHERE 1=1',
        sqlString.objectToValues(condition)
      ].join(' ');
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        return result[0].count;
      }
      return 0;
    },
    updateDuty: function(data){
      var sql = 'UPDATE `manager` SET `name`= "?" ,`email`= "?" ,`role`= ? ,`su`= ? ,`mo`= ? ,`tu`= ? ,`we`= ? ,`th`= ? ,`fr`= ? ,`sa`= ? WHERE `id`= ?';
      sql = sqlString.format(sql, [data.name, data.email, data.role, data.su, data.mo, data.tu, data.we, data.th, data.fr, data.sa, data.id]);
      var result = mysql.dbExecute(sql);
      return result.affectedRows;
    }
  };
  return model;
};
