
var speechRecognitionController = {
  __name: 'SpeechRecognitionController',
  recognition: speechRecognition,
  // for mouth recognition
  __vid: null,
  __overlay: null,
  __overlayCC: null,
  __ctrack: null,
  __stats: null,
  __pause: true,

  //initializer
  __ready: function(context){
    // speech recognition api
    this.recognition.initialize();
    this.recognition.setOnStart(()=>{this._recognition_start();});
    this.recognition.setOnError((event)=>{this._recognition_error(event);});
    this.recognition.setOnResult((event)=>{this._recognition_result(event);});
    this.recognition.setOnEnd(()=>{this._recognition_stop();});

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
      path_to_media = "../static/js/clmtrackr/media/"; //"../clmtrackr/media/";
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
        if (this.__vid.mozCaptureStream) {
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
  _recognition_start: function() {
    this.showInfo('info_speak_now');
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
    this.recognition.setRecognizing(false);
    if(this.recognition.getIgnoreOnend()){
      return;
    }else if(!this.recognition.getFinalTranscript()){
      this.showInfo('info_start');
      return;
    }else{
      this.showInfo('');
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
    this._startVideo();
    this.recognition.start();
    $('#final_span').html('');
    $('#interim_span').html('');
    this.showInfo('info_allow');
  },
  '#stop_button click': function(){
    if (!this.recognition.getRecognizing()){
      console.log("You are not recording. Something is wrong!");
      return;
    }
    this._stopVideo();
    this.recognition.stop();
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
        console.log(positionString);
      }
      var gap = positions[57][1]-positions[60][1];
      var speakInfoString = (gap>4)? "Mouth Open" : "Mouth Close";
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
}







