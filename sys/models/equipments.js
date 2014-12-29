var equipments = [];
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
    getEquipments: function(condition, page, size) {
      if (!condition) {
        condition = {};
      }
      page = isNaN(parseInt(page, 10)) ? 1 : page;
      size = isNaN(parseInt(size, 10)) ? 5 : size;
      var offset = (page - 1) * size;
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
        'SELECT COUNT(0) AS `count` FROM `equipments` WHERE 1=1',
        sqlString.objectToValues(condition),
      ].join(' ');
      var result = mysql.dbQuery(sql);
      if (result[0]) {
        return result[0].count;
      }
      return 0;
    }
  };
  return model;
};
