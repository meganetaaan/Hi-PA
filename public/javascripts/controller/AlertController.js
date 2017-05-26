var alertController = {
  __name: 'hipa.controller.AlertController',
  socket: null,
  __construct: function(){
    socket = io('/socket/alert/presenter');
    socket.on('Alert', (data) => {this._handle_data(data);});
  },


  // this function handles question and tooltip
  handle_question_data: function(data) {
    console.log(data);
    var content;
    if ('question' in data) {
      content = "There is a question: " + data['question'];
    } else if ('tooltip' in data) {
      content = "Many audiences are curious about the meaning of "+data['tooltip'];
    }
    this._alert(content);
  },


  // this function handles realtimefeedback and time
  _handle_data: function(data) {
    console.log(data);
    if (data['timeAlert']) {
      this._alert(this._get_alert_content('time', -data['time']));
    }
    var rf = data['realtimefeedback'];
    for (key in rf) {
      this._alert(this._get_alert_content(key, rf[key]));
    }

  },

  _alert: function(content) {
    console.log(content);
  },

  _get_alert_content: function(type, value){
    if (type == "noquestion")
      return "There is no question. Everyone, you can ask more and more.";
    if (type == "question")
      return "Since we are out of time, let's go to the next slide.";
    if (type == 'time')
      return "You have " + value + " minute remaining."
    var state;
    if (type == 'volume') {
      if(value == 1) state = 'loud';
      else state = 'quiet';
    } else {
      if (value == 1) state = 'fast';
      else state = 'slow';
    }
    return "Presentation is too " + state + ".";
  }
};

h5.core.expose(alertController);
