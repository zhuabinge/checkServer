var lib = require("../../lib");
var equipments = [];
var date = lib.getDateUtil();
setInterval(function () {
  equipments = [];
}, 1000 * 10);
module.exports = function(l) {
  var mysql = l.getMysql();
  var sqlString = mysql.sqlString;
  var model =  {
    getEquipment: function(mask) {
      if (equipments[mask]) {
        return equipments[mask];
      }
      var sql = sqlString.format('SELECT * FROM `equipments` WHERE `md5` = ?',[mask]);
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        equipments[mask] = result[0];
        return equipments[mask];
      } else {
        return false;
      }
    },
    getEquipments: function(condition, currentpage, size) {
      if (!condition) {
        condition = {};
      }
      var offset = (currentpage - 1) * size;
      var sql = [
        'SELECT * FROM `equipments` WHERE 1=1',
        sqlString.objectToValues(condition),
        'ORDER BY `static` DESC, `updated` DESC',
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
    getEquipmentsCount: function(condition) {
      if (!condition) {
        condition = {};
      }
      var sql = [
        'SELECT COUNT(*) AS `count` FROM `equipments` WHERE 1=1',
        sqlString.objectToValues(condition),
      ].join(' ');
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        return result[0].count;
      }
      return 0;
    },
    updateSalt:function(id, ip, salt){
      var sql = 'UPDATE `equipments` SET `salt`= "?" ,`md5`= MD5("?") ,`updated`= ? WHERE `id`= ?';
      sql = sqlString.format(sql, [salt, ip + ':' + salt, parseInt(date.getCurrentDate(),10), id]);
      var result = mysql.dbExecute(sql);
      return result.affectedRows;
    },
    setStatus:function(id,status){
      var sql = 'UPDATE `equipments` SET `static`= ? ,`updated`= ? WHERE `id`= ?';
      sql = sqlString.format(sql, [status, parseInt(date.getCurrentDate(),10), id]);
      var result = mysql.dbExecute(sql);
      return result.affectedRows;
    }
  };
  return model;
};
