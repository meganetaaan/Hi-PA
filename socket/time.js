var io = require('./io').io();
var Time = require('../model/time');

var time = {};
time.presenter = io.of('/socket/time/presenter');
time.presenter.on('conncetion', (socket) => {
    console.log('hagi shilta');
    socket.on('SetTimeState', function (data) {
        Time.setTimeState(data);
    });
});
module.exports = time;
