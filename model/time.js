var time = {
    state : 'END',
    duration : 0,
    passedTime : 0,
}

function getTime() {
    return time.duration - time.passedTime;
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
time.getTime = getTime;
time.getAlert = getAlert;
time.setTimeState = setTimeState;
time.getTimeState = getTimeState;

module.exports = time;
