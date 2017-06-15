var slideCtrl = require('../model/slide');
var io = require('./io').io();
var time = require('../model/time');
var feedback = require('./feedback');
var alert = require('../model/alert');
var alertsock = require('./alert');
var question = require('./question');
var Question = require('../model/Question');
var tooltip = require('./tooltip');
var slide = {};

slide.audience = io.of('/socket/slide/audience');
slide.audience.on('connection', function(socket) {
    console.log('client connected to slides');
    socket.on('disconnect', function(socket) {
        console.log('client disconnected out slides');
    });
    let slides = slideCtrl.getSlide('slide_01');
    let initData = {
        slideData : slides
    }
    socket.emit('initdata', initData);
});
slide.presenter = io.of('/socket/slide/presenter');
slide.presenter.on('connection', function(socket) {
    console.log('presenter connected to slides');
    socket.on('disconnect', function(socket) {
        console.log('presenter disconnected out slides');
    });

    // Get Init Data
    let slides = slideCtrl.getSlide('slide_01');
    let initData = {
        slideData : slides
    }
    socket.emit('initdata', initData);

    // slideの操作
    socket.on('slidestatechanged', function(data) {
        slideCtrl.updateState('slide_01', data.slideData.state);
        if (data.slideData.state.indexh === 1) {
            var q = Question({slideNumber : 3, nickname : 'Sewon Min', password : 'trybruteforcing', question : 'What is Language Modeling', like : 100});
            tooltip.term['tooltip'] = 100;
            q.save((err, q) => {
                question.io.emit('ADD_QUESTION', q);
            });
        }
        if (data.slideData.state.indexh === 3) {
            feedback.speed = {fast : 1001, slow : 0};
        }
        slide.audience.emit('slidestatechanged', data);
        console.log(time.state);
        if (time.state === 'STARTED') {
            alertsock.presenter.emit('Alert', {
                realtimefeedback : feedback.send(),
                duration : slides.duration,
                passedTime : time.getTime(),
                timeAlert : alert.getTimeAlert()
            });
        }
    });

    socket.on('slidecontentchanged', function(data) {
        slideCtrl.updateSlide('slide_01', data.slideData);
        slide.audience.broadcast.emit('slidecontentchanged', data);
    });
});
module.exports = slide;
