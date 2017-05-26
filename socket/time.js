var io = require('./io').io();
var Time = require('../model/time');
var Script = require('../model/Script');

var time = {};
time.presenter = io.of('/socket/time/presenter');
time.presenter.on('connection', (socket) => {
    console.log('hagi shilta');
    socket.on('SetTimeState', function (data) {
        if (Time.state == 'END' && data.state == 'STARTED') {
            Script.reset();
        }
        Time.setTimeState(data);
    });
});
module.exports = time;
