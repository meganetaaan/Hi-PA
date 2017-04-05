
function recognition_start(state) {
  showInfo('info_speak_now');
  $('#start_button').hide();
  $('#end_button').show();
  state.recognizing = true;
  return state;
};

function recognition_error(event, state) {
  if (event.error == 'no-speech') {
    showInfo('info_no_speech');
    state.ignore_onend = true;
  }
  if (event.error == 'audio-capture') {
    showInfo('info_no_microphone');
    state.ignore_onend = true;
  }
  if (event.error == 'not-allowed') {
    if (event.timeStamp - state.start_timestamp < 100) {
      showInfo('info_blocked');
    } else {
      showInfo('info_denied');
    }
    state.ignore_onend = true;
  }
  return state;
}

function recognition_stop(state) {
  console.log("STOP");
  state.recognizing = false;
  if (state.ignore_onend) {
    return state;
  }
  if (!state.final_transcript) {
    showInfo('info_start');
    return state;
  }
  showInfo('');
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(document.getElementById('final_span'));
    window.getSelection().addRange(range);
  }
  $('#end_button').hide();
  $('#start_button').show();
  return state;
};

function recognition_result(event, state) {
  var final_transcript = state.final_transcript;
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
        final_transcript += capitalize(result[0].transcript);
      }
    } else {
      interim_transcript += result[0].transcript;
    }
  }
  if (add_final)
    final_transcript = capitalize(final_transcript) + '.';
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
  state.final_transcript = final_transcript;
  return state;
};

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
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



