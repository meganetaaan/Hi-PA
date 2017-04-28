
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
    
    __vid.addEventListener('canplay', _enablestart, false);
   
    var insertAltVideo = function(video) {
      if (supports_video()) {
        if (supports_ogg_theora_video()) {
          video.src = "../static/media/cap12_edit.ogv";
        } else if (supports_h264_baseline_video()) {
          video.src = "../static/media/cap12_edit.mp4";
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
          this.__vid.mozSrcObject = stream;
        } else {
          this.__vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        this.__vid.play();
      }, function() {
        insertAltVideo(this.__vid);
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
    document.addEventListener('clmtrackrIteration', function(event) {
      __stats.update();
    }, false);
    
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
    this._startVideo();
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
    this._stopVideo();
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
  
  
  _enablestart(): function(s) {
    var startbutton = document.getElementById('startbutton');
    startbutton.value = "start";
    startbutton.disabled = false;
    startbutton.onclick = this._startVideo;
    var stopbutton = document.getElementById('stopbutton');
    stopbutton.value = "stop";
    stopbutton.onclick = this._stopVideo;
  }
  

  function _startVideo() {
    document.getElementById('startbutton').disabled = true;
    document.getElementById('stopbutton').disabled = false;
    // start video
    this.__vid.play();
    // start tracking
    this.__ctrack.start(vid);
    this.__pause = false;
    // start loop to write positions
    this.__positionLoop();
    // start loop to draw face
    this.__drawLoop();
  }

  function _stopVideo(){
    document.getElementById('startbutton').disabled = false;
    document.getElementById('stopbutton').disabled = true;
    this.__vid.pause();
    this.__ctrack.stop();
    this.__pause = true;
  }

  function _positionLoop() {
    if (this.__pause)
      return;
    requestAnimationFrame(this._positionLoop);
    var positions = this.__ctrack.getCurrentPosition();
    var positionString;
    if (positions) {
      for (var p = 44; p < 62; p++) {
        positionString += "featurepoint "+ p + " :";
        positionString += "[" + positions[p][0].toFixed(2) + "," + positions[p][1].toFixed(2) + "]";
        console.log(positionString);
      }
      var gap = positions[57][1]-positions[60][1];
      var speakInfoString = (gap>4)? "Mouth Open" : "Mouth Close";
      document.getElementById("mouth-info").innerHTML = "Gap " + gap.toFixed(2) + ": " + speakInfoString;
    }
   }

  function _drawLoop() {
    if (pause)
      return;
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, 400, 300);
    //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
    if (ctrack.getCurrentPosition()) {
      ctrack.draw(overlay);
    }
  }
  
  // finish speechRecognizionController
}


//////////////////////////////////////////////////////





