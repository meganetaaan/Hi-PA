var speechRecognition = {
    __name: 'SpeechRecognition',
    __recognizing: false,
    __ignore_onend: false,
    __recognition: new webkitSpeechRecognition(),
    __mouth_open: false,

    // initializer
    initialize: function(){
      this.__recognition.continuous = true;
      this.__recognition.interimResults = true;
      this.__recognition.lang = 'en-US';
    },
    // init setting when restart recognizing
    start: function(){
      this.__ignore_onend = false;
      this.__recognition.start();
    },
    stop: function(){
      this.__recognition.stop();
    },
    setEventHandlers: function(error_function, result_function){
      this.__recognition.onstart = function(){};
      this.__recognition.onerror = function(e){error_function(e)};
      this.__recognition.onend = function(){if (this.__recognition) this.start();};
      this.__recognition.onresult = function(e){result_function(e)};
    },
    // set&get methods
    setRecognizing: function(recognizing){
      this.__recognizing = recognizing;
    },
    getRecognizing: function(){
      return this.__recognizing;
    },
    setIgnoreOnend: function(ignore_onend){
      this.__ignore_onend = ignore_onend
    },
    getIgnoreOnend: function(){
      return this.__ignore_onend;
    },
    setMouthOpen: function(mouth_open){
      this.__mouth_open = mouth_open;
    },
    // get transcript from event
    getResult: function(event){
      var final_transcript = '';
      var interim_transcript = '';
      var add_final = false;
      if (typeof(event.results) == 'undefined') {
        final_transcript += one_line;
      } else if (this.__mouth_open) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          var result = event.results[i];
          if (result.isFinal) {
            if (add_final){
              final_transcript += result[0].transcript;
            }else{
              add_final = true;
              final_transcript += this._capitalize(result[0].transcript);
            }
          } else {
            interim_transcript += result[0].transcript;
          }
        }
        if (add_final)
          final_transcript = this._capitalize(final_transcript) + '.';

        final_transcript = this._linebreak(final_transcript);
        interim_transcript = this._linebreak(interim_transcript);

      }
      return {
        'final_span': final_transcript,
        'interim_span': interim_transcript
      };
    },

    // helper functions
    _linebreak: function(s){
      var two_line = /\n\n/g;
      var one_line = /\n/g;
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    },
    _capitalize: function(s){
      var first_char = /\S/;
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
}



