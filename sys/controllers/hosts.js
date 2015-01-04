module.exports = function(lib) {
  eqmodel = lib.getModel('equipments');
  return {
    index: function(req, res) {
      var view = this.view;
      view.display('hosts/index.ejs', res);
    },
    get: function(req, res) {
      var query = this.query;
      var size = 10;
      var view = this.view;
      var searchValue;
      if(query.page == null ){
        searchValue = req.body;
      }
      else{
        searchValue = {ip: query.ip};
      }
      //console.log(searchValue);

      var count = eqmodel.getEquipmentsCount(searchValue);  
      var totalpage;
      if(count % 10 > 0){
        totalpage = parseInt(count / 10) + 1;
      }
      else{
        totalpage = parseInt(count / 10);
      }

      var page = isNaN(parseInt(query.page, 10)) || parseInt(query.page, 10) > totalpage? 1 : query.page;
      equipments = eqmodel.getEquipments(searchValue, page, size);

      view.assign('equipments', equipments);
      view.assign('currentpage', page);
      view.assign('totalpage',totalpage);
      view.display('hosts/data.ejs', res);
    },
    update: function(req, res) {
      var query = req.body;
      var result = eqmodel.updateSalt(query.id, query.ip, query.salt);
      res.send({ result: result });
    },
    setStatus: function(req, res){
      var query = req.body;
      var result = eqmodel.setStatus(query.id, query.status);
      res.send({ result: result });
    }
  };
};
