var time = {
    state : 'END',
    duration : 0,
    passedTime : 0,
}

function getTime() {
    return duration - passedTime;
}

function getAlert() {
    return true;
}

function setTimeState(data) {
    time.state = data.state;
    if (data.duration !== null) {
        time.duration = data.duration;
    }
}

function getTimeState() {
    return time;
}
