var io = require('./io').io();
var Time = require('../model/time');
var Script = require('../model/Script');
var Question = require('../model/Question');
var question = require('./question');

var time = {};
time.presenter = io.of('/socket/time/presenter');
time.presenter.on('connection', (socket) => {
    console.log('time socket on');
    socket.on('SetTimeState', function (data) {
        if (data.state == 'END') {
            Script.reset();
            Question.reset();
            question.io.emit('DELETE_ALL', {});
        }
        Time.setTimeState(data);
    });
    socket.on('disconnect', function(socket) {
        Time.setTimeState({state:'PAUSED'});
    });
});
module.exports = time;
