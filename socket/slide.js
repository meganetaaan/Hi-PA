var slideCtrl = require('../slide.controller');
modules.exports = function (io) {
    var slide = {};
    slide.audience = io.of('/socket/script/audience');
    slide.presenter = io.of('/socket/slide/presenter');
    slide.presenter.on('connection', function(socket) {
        console.log('presenter connected to slides');
        socket.on('disconnect', function(socket) {
            console.log('presenter disconnected out slides');
        });

        // Get Init Data
        var slides = slideCtrl.getSlide('slide_01');
        var initData = {
            slideData : slides,
        }
        socket.emit('initdata', initData);

        // slideの操作
        socket.on('slidestatechanged', function(data) {
            slideCtrl.updateState('slide_01', data.slideData.state);
            slide.audience.emit('slidestatechanged', data);
        });

        socket.on('slidecontentchanged', function(data) {
            slideCtrl.updateSlide('slide_01', data.slideData);
            slide.audience.broadcast.emit('slidecontentchanged', data);
        });
    });
    return slide;
}
