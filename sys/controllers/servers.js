module.exports = function(l) {
  return {
    index: function(req, res) {
      var view = this.view;
      view.display('index2.ejs', res);
    },
    ping: function(req, res) {
      var view = this.view;
      view.display('index2.ejs', res);
    },
    http: function(req, res) {
      var view = this.view;
      view.display('index2.ejs', res);
    },
  };
};
