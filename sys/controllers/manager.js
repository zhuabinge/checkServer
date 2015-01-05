module.exports = function(lib) {
  var mamodel = lib.getModel("manager");
  return {
    index: function(req, res) {
      var view = this.view;
      view.display('manager/index.ejs', res);
    },
    get: function(req, res){
      var query = this.query;
      var size = 10;
      var view = this.view;
      var searchValue;
      if(query.page == null ){
        searchValue = req.body;
      }
      else{
        searchValue = {name: query.name};
      }

      var count = mamodel.getManagerCount(searchValue);  
      var totalpage;
      if(count % 10 > 0){
        totalpage = parseInt(count / 10) + 1;
      }
      else{
        totalpage = parseInt(count / 10);
      }

      var page = isNaN(parseInt(query.page, 10)) || parseInt(query.page, 10) > totalpage? 1 : query.page;
      var manager = mamodel.getManager(searchValue, page, size);

      view.assign('manager', manager);
      view.assign('currentpage', page);
      view.assign('totalpage',totalpage);
      view.display('manager/data.ejs', res);
    },
    update: function(req, res){
      var query = req.body;
      var result = mamodel.updateDuty(query);
      res.send({ result: result });
    }
  };
};
