var io = require('./io').io();
var Time = require('../model/time');
var Script = require('../model/Script');
var script = require('./script');
var Question = require('../model/Question');
var question = require('./question');
var tooltip = require('./tooltip');

var time = {};
time.presenter = io.of('/socket/time/presenter');
time.presenter.on('connection', (socket) => {
    console.log('time socket on');
    socket.on('SetTimeState', function (data) {
        if (data.state == 'END') {
            Script.reset();
            Question.reset();
            question.io.emit('DELETE_ALL', {});
            script.audience.emit('DELETE_ALL', {});
            tooltip.term = {};
            let permanentQuestion = new Question({slideNumber : 3, nickname : 'Sewon Min', password : 'trybruteforcing', question : 'What is Language Modeling', like : 100});
            permanentQuestion.save((err, q) => {
                question.io.emit('ADD_QUESTION', q);
            });
        }
        Time.setTimeState(data);
    });
    socket.on('disconnect', function(socket) {
        Time.setTimeState({state:'PAUSED'});
    });
});
module.exports = time;
