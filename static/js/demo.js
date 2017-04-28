var vid = document.getElementById('videoel');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild( stats.domElement );

function enablestart() {
	var startbutton = document.getElementById('startbutton');
	startbutton.value = "start";
	startbutton.disabled = false;
  startbutton.onclick = startVideo;
  var stopbutton = document.getElementById('stopbutton');
  stopbutton.value = "stop";
  stopbutton.onclick = stopVideo;
}

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

vid.addEventListener('canplay', enablestart, false);
var pause;

function startVideo() {
  document.getElementById('startbutton').disabled = true;
  document.getElementById('stopbutton').disabled = false;
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
  pause = false;
  // start loop to write positions
  positionLoop();
	// start loop to draw face
	drawLoop();
}

function stopVideo(){
  document.getElementById('startbutton').disabled = false;
  document.getElementById('stopbutton').disabled = true;
  vid.pause();
  ctrack.stop();
  pause = true;
}

function positionLoop() {
  if (pause)
    return;
  requestAnimationFrame(positionLoop);
  var positions = ctrack.getCurrentPosition();
  var positionString = "";
  if (positions) {
    console.log("length of positions: ", positions.length);
    for (var p = 0; p < 20; p++) {
      positionString += "featurepoint "+ p + " :";
      positionString += "[" + positions[p][0].toFixed(2) + "," + positions[p][1].toFixed(2) + "]<br/>";
    }
    document.getElementById("positions").innerHTML = positionString;
  }

}

function drawLoop() {
  if (pause)
    return;
	requestAnimFrame(drawLoop);
	overlayCC.clearRect(0, 0, 400, 300);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	if (ctrack.getCurrentPosition()) {
		ctrack.draw(overlay);
	}
}

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
	stats.update();
}, false);

