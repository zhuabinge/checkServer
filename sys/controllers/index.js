module.exports = function(l) {
  return {
    index: function(req, res) {
      var view = this.view;
      view.display('index2.ejs', res);
    }
  };
};
