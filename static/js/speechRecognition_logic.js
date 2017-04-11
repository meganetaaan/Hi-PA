var speechRecognition = {
    __name: 'SpeechRecognition',
    __final_transcript: '',
    __recognizing: false,
    __ignore_onend: false,
    __recognition: new webkitSpeechRecognition(),

    // initializer
    initialize: function(){
      this.__recognition.continuous = true;
      this.__recognition.interimResults = true;
    },
    // init setting when restart recognizing
    start: function(){
      this.__final_transcript = '';
      this.__recognition.lang = 'en-US';
      this.__ignore_onend = false;
      this.__recognizing = true;
      this.__recognition.start();
    },
    stop: function(){
      this.__recognition.stop();
    },
    setOnStart: function(start_function){
      this.__recognition.onstart = function(){start_function()};
    },
    setOnError: function(error_function){
      this.__recognition.onerror = function(e){error_function(e)};
    },
    setOnEnd: function(end_function){
      this.__recognition.onend = function(){end_function()};
    },
    setOnResult: function(result_function){
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
    getFinalTranscript: function(){
      return this.__final_transcript;
    },
    // get transcript from event
    getResult: function(event){
      var final_transcript = this.__final_transcript;
      var interim_transcript = '';
      var add_final = false;
      if (typeof(event.results) == 'undefined') {
        final_transcript += one_line;
        return state;
      }
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
      this.__final_transcript = final_transcript;
      return {
        'final_span': this._linebreak(final_transcript),
        'interim_span': this._linebreak(interim_transcript)
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



