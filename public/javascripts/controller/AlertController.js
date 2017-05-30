var alertController = {
  __name: 'hipa.controller.AlertController',
  questionDataModel: 'hipa.data.questionDataModel',
  socket: null,
  alarm_queue: [],
  __construct: function(){
    socket = io('/socket/alert/presenter');
    socket.on('Alert', (data) => {this._handle_data(data);});
  },


  // this function handles question and tooltip
  handle_question_data: function(data) {
    var content;
    if (data['remainingTime'] < 60) {
      content = "Since we are out of time, let's go to the next slide";
    }
    else if (data['questionID']) {
      var qid = data['questionID'];
      content = "There is a question!";
      content += " id: " + qid;
      content += " question: " + questionDataModel.get(qid);
    } else if (data['tooltip'] !== null) {
      content = "Many audiences are curious about the meaning of "+data['tooltip'];
    } else {
      content = "There is no question. Everyone, you can ask more and more.";
    }
    this._alert(content);
  },


  // this function handles realtimefeedback and time
  _handle_data: function(data) {
    if (data['timeAlert'] !== null) {
      this._alert(this._get_alert_content('time', -data['time']));
    }
    var rf = data['realtimefeedback'];
    for (key in rf) {
      if (rf[key]!==0) this._alert(this._get_alert_content(key, rf[key]));
    }
  },

  _alert: function(content) {
    console.log(content);
    var msg = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(msg);
    console.log('end');
  },

  _get_alert_content: function(type, value){
    if (type === 'time')
      return "You have " + Math.floor(value) + " minute remaining."
    var state;
    if (type === 'volume') {
      if(value === 1) state = 'loud';
      else state = 'quiet';
    } else {
      if (value === 1) state = 'fast';
      else state = 'slow';
    }
    return "Presentation is too " + state + ".";
  }
};

h5.core.expose(alertController);
