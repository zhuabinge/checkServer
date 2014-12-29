var lib = require('./index');
mysqlLogger = lib.getLogger('mysql');
configure = lib.config.mysql;
var sqlString = {
  format: function(sql, values) {
    values = [].concat(values);
    return sql.replace(/\?/g, function(match) {
      if (!values.length) {
        return match;
      }
      return sqlString.escape(values.shift(), false);
    });
  },
  insert: function(table, object) {
    var values = [], keys = [], key;
    for (key in object) {
      var value = object[key];
      if(typeof value === 'function') {
        continue;
      }
      keys.push('`' + key + '`');
      values.push(sqlString.escape(value, true));
    }
    return [
      'INSERT INTO `' + table + '`',
      '( ' + keys.join(', ') +  ')',
      'VALUE',
      '( ' + values.join(', ') +' )',
    ].join(' ');
  },
  escape: function(val, stringifyObjects) {
    if (val === undefined || val === null) {
      return 'NULL';
    }
    switch (typeof val) {
      case 'boolean':
        return (val) ? 'true' : 'false';
      case 'number':
        return val + '';
    }
    if (Array.isArray(val)) {
      return sqlString.arrayToList(val);
    }
    if (typeof val === 'object') {
      if (stringifyObjects) {
        val = val.toString();
      } else {
        return sqlString.objectToValues(val);
      }
    }
    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
      switch(s) {
        case "\0": return "\\0";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\b": return "\\b";
        case "\t": return "\\t";
        case "\x1a": return "\\Z";
        default: return "\\"+s;
      }
    });
    return "'" + val + "'";
  },
  arrayToList: function(array) {
    return array.map(function(v) {
      if (Array.isArray(v)) return '(' + sqlString.arrayToList(v) + ')';
      return sqlString.escape(v, true);
    }).join(', ');
  },
  objectToValues: function(object) {
    var values = [], key;
    for (key in object) {
      var value = object[key];
      if(typeof value === 'function') {
        continue;
      }
      values.push('`' + key + '` = ' + sqlString.escape(value, true));
    }
    return values.join(', ');
  }
};

var mysql = require('mysql-libmysqlclient'), db;
try {
  if (configure.name === undefined || configure.name === '') {
  throw '找不到数据库配置';
  }
  db = mysql.createConnectionSync();
  db.connectSync(
  configure.host || '127.0.0.1',
  configure.user || 'root',
  configure.password || '',
  configure.name,
  configure.port || 3306
  );
  if (!db.connectedSync()) {
  throw 'Error: ' + db.connectError;
  }
  db.setCharsetSync(configure.charset || 'UTF8');
} catch (error) {
  mysqlLogger.fatal(error);
  process.exit(1);
}

exports.getMysql = function() {
  return {
    sqlString: sqlString,
    dbQuery: function(sql) {
      try {
        var result = db.querySync(sql), rows;
        if (result) {
          rows = result.fetchAllSync();
          result.freeSync();
          return rows;
        } else {
          throw db.errorSync();
        }
      } catch (error) {
        mysqlLogger.error('Query [' + error + '] SQL [' + sql + ']');
        return false;
      }
    },
    dbExecute: function(sql) {
      try {
        var result = db.querySync(sql), rows;
        if (result) {
          return {
            affectedRows: db.affectedRowsSync(),
            insertId: db.lastInsertIdSync()
          };
        } else {
          throw db.errorSync();
        }
      } catch (error) {
        mysqlLogger.error('Execute [' + error + '] SQL [' + sql + ']');
        return false;
      }
    },
  };
};
