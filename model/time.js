var slide = require('./slide').getSlide('slide_01');
var timer = require('elapsed-time');
var timescale = require('timescale');

var time = {
    state : 'END',
    duration : slide.duration,
    passedTime : 0,
    slideTime : slide.duration / slide.slideNo,
    et : timer.new()
}

function getTime() {
    return timescale(time.et.getRawValue(),'ns','s');
}

function setTimeState(data) {
    switch(data.state) {
        case 'STARTED':
            if (time.state === 'END')
                time.et.start();
            else
                time.et.resume();
            break;
        case 'END':
            time.et.reset();
            break;
        case 'PAUSED':
            time.et.pause();
            break;
    }
    time.state = data.state;
}

function getTimeState() {
    time.passedTime = getTime();
    return time;
}
time.getTime = getTime;
time.setTimeState = setTimeState;
time.getTimeState = getTimeState;

module.exports = time;
