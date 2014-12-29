module.exports = function(lib) {
  eventsModel = lib.getModel('events');
  LEVEL = lib.LEVEL;
  return {
    errors: function(req, res) {
      var errorEvens =  eventsModel.getPingErrorEvents();
      var sound = 0 ;
      errorEvens.forEach(function(err) {
        if ( err.level >= LEVEL.WARN && sound < 0.1) {
          sound = 0.1;
        }
        if (err.level >= LEVEL.MAJOR && sound < 0.5 ) {
          sound = 0.5;
        }
        if (err.level >= LEVEL.CRITICAL && sound < 1){
          sound = 1;
        }
      });
      view = this.view;
      view.assign('sound', sound);
      view.assign('evens', errorEvens);
      if (this.query.type === 'ajax') {
        res.end(view.display('event/errorEvents.ejs'));
      }  else {
        res.end(view.display('event/index.ejs'));
      }
    },
    closes: function(req, res) {
      var colseEvens =  eventsModel.getPingCloseEvents();
      var sound = 0 ;
      view = this.view;
      view.assign('evens', colseEvens);
      res.end(view.display('event/index.ejs'));
    },
    show: function(req, res) {
      result = eventsModel.getPingEvent(this.query.id);
      if (result === false) {
        res.end('找不到事件');
        return;
      }
      e = result['event'];
      logs = result['logs'];
      view = this.view;
      view.assign('event', e);
      view.assign('logs', logs);
      res.end(view.display('event/showEvent.ejs'));
    },

  };
};
