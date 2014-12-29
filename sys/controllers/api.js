module.exports = function(lib) {
  ping = require('./api/ping')(lib);
  equipmentModel = lib.getModel('equipments');
  checkServerModel = lib.getModel('checkServers');
  return {
    ping: function(req, res) {
      query = this.query;
      body = '设备未生效';
      var equipment = equipmentModel.getEquipment(query.mask);
      var cs = checkServerModel.getCheckServer(query.cs);
      if (cs && equipment && equipment['static'] != '0') {
        var data = {};
        data.loss  = query.loss === '' ? 0 : query.loss;
        data.cs  = cs;
        data.max = query.max === '' ? 0 : query.max;
        data.min = query.min === '' ? 0 : query.min;
        data.time = query.time === '' ? 0 : query.time;
        data.avg = query.avg === '' ? 0 : query.avg;
        data.equipment = equipment;
        ping.check(data);
        body = query.mask;
      }
      res.end(body);
    }
  };
};
