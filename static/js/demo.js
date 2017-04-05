window.___gcfg = { lang: 'en' };
(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

var state = {
  'final_transcript': '',
  'recognizing': false,
  'ignore_onend': false,
  'start_timestamp': 0
};
$('#start_button').show();;
$('#end_button').hide();

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
  state = recognition_start(state);
};
recognition.onerror = function(event) {
  console.log(event);
  state = recognition_error(event, state);
}
recognition.onend = function() {
  state = recognition_stop(state);
};
recognition.onresult = function(event) {
  state = recognition_result(event, state);
};

$('#start_button').click(function(){
  if (state.recognizing) {
    console.log('You are recording. Somethin is wrong!');
    return;
  }
  state.final_transcript = '';
  recognition.lang = 'en-GB';
  recognition.start();
  state.ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showInfo('info_allow');
});

$('#end_button').click(function(){
  if (!state.recognizing){
    console.log("You are not recording. Something is wrong!");
    return;
  }
  recognition.stop();
});

function showInfo(s) {
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



