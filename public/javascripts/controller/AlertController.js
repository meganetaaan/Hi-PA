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
    console.log(data);
    if (data['timeAlert']) {
      this._alert(this._get_alert_content('time', -data['time']));
    }
    var rf = data['realtimefeedback'];
    for (key in rf) {
      if (rf[key]!==0) this._alert(this._get_alert_content(key, rf[key]));
    }
  },

  _queue: [],
  _isAlerting: false,
  _alertMsg : null,

  _alert: function(content) {
    console.log(content);
    this._queue.push(content);
    if (!this._isAlerting) {
      this._alertQueuePop();
    }
  },

  _alertQueuePop: function() {
    this._isAlerting = true;
    let content = this._queue.shift();
    if (content === null) {
      return;
    }
    this._append_html(content);
    var msg = new SpeechSynthesisUtterance(content);
    // This is for browser GC bug.
    // link : https://stackoverflow.com/a/35935851
    this._alertMsg = msg;
    window.speechSynthesis.speak(msg);
    msg.onend = (event) => {
      if (this._queue.length !== 0) {
        this._alertQueuePop();
      } else {
        this._isAlerting = false;
      }
    }
  },

  _append_html: function(content) {
    let talkingBalloonDiv = '<div class="talk-bubble" style="display:none;"><div class="talktext"><p>' + content + '</p></div></div>'
    let $tmp = $(talkingBalloonDiv).appendTo('#talkingballoon-container');
    $tmp.show(1000);
    setTimeout(function() {
      $tmp.hide(1000);
    }, 5000);

  },

  _get_alert_content: function(type, value){
    if (type === 'time')
      return "Lack of time! You have " + Math.floor(value) + " seconds remaining."
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
