var io = require('./io').io();

var tooltip = {
    terms : {}
}

tooltip.audience = io.of('/socket/tooltip/audience');
tooltip.audience.on('connect', function (socket) {
    socket.on('Searched', function (data) {
        if (typeof terms[data.term] === 'undefined') {
            terms[data.term] = 0;
        }
        terms[data.term]++;
    });
});
