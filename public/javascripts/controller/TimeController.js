var timeController = {
  __name: 'TimeController',
  socket: null,
  time: time,
  __construct: function(){
    socket = io('/socket/time');
  },
  __ready: function(context){
    console.log("TIMECONTROLLER");
    this._update();
  },
  '#date_button click': function(context, $button){
    this._update();
  },
  _update: function(){
    var current = this.time.getCurrent(new Date());
    console.log(current);
  },
  '#start_button click': function() {
    this._emit_state('STARTED');
  },
  '#pause_button click': function() {
    this._emit_state('PAUSED');
  },
  '#stop_button click': function() {
    this._emit_state('END');
  },
  _emit_state: function(state) {
    socket.emit('SetTimeState', {'state': state});
  }
  // get api/time/state??
};

h5.core.expose(timeController);
