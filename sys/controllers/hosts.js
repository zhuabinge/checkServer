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
      var count = eqmodel.getEquipmentsCount({});
      var totalpage;
      if(count%10 > 0){
        //console.log(Math.round(count/10)+1);
        totalpage = parseInt(count/10)+1;
      }
      else{
        //console.log(Math.round(count/10));
        totalpage = parseInt(count/10);
      }
      console.log(parseInt(query.page, 10));
      var page = isNaN(parseInt(query.page, 10)) || parseInt(query.page, 10) > totalpage? 1 : query.page;
      equipments = eqmodel.getEquipments({
      }, page, size);

      view.assign('equipments', equipments);
      view.assign('currentpage', page);
      view.assign('totalpage',totalpage);
      view.display('hosts/data.ejs', res);
    }
  };
};
