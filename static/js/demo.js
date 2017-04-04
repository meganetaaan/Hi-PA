window.___gcfg = { lang: 'en' };
(function() {
  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var start_button = $('#start_button');
$('#start_button').show();;
$('#end_button').hide();
$('#start_button').click(startButton);
$('#end_button').click(endButton);

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
  recognizing = true;
  showInfo('info_speak_now');
};
recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    showInfo('info_no_speech');
    ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    showInfo('info_no_microphone');
    ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    if (event.timeStamp - start_timestamp < 100) {
      showInfo('info_blocked');
    } else {
      showInfo('info_denied');
    }
    ignore_onend = true;
  }
}
recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (!final_transcript) {
    showInfo('info_start');
    return;
  }
  showInfo('');
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(document.getElementById('final_span'));
    window.getSelection().addRange(range);
  }
  if (create_email) {
    create_email = false;
    createEmail();
  }
};
recognition.onresult = function(event) {
  var interim_transcript = '';
  if (typeof(event.results) == 'undefined') {
    recognition.onend = null;
    recognition.stop();
    upgrade();
    return;
  }
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
  if (final_transcript || interim_transcript) {
    showButtons('inline-block');
  }
};

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  copy_button.style.display = 'none';
  copy_info.style.display = 'inline-block';
  showInfo('');
}


function startButton() {
  if (recognizing) {
    console.log('You are recording. Somethin is wrong!');
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-GB';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showInfo('info_allow');
  showButtons('none');
  $('#start_button').hide();
  $('#end_button').show();
  start_timestamp = 0; //event.timeStamp;
}

function endButton() {
  if (!recognizing){
    console.log("You are not recording. Something is wrong!");
    return;
  }
  recognition.stop();
  $('#end_button').hide();
  $('#start_button').show();
}

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

var current_style;
function showButtons(style) {
  if (style == current_style) {
    return;
  }
  current_style = style;
}


