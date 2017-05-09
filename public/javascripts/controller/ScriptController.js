
var scriptController = {
  __name: 'hipa.controller.ScriptController',
  __templates: ['public/views/script.ejs'],

  recognition: speechRecognition,
  socket: io('/socket/presente'),
  // for mouth recognition
  __vid: null,
  __overlay: null,
  __overlayCC: null,
  __ctrack: null,
  __stats: null,
  __pause: true,
  __is_presenter: config.isPresenter,
  __pre_start_slide_num: [-1,0,0],
  __pre_end_slide_num: [-1,0,0],
  __start_slide_num: [-1,0,0],
  __end_slide_num: [-1,0,0],
  __stopwords: null,

  //initializer
  __construct: function() {
    if(!this.__is_presenter) {
      this.socket.on('ADD_SCRIPT', (data) => {
        this._handle_scripts(data);
      });
    }
  },
  __init: function(context){
    this.view.update('#script-subcontainer', 'script', null);
    if (this.__is_presenter) {
      this.__ready_presenter();
    } else {
      this.__ready_audience();
    }
  },

  __ready_audience: function(){
    var txtFile = "public/javascripts/stopWords.json";
    jQuery.get(txtFile, undefined, (data)=>{
      var stopwords = JSON.parse(data);
      this.__stopwords = stopwords;
    }, "html").done(function() {
    }).fail(function(jqXHR, textStatus) {
    }).always(function() {
    });

    this._get_past_script();
  },

  __ready_presenter: function(){
    // speech recognition api
    this.recognition.initialize();
    this.recognition.setEventHandlers(
        (event)=>{this._recognition_error(event);},
        (event)=>{this._recognition_result(event);}
        );

    // face recognition api
    this.__vid = document.getElementById('videoel');
    this.__overlay = document.getElementById('overlay');
    this.__overlayCC = this.__overlay.getContext('2d');

    this.__ctrack = new clm.tracker({useWebGL : true});
    this.__ctrack.init(pModel);

    this.__stats = new Stats();
    this.__stats.domElement.style.position = 'absolute';
    this.__stats.domElement.style.top = '0px';
    document.getElementById('container-face').appendChild( this.__stats.domElement );

    this.__vid.addEventListener('canplay', this._enablestart, false);

    var insertAltVideo = function(video) {
      path_to_media = "public/lib/clmtrackr/media/";
      if (supports_video()) {
        if (supports_ogg_theora_video()) {
          video.src = path_to_media + "cap12_edit.ogv";
        } else if (supports_h264_baseline_video()) {
          video.src = path_to_media + "cap12_edit.mp4";
        } else {
          return false;
        }
        return true;
      } else {
        return false;
      }
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
    var vid = this.__vid;

    // check for camerasupport
    if (navigator.getUserMedia) {
      // set up stream

      var videoSelector = {video : true};
      if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
        var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
        if (chromeVersion < 20) {
          videoSelector = "video";
        }
      };

      navigator.getUserMedia(videoSelector, function( stream ) {
        if (vid.mozCaptureStream) {
          vid.mozSrcObject = stream;
        } else {
          vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        vid.play();
      }, function() {
        insertAltVideo(vid);
        document.getElementById('gum').className = "hide";
        document.getElementById('nogum').className = "nohide";
        alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
      });

    } else {
      insertAltVideo(vid);
      document.getElementById('gum').className = "hide";
      document.getElementById('nogum').className = "nohide";
      alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
    }
    document.addEventListener('clmtrackrIteration', this.__stats.update, false);
  },

  //_recognition event handlers
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
  _recognition_result: function(event){
    var script = this.recognition.getResult(event);
    if (script.final_span === "" && script.interim_span !== "") {
      this.__start_slide_num = this._get_current_slide_num();
    } else if (script.final_span !== "") {
      this.__end_slide_num = this._get_current_slide_num();
    }
    script = $.extend(script, {'start_slide':this.__start_slide_num, 'end_slide':this.__end_slide_num});
    this._display_script(script);
    if (script.final_span !== "")
      this._broadcast_script(script);;
  },

  _get_past_script: function(){
    return h5.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: config.url + '/script'
    }).then((data) => {
      this._handle_scripts(data);
    });
  },

  _broadcast_script: function(script){
    var data = {
      'startSlide': script.start_slide,
      'endSlide': script.end_slide,
      'text': script.final_span
    };
    console.log(data);
    this.socket.emit('ADD_SCRIPT', data);
  },

  _handle_script: function(scripts){
    for (var i=0; i<scripts.length; i++) {
      var script = scripts[i];
      this._display_script({
        'start_slide': script.startSlide,
        'end_slide': script.endSlide,
        'final_span': script.text,
        'interim_span': ''
      });
    }
  },

  _display_script: function(script){
    var final_span = script.final_span;
    var slide = script.start_slide[0];
    if (script.start_slide[0] !== script.end_slide[0]) {
      slide += "~" + script.end_slide;
    }
    if (!this.__is_presenter) {
      var spans = final_span.split(" ");
      sinal_span = "";
      for (var i=0; i<spans.length; i++) {
        var span = spans[i];
        if (span in this.__stopwords) {
          final_span += span + " ";
        } else {
          final_span += "<span>" + span + "</span>";
        }
      }
    }
    if (final_span !== '') {
      if (this.__pre_start_slide_num[0]===this.__start_slide_num[0] && this.__pre_end_slide_num[0]===this.__end_slide_num[0]) {
        document.getElementById('final_span').innerHTML += script.final_span;
      } else {
        document.getElementById('final_span').innerHTML += "<br />" + "slide " + slide + ": " + script.final_span;
        this.__pre_start_slide_num = this.__start_slide_num;
        this.__pre_end_slide_num = this.__end_slide_num;
      }
    }
    document.getElementById('interim_span').innerHTML = "<em>" + script.interim_span + "</em>";
  },

  // button click handler
  '#start_button click': function(){
    if (this.recognition.getRecognizing()) {
      console.log('You are recording. Somethin is wrong!');
      return;
    }
    this._startVideo();
    this.recognition.start();
    this.recognition.setRecognizing(true);
    $('#final_span').html('');
    $('#interim_span').html('');
    this.showInfo('info_speak_now');
  },
  '#stop_button click': function(){
    if (!this.recognition.getRecognizing()){
      console.log("You are not recording. Something is wrong!");
      return;
    }
    this._stopVideo();
    this.recognition.stop();
    this.recognition.setRecognizing(false);
    this.showInfo('info_start');
  },
  _get_current_slide_num: function(){
    return [0,0,0];
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
  },

  _enablestart: function(s) {
    var startbutton = document.getElementById('start_button');
    startbutton.innerHTML = "START";
    startbutton.disabled = false;
    startbutton.onclick = this._startVideo;
    var stopbutton = document.getElementById('stop_button');
    stopbutton.innerHTML = "STOP";
    stopbutton.onclick = this._stopVideo;
  },

  _startVideo: function(s) {
    $('#start_button').prop('disabled', true);
    $('#stop_button').prop('disabled', false);
    // start video
    this.__vid.play();
    // start tracking
    this.__ctrack.start(this.__vid);
    this.__pause = false;
    // start loop to write positions
    this._positionLoop();
    // start loop to draw face
    this._drawLoop();
  },

  _stopVideo: function(){
    $('#start_button').prop('disabled', false);
    $('#stop_button').prop('disabled', true);
    this.__vid.pause();
    this.__ctrack.stop();
    this.__pause = true;
  },

  _positionLoop: function() {
    if (this.__pause)
      return;
    requestAnimationFrame(this._positionLoop.bind(this));
    var positions = this.__ctrack.getCurrentPosition();
    var positionString;
    if (positions) {
      for (var p = 44; p < 62; p++) {
        positionString += "featurepoint "+ p + " :";
        positionString += "[" + positions[p][0].toFixed(1) + "," + positions[p][1].toFixed(1) + "] ";
      }
      var gap = positions[57][1]-positions[60][1];
      var speakInfoString = (gap>4)? "Mouth Open" : "Mouth Close";
      this.recognition.setMouthOpen(gap>4);
      document.getElementById("mouth-info").innerHTML = "Gap " + gap.toFixed(2) + ": " + speakInfoString;
    }
  },

  _drawLoop: function() {
    if (this.__pause)
      return;
    requestAnimationFrame(this._drawLoop.bind(this));
    this.__overlayCC.clearRect(0, 0, 400, 300);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (this.__ctrack.getCurrentPosition()) {
      this.__ctrack.draw(this.__overlay);
    }
  }

  // finish speechRecognizionController
};
h5.core.expose(scriptController);





