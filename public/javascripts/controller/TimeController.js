var timeController = {
  __name: 'hipa.controller.TimeController',
  socket: null,
  time: time,
  _status: 'END',
  __construct: function(){
    this.socket = io('/socket/time/presenter');
  },
  __ready: function(context){
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
    this._status = state;
    this.socket.emit('SetTimeState', {'state': state});
  },
  get_status: function(){
    return this._status;
  }
  // get api/time/state??
};

h5.core.expose(timeController);
