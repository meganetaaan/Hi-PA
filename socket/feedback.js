var io = require('./io').io();

var feedback = {};
feedback.speed = {fast : 0, slow : 0};
feedback.sound = {loud : 0, small : 0};
feedback.threshold = {
    speed : 0.1,
    sound : 0.1
}
feedback.reset = () => {
    feedback.speed = {fast : 0, slow : 0};
    feedback.sound = {loud : 0, small : 0};
}
feedback.presenter = io.of('/socket/feedback/presenter');
feedback.audience = io.of('/socket/feedback/audience');
feedback.audience.on('connection', (socket) => {
    console.log('feedback audience connected');
    socket.on('disconnect', (socket) => {
        console.log('feedback audience disconnected');
    });
    socket.on('SpeedFeedback', (data) => {
        switch(data.sign) {
            case -1:
                feedback.speed.slow++;
                break;
            case 1:
                feedback.speed.fast++;
                break;
        }
        feedback.presenter.emit('SpeedFeedback', feedback.speed);
    });
    socket.on('VolumeFeedback', (data) => {
        switch(data.sign) {
            case -1:
                feedback.sound.small++;
                break;
            case 1:
                feedback.sound.loud++;
        }
        feedback.presenter.emit('VolumeFeedback', feedback.sound);
    });
});
feedback.send = () => {
    var speed = 0;
    var volume = 0;
    // TODO : add logic!
    if (1 > feedback.threshold.speed * 1) {
        speed = 1;
    } else {
        speed = -1;
    }
    if (1 > feedback.threshold.volume * 1) {
        volume = 1;
    } else {
        volume = -1;
    }
    return {speed : speed, volume : volume};
}
module.exports = feedback;
