module.exports = function(lib) {
  eqmodel = lib.getModel('equipments');
  return {
    index: function(req, res) {
      var view = this.view;
      view.display('hosts/index.ejs', res);
    },
    get: function(req, res) {
      var query = this.query;
      size = 10;
      var page = isNaN(parseInt(query.page, 10))? 1 : query.page;
      equipments = eqmodel.getEquipments({
      }, page, size);
      count = eqmodel.getEquipmentsCount({});
      var view = this.view;
      view.assign('equipments', equipments);
      view.assign('count', count);
      view.display('hosts/data.ejs', res);
    }
  };
};
