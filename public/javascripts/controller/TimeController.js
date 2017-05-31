var timeController = {
  __name: 'hipa.controller.TimeController',
  socket: null,
  time: hipa.logic.Time,
  _count_time: null,
  _status: 'END',
  __construct: function(){
    this.time = hipa.logic.Time;
    this.socket = io(config.url + '/time');
  },
  __ready: function(context){
    return h5.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: config.url + '/time/state'
    }).then((data) => {
      this.time.set(data['duration'], data['passedTime']);
    }).fail((error) => {
      console.log(error);
    });
  },
  '#start_button click': function() {
    this._emit_state('STARTED');
    this._count_time = setInterval(function(){
      var time_info = this.time.update();
      $('#time_info').html(time_info);
    }, 1000);
  },
  '#pause_button click': function() {
    this._emit_state('PAUSED');
    clearInterval(this._count_time);
  },
  '#stop_button click': function() {
    this._emit_state('END');
    this.time.init();
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
