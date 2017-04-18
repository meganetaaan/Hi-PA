
  var speechRecognitionController = {
    __name: 'SpeechRecognitionController',
    recognition: speechRecognition,

    //initializer
    __ready: function(context){
      this.recognition.initialize();
      this.recognition.setOnStart(()=>{this._recognition_start();});
      this.recognition.setOnError((event)=>{this._recognition_error(event);});
      this.recognition.setOnResult((event)=>{this._recognition_result(event);});
      this.recognition.setOnEnd(()=>{this._recognition_stop();});
    },

    //_recognition event handlers
    _recognition_start: function() {
      console.log('onstart function');
      this.showInfo('info_speak_now');
      $('#start_button').hide();
      $('#end_button').show();
    },
    _recognition_error: function(event) {
      if(event.error == 'no-speech'){
        this.showInfo('info_no_speech');
        this.recognition.setIgnoreOnend(true);
      }else if(event.error == 'audio-capture'){
        this.showInfo('info_no_microphone');
        this.recognition.setIgnoreOnend(true);
      }else if(event.error == 'not-allowed'){
        this.showInfo('info_denied');
        this.recognition.setIgnoreOnend(true);
      }
    },
    _recognition_stop: function(){
      console.log('_recognition_stop called');
      this.recognition.setRecognizing(false);
      if(this.recognition.getIgnoreOnend()){
        return;
      }else if(!this.recognition.getFinalTranscript()){
        this.showInfo('info_start');
        return;
      }else{
        this.showInfo('');
        $('#end_button').hide();
        $('#start_button').show();
      }
    },
    _recognition_result: function(event){
      var result = this.recognition.getResult(event);
      $('#final_span').html(result.final_span);
      $('#interim_span').html(result.interim_span);
    },

    // button click handler
    '#start_button click': function(){
      if (this.recognition.getRecognizing()) {
        console.log('You are recording. Somethin is wrong!');
        return;
      }
      this.recognition.start();
      $('#final_span').html('');
      $('#interim_span').html('');
      this.showInfo('info_allow');
    },
    '#end_button click': function(){
      if (!this.recognition.getRecognizing()){
        console.log("You are not recording. Something is wrong!");
        return;
      }
      this.recognition.stop();
    },
    '#debug_button click': function(){
      console.log(this.recognition.getRecognizing());
    },

    // helper
    showInfo: function(s) {
      if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
          if (child.style) {
            child.style.display = child.id == s ? 'inline' : 'none';
          }
        }
        info.style.visibility = 'visible';
      } else {
        info.style.visibility = 'hidden';
      }
    }
    // finish speechRecognizionController
  }

